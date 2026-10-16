"""Voce più musica, con i livelli che hanno funzionato su questo video.

Uso:  python strumenti/mix.py voce-pulita.wav musica.mp3 assets/audio.wav [--durata 79.2] [--musica-db -3.5]

  - la voce si posa a 0,5 s (--inizio) dopo aver tolto --taglio secondi in testa;
  - la musica sta --musica-db sotto il parlato e scende di altri 2 dB mentre si parla (ducking): a -15 dB non si
    sentiva, a -8 dB senza ducking copriva la voce;
  - se la musica è più corta del video si ripete con un piccolo incrocio, e sfuma nell'ultimo secondo e mezzo;
  - il totale va a -17 LUFS: a -14 e a -16 la voce registrata al telefono «urlava».

Il mix del video pubblicato aveva in più la musica allineata a un battere su una parola, una pausa filtrata e gli
effetti sonori sugli stacchi: qui c'è la base, da cui partire.
"""
import argparse
import json
import os
import subprocess

import numpy as np

p = argparse.ArgumentParser()
p.add_argument('voce')
p.add_argument('musica')
p.add_argument('uscita')
p.add_argument('--durata', type=float, help='secondi del video; se manca la legge da assets/durata.json')
p.add_argument('--inizio', type=float, default=0.5)
p.add_argument('--taglio', type=float, default=0.0)
p.add_argument('--musica-db', type=float, default=-3.5)
p.add_argument('--lufs', type=float, default=-17.0)
a = p.parse_args()

SR = 48000
DUR = a.durata or json.load(open('assets/durata.json'))['durata']
N = int(SR * DUR)
db = lambda x: 10 ** (x / 20)


def carica(path, stereo):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-f', 'f32le', '-ac', '2' if stereo else '1',
                          '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    x = np.frombuffer(raw, np.float32).copy()
    return x.reshape(-1, 2) if stereo else x


v = carica(a.voce, False)[int(a.taglio * SR):]
voce = np.zeros(N, np.float32)
st = int(a.inizio * SR)
voce[st:st + len(v)] = v[:N - st]

m = carica(a.musica, True)
XF = int(.05 * SR)
letto = m.copy()
while len(letto) < N:
    f = np.linspace(0, 1, XF)[:, None]
    letto[-XF:] = letto[-XF:] * (1 - f) + m[:XF] * f
    letto = np.concatenate([letto, m[XF:]])
letto = letto[:N]
coda = int(1.4 * SR)
letto[-coda:] *= np.linspace(1, 0, coda)[:, None]

v_rms = np.sqrt(np.mean(v[np.abs(v) > db(-35)] ** 2))
m_rms = np.sqrt(np.mean(m ** 2)) + 1e-9
letto *= v_rms * db(a.musica_db) / m_rms

h = int(.02 * SR)
parla = np.repeat(np.sqrt(np.mean(voce[:N // h * h].reshape(-1, h) ** 2, axis=1)) > db(-40), h).astype(np.float32)
parla = np.pad(parla, (0, N - len(parla)))
duck = np.empty(N, np.float32)
g = 1.0
for i in range(0, N, h):
    obiettivo = db(-2) if parla[i] else 1.0
    g += (obiettivo - g) * (.5 if obiettivo < g else .08)
    duck[i:i + h] = g
letto *= duck[:, None]

mix = np.clip(voce[:, None] + letto, -1, 1).astype(np.float32)
grezzo = a.uscita + '.grezzo.wav'
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', grezzo],
               input=mix.tobytes(), check=True)
err = subprocess.run(['ffmpeg', '-hide_banner', '-i', grezzo, '-af', 'loudnorm=print_format=json', '-f', 'null', '-'],
                     capture_output=True, text=True).stderr
info = json.loads(err[err.rindex('{'):err.rindex('}') + 1])
guadagno = a.lufs - float(info['input_i'])
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', grezzo, '-af', f'volume={guadagno:.2f}dB,alimiter=limit=0.84:level=false',
                a.uscita], check=True)
os.remove(grezzo)
print('mix scritto in %s: da %.1f LUFS, guadagno %+.1f dB verso %.0f LUFS' % (a.uscita, float(info['input_i']), guadagno, a.lufs))
