"""Dalla voce registrata alle parole con i loro tempi, sul tuo computer e gratis (Whisper, via faster-whisper).

Uso:  python strumenti/parole.py voce.wav parole.json [--modello small] [--lingua it]

Esce una lista [{"w": parola, "s": inizio, "e": fine}] in secondi. La leggono sottotitoli.py, tempi_scene.py,
voce_pulita.py e mix.py. Il primo giro scarica il modello (small: circa 500 MB); medium e large-v3 sono più precisi
e più lenti.
"""
import argparse
import json
import subprocess

import numpy as np
from faster_whisper import WhisperModel

p = argparse.ArgumentParser()
p.add_argument('voce')
p.add_argument('uscita')
p.add_argument('--modello', default='small')
p.add_argument('--lingua', default='it')
a = p.parse_args()

# L'audio lo legge ffmpeg e non la libreria interna di faster-whisper: con PyAV 16 quella si rompe all'apertura del file.
pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', a.voce, '-f', 'f32le', '-ac', '1', '-ar', '16000', '-'],
                     capture_output=True, check=True).stdout
audio = np.frombuffer(pcm, np.float32)

modello = WhisperModel(a.modello, device='cpu', compute_type='int8')
segmenti, _ = modello.transcribe(audio, language=a.lingua, word_timestamps=True, vad_filter=True)
parole = [{'w': x.word.strip(), 's': round(x.start, 3), 'e': round(x.end, 3)}
          for s in segmenti for x in s.words if x.word.strip()]
json.dump(parole, open(a.uscita, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(len(parole), 'parole; la prima a %.2f s, l\'ultima finisce a %.2f s' % (parole[0]['s'], parole[-1]['e']))
