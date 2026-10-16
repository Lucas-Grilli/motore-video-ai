"""Sottotitoli una riga alla volta, dalle parole con i tempi.

Uso:  python strumenti/sottotitoli.py parole.json assets/captions.js [--sposta 0.5] [--max 46] [--unisci unisci.json]

Regole, quelle usate in questo video:
  - un blocco finisce sulla punteggiatura; se è più lungo di --max caratteri si spezza, preferibilmente prima di
    una parola debole («di», «e», «che», «per»…) e vicino a metà;
  - due blocchi brevi e vicini (meno di 0,35 s fra loro) si fondono, se insieme stanno in 34 caratteri;
  - ogni blocco resta a schermo fino al successivo se la pausa è corta, altrimenti 0,3 s dopo l'ultima parola.

--sposta è lo spostamento della voce nel video (in questo video la voce parte a 0,5 s).
--unisci è un JSON {"frase detta": "come si scrive"}: utile per nomi e indirizzi che Whisper scrive a pezzi
(es. {"dove vanno i nostri soldi punto com": "DoveVannoINostriSoldi.com", "centodieci": "110"}).
Esce window.CAP = [{t, in, out}], che la composizione legge da assets/captions.js.
"""
import argparse
import json
import re

p = argparse.ArgumentParser()
p.add_argument('parole')
p.add_argument('uscita')
p.add_argument('--sposta', type=float, default=0.5)
p.add_argument('--max', type=int, default=46)
p.add_argument('--unisci')
a = p.parse_args()

w = json.load(open(a.parole, encoding='utf-8'))
unisci = json.load(open(a.unisci, encoding='utf-8')) if a.unisci else {}
frasi = sorted(((k.lower().split(), v) for k, v in unisci.items()), key=lambda x: -len(x[0]))
DEBOLI = {'tra', 'di', 'e', 'con', 'a', 'ad', 'che', 'per', 'in', 'alle', 'dalle', 'verso'}
low = [x['w'].lower().strip('.,:;?!') for x in w]

tok, i = [], 0
while i < len(w):
    for chiave, scritto in frasi:
        n = len(chiave)
        if low[i:i + n] == chiave:
            coda = re.sub(r'^.*?([.,:;?!]*)$', r'\1', w[i + n - 1]['w'])
            tok.append((scritto + coda, w[i]['s'] + a.sposta, w[i + n - 1]['e'] + a.sposta))
            i += n
            break
    else:
        tok.append((w[i]['w'], w[i]['s'] + a.sposta, w[i]['e'] + a.sposta))
        i += 1

testo = lambda seg: ' '.join(x[0] for x in seg)
clausole, cur = [], []
for t in tok:
    cur.append(t)
    if re.search(r'[.?!:,;]$', t[0]):
        clausole.append(cur)
        cur = []
if cur:
    clausole.append(cur)


def spezza(seg):
    if len(testo(seg)) <= a.max or len(seg) == 1:
        return [seg]
    j = min(range(1, len(seg)), key=lambda k: (0 if seg[k][0].lower() in DEBOLI else 1,
                                               abs(len(testo(seg[:k])) - len(testo(seg)) / 2)))
    return spezza(seg[:j]) + spezza(seg[j:])


blocchi = [b for c in clausole for b in spezza(c)]
fusi = []
for b in blocchi:
    if fusi and len(testo(fusi[-1]) + ' ' + testo(b)) <= 34 and not re.search(r'[.?!:]$', fusi[-1][-1][0]) \
            and b[0][1] - fusi[-1][-1][2] < 0.35:
        fusi[-1] = fusi[-1] + b
    else:
        fusi.append(b)

cap = []
for j, b in enumerate(fusi):
    dopo = fusi[j + 1][0][1] if j + 1 < len(fusi) else None
    fine = dopo - .05 if dopo is not None and dopo - b[-1][2] < .7 else b[-1][2] + .3
    cap.append({'t': testo(b), 'in': round(max(0, b[0][1] - .05), 3), 'out': round(fine, 3)})

open(a.uscita, 'w', encoding='utf-8').write('window.CAP=' + json.dumps(cap, ensure_ascii=False) + ';\n')
print(len(cap), 'righe; la più lunga ha', max(len(c['t']) for c in cap), 'caratteri')
