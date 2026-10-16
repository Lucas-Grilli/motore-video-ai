"""Pulizia minima di una voce registrata al telefono in una stanza normale.

Uso:  python strumenti/voce_pulita.py voce.wav parole.json voce-pulita.wav

Niente compressore e niente guadagno «da studio»: su una stanza normale alzano le code di riverbero e la voce
rimbomba (misurato su questo video: circa 6 dB in più). Fa solo quattro cose:
  - abbassa di 10 dB i respiri e i rumori nelle pause fra le parole (le pause le prende da parole.json);
  - taglia sotto gli 80 Hz;
  - toglie un po' del «boom» di stanza sui medio-bassi (220 e 500 Hz);
  - accorcia le code di riverbero fra le parole con un espansore morbido.
"""
import json
import subprocess
import sys

import numpy as np

SR = 48000
voce, parole, uscita = sys.argv[1:4]
w = json.load(open(parole, encoding='utf-8'))
a = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', voce, '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'],
                                 capture_output=True, check=True).stdout, np.float32).copy()

g = np.ones(len(a), np.float32)
basso = 10 ** (-10 / 20)
f = int(.03 * SR)
pause = [(0.0, w[0]['s'] - .04)] + [(w[i]['e'] + .05, w[i + 1]['s'] - .035) for i in range(len(w) - 1)] \
        + [(w[-1]['e'] + .1, len(a) / SR)]
for s, e in pause:
    i, j = int(s * SR), int(e * SR)
    if j - i < int(.14 * SR):
        continue
    g[i:j] = basso
    g[i:i + f] = np.linspace(1, basso, f)
    g[j - f:j] = np.linspace(basso, 1, f)

catena = ','.join(['highpass=f=80',
                   'equalizer=f=220:width_type=o:width=1.4:g=-3',
                   'equalizer=f=500:width_type=o:width=1:g=-1.5',
                   'agate=threshold=0.025:ratio=1.6:attack=4:release=90:range=0.45:knee=4',
                   'alimiter=limit=0.89:level=false'])
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-', '-af', catena, uscita],
               input=(a * g).tobytes(), check=True)
print('scritto', uscita)
