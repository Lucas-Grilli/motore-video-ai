# SuperPino — lancio con voce registrata

Il video di lancio di SuperPino, l'assistente di [ItaliaAperta](https://italiaaperta.it) che prepara le segnalazioni al Comune: 79 secondi, 16:9, una persona vera che legge il testo, sottotitoli, illustrazioni piatte disegnate in codice, musica ed effetti sui tagli. È il video pubblicato per il lancio, rifatto da questa cartella.

**È l'esempio da guardare per una voce registrata:** Poltronave non ha voce, DVNS ha una voce generata.

<p align="center">
  <img src="output/preview.gif" width="480" alt="Anteprima del lancio SuperPino">
</p>

[🔊 Video con audio](output/superpino-lancio.mp4) · fotogrammi in [`snapshots/`](snapshots/)

Il brief: il testo letto e registrato al telefono, e tre parole sul tono, «super figo, quick & cool», come un lancio Apple.

## Cosa mostra tecnicamente

- **Le scene partono sulle parole, non sui secondi.** `assets/cues.js` tiene inizio e fine di ogni parola detta (`W[i]`) e la composizione aggancia ogni stacco a una parola. Se cambi la registrazione, `strumenti/tempi_scene.py` rimette a tempo tutto il video.
- **Sottotitoli una riga alla volta**, generati dalle stesse parole. A schermo non si ripete quello che si sente: ci vanno immagini, numeri, nomi propri e interfaccia.
- **Una voce di telefono in una stanza normale** pulita al minimo, senza compressione: la compressione alzava il rimbombo della stanza.
- **Musica circa 3,5 dB sotto il parlato**, 2 dB in meno mentre si parla; totale a −17 LUFS.

## Render

```bash
npm run check
npm run render
```

Il render esce circa 2,5 dB più basso del video pubblicato, che ha la traccia audio attaccata così com'è. Per avere l'audio identico:

```bash
ffmpeg -i renders/<file>.mp4 -i assets/audio.mp3 -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k finale.mp4
```

## Rifallo con la tua voce

Oltre ai prerequisiti del [README principale](../../README.md) (Node, ffmpeg) serve Python 3 con tre librerie:

```bash
pip install numpy scipy faster-whisper
```

1. **Registra il testo** col telefono, in una stanza tranquilla.
2. **Parole e tempi**, con Whisper sul tuo computer, gratis:
   ```bash
   python strumenti/parole.py voce.m4a parole.json
   ```
   Il modello `small` sbaglia qualche parola (nella prova: «apparti» per «appalti»). Apri `parole.json` e correggile a mano, oppure usa `--modello medium`, più preciso e più lento.
3. **Pulizia della voce:**
   ```bash
   python strumenti/voce_pulita.py voce.m4a parole.json voce-pulita.wav
   ```
4. **Scene a tempo.** Se rileggi lo stesso testo:
   ```bash
   python strumenti/tempi_scene.py strumenti/parole-riferimento.json parole.json
   ```
   e metti la durata stampata in `data-duration` dentro `index.html`. Con un testo tuo le scene le riscrive il tuo agente, agganciandole allo stesso modo agli indici di `parole.json`.
5. **Sottotitoli:**
   ```bash
   python strumenti/sottotitoli.py parole.json assets/captions.js
   ```
   Con `--unisci unisci.json` decidi come si scrivono nomi e indirizzi che Whisper spezza (`{"italia aperta punto it": "ItaliaAperta.it", "centodieci": "110"}`).
6. **Mix** con una musica tua:
   ```bash
   python strumenti/mix.py voce-pulita.wav musica.mp3 assets/audio.wav
   ```
   e in `index.html` cambia `src="assets/audio.mp3"` in `src="assets/audio.wav"`.
7. `npm run render`.

Collaudo del 16/10/2026, da un ambiente Python nuovo su Linux (faster-whisper, modello `small`): 184 parole trascritte, 159 delle 180 di riferimento agganciate, mix a −17,1 LUFS.

## Cosa si è rotto per strada

Otto versioni in meno di un giorno, quasi tutte sull'audio:

- a 15–17 dB sotto la voce la musica non si sentiva; a 8 dB senza ducking copriva la voce;
- il trattamento «da studio» faceva rimbombare la voce registrata al telefono: compressione e guadagno alzavano le code della stanza di circa 6 dB;
- a −14 e −16 LUFS la voce «urlava»: il master giusto era −17.

## Crediti e limiti

Font [Inter](https://rsms.me/inter/) (SIL Open Font License), animazione con [GSAP](https://gsap.com/), trascrizione con [faster-whisper](https://github.com/SYSTRAN/faster-whisper). Musica ed effetti generati con ElevenLabs. Il codice si riusa; nome, marchio e illustrazioni di SuperPino restano di ItaliaAperta.
