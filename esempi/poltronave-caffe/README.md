# Poltronave — Caffè V3

Reel di lancio di [Poltronave](https://poltronave.it), 15 secondi: apertura "Tu ti fermi per la pausa caffè" → "Invece il debito pubblico non si ferma mai", poi il contatore satirico e uno scontrino animato con la cifra vera del debito pubblico italiano (fonte Banca d'Italia, in chiusura).

**Cosa mostra tecnicamente:**
- Un contatore numerico che anima una cifra a tredici cifre, calcolato dal tempo del video (`build-v3.cjs`) — resta identico ad ogni ri-render, non c'è casualità.
- Musica chiptune e sprite pixel originali (`assets/`).
- Nessuna voce: il testo è tutto a schermo, ritmato dalla musica.

**Render:**

```bash
npm run render -- --quality delivery --fps 30 --workers 2 --output output/poltronave-caffe-v3-15s.mp4
npm run check
```

Output di riferimento già in `output/`: la versione base e una variante con il totale in crescita continua, calcolate dallo stesso snapshot (`debt-snapshot.json`) — due esecuzioni della stessa versione producono lo stesso file, niente `Date.now()` o numeri casuali dentro la composizione.

Poltronave è satira dichiarata (parodia di nyan cat, caricature non fotografie) — non uno strumento informativo. Codice e cifre esatti su [poltronave.it](https://poltronave.it).
