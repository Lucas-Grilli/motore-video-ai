"""Rimette a tempo le scene su una nuova registrazione dello stesso testo.

Uso:  python strumenti/tempi_scene.py strumenti/parole-riferimento.json parole-nuove.json [--taglio 0] [--coda 2.76]

La composizione non usa secondi scritti a mano: ogni scena parte su una parola, W[i] = [inizio, fine] della parola
numero i del testo (vedi index.html). Questo script allinea le parole della nuova registrazione a quelle di
riferimento e riscrive assets/cues.js, così le scene seguono la nuova voce. Dove la grafia cambia («dove vanno i
nostri soldi punto com» contro «dovevannoinostrisoldi.com») le parole di riferimento si spartiscono quelle nuove in
proporzione; quelle senza corrispondenza prendono il tempo delle vicine.

--taglio: secondi tolti in testa alla nuova voce, che nel video si posa a 0,5 s.
--coda: secondi di video dopo l'ultima parola (logo e chiusura). Scrive anche assets/durata.json.
"""
import argparse
import difflib
import json
import re

p = argparse.ArgumentParser()
p.add_argument('riferimento')
p.add_argument('nuove')
p.add_argument('--taglio', type=float, default=0.0)
p.add_argument('--coda', type=float, default=2.76)
p.add_argument('--cues', default='assets/cues.js')
p.add_argument('--durata', default='assets/durata.json')
a = p.parse_args()

vecchie = json.load(open(a.riferimento, encoding='utf-8'))
nuove = json.load(open(a.nuove, encoding='utf-8'))
sposta = 0.5 - a.taglio
nz = lambda x: re.sub(r'[^a-zàèéìòù0-9]', '', x.lower())
sm = difflib.SequenceMatcher(None, [nz(x['w']) for x in vecchie], [nz(x['w']) for x in nuove], autojunk=False)

W = [None] * len(vecchie)
for op, i1, i2, j1, j2 in sm.get_opcodes():
    if op == 'equal':
        for k in range(i2 - i1):
            W[i1 + k] = [nuove[j1 + k]['s'], nuove[j1 + k]['e']]
    elif op == 'replace' or (op == 'delete' and j2 > j1):
        m, n = i2 - i1, j2 - j1
        for k in range(m):
            x, y = j1 + (k * n) // m, j1 + max((k + 1) * n // m, (k * n) // m + 1) - 1
            W[i1 + k] = [nuove[x]['s'], nuove[min(y, j2 - 1)]['e']]
for i in range(len(W)):
    if W[i] is None:
        prima = next((W[k] for k in range(i - 1, -1, -1) if W[k]), [0.0, 0.0])
        dopo = next((W[k] for k in range(i + 1, len(W)) if W[k]), prima)
        W[i] = [prima[1], dopo[0]]
W = [[round(s + sposta, 3), round(e + sposta, 3)] for s, e in W]

open(a.cues, 'w', encoding='utf-8').write('window.W=' + json.dumps(W) + ';\n')
durata = round(nuove[-1]['e'] + sposta + a.coda, 1)
json.dump({'durata': durata, 'off': round(sposta, 3)}, open(a.durata, 'w'))
uguali = sum(i2 - i1 for op, i1, i2, _, _ in sm.get_opcodes() if op == 'equal')
print('parole di riferimento %d, nuove %d, uguali %d; video da %.1f s' % (len(vecchie), len(nuove), uguali, durata))
print('Ricorda: se la durata cambia, aggiorna data-duration in index.html.')
