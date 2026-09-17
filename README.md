<p align="center">
  <img src="assets/copertina_motore-video-ai.png" alt="motore-video-ai — bobina di pellicola" width="100%">
</p>

<h1 align="center">motore-video-ai</h1>

<p align="center">
  <strong>Il motore non sta qui dentro. Ci sta il modo di trovarlo.</strong><br>
  La cartella che dice alla tua AI agentica dove sono il motore video e la voce, glieli fa vedere già al lavoro su due reel veri, e le lascia un editor visivo per correggere senza riscrivere codice.
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/licenza-MIT-CA632B.svg" alt="Licenza MIT"></a>
  <img src="https://img.shields.io/badge/versione-0.2-CA632B.svg" alt="Versione 0.2">
  <img src="https://img.shields.io/badge/lingua-italiano-CA632B.svg" alt="In italiano">
</p>

<p align="center">
  <a href="#per-chi-è">Per chi è</a> ·
  <a href="#costruisci-il-tuo-video">Costruisci il tuo video</a> ·
  <a href="#leditor-visivo">L'editor visivo</a> ·
  <a href="#esempi">Esempi</a> ·
  <a href="#le-scelte-che-lo-tengono-in-piedi">Le scelte</a> ·
  <a href="#cosa-non-fa">Cosa non fa</a>
</p>

Hai un'AI agentica (Claude Code, Codex, o equivalente) e vuoi che ti costruisca un video: un numero che sale, un confronto tra due dati, una domanda con la risposta, magari con una voce che lo spiega. Verticale per Reels/TikTok, orizzontale, quadrato — il formato lo decidi tu, non lo impone il motore. Il render sa già farlo qualcun altro — un motore per l'animazione ([HyperFrames](https://hyperframes.heygen.com/)), un servizio per la voce ([ElevenLabs](https://elevenlabs.io/)). Il problema non è il rendering: è dire alla tua AI dove sono e come si usano insieme, senza installare o incollare niente a mano.

Questa cartella è quel puntatore. Non un motore, non un framework tutto suo: due reel veri da guardare e un'unica pagina che dice all'agente cosa installare e dove guardare.

---

## Guarda la demo in azione

> 🎬 *Demo video in arrivo — nel frattempo, gli [esempi](#esempi) qui sotto sono reel reali, già online.*

---

## Per chi è

- Hai un'AI agentica e le vuoi far costruire un video partendo da un dato o un'idea, non da zero in un editor.
- Non vuoi imparare un motore di animazione: vuoi che l'agente lo installi e lo usi da solo.
- Ti serve anche una voce narrante credibile, non solo grafica animata.
- Vuoi comunque poter aprire un editor visivo e correggere a mano un dettaglio, senza rifare tutto da codice.
- Hai già Node e un terminale, ma non vuoi configurare nulla oltre a una chiave API.

**Per chi non è:** se cerchi un editor puro, senza agente — solo tu che tagli e trascini clip — questo non è il punto d'ingresso giusto: qui l'agente scrive la composizione, l'editor visivo serve a rifinirla, non a costruirla da zero col mouse.

---

## Costruisci il tuo video

Non scarichi né configuri niente a mano: lo fa l'agente, seguendo questa stessa pagina.

**1. Crea una cartella vuota** dove vuoi sul computer.

**2. Puntaci il tuo assistente** — Claude Code, Codex o equivalente, come cartella di lavoro.

**3. Incolla questo prompt e invia:**

```text
Scarica lo zip di https://github.com/Lucas-Grilli/motore-video-ai (branch main) ed estrai il contenuto direttamente in questa cartella. Poi cancella lo zip scaricato, apri README.md e segui da qui in poi la sezione "Costruisci il tuo video" — chiedimi cosa voglio costruire solo quando arrivi al punto in cui serve davvero.
```

**4. Da qui in poi è l'agente che legge il resto di questa sezione ed esegue:**

<details open>
<summary><b>Passi per l'agente</b></summary>

1. **Prerequisiti** — verifica ed eventualmente installa: `node -v` (≥18), `ffmpeg -version`, `git --version`. Se mancano, installali per il sistema operativo rilevato prima di proseguire.
2. **Motore video: HyperFrames.** Non si scrive un motore di rendering da zero e non se ne vendorizza il codice qui dentro — si installa dal suo pacchetto ufficiale:
   ```bash
   npx hyperframes init
   ```
   Il comando genera un progetto con la sua stessa documentazione (`AGENTS.md`/`CLAUDE.md`, `npx hyperframes docs <topic>`, indice completo su `https://hyperframes.heygen.com/llms.txt`): leggila, è la fonte primaria per struttura, comandi e regole di composizione. Non improvvisare un formato diverso da quello che quei file descrivono.
3. **Voce narrante: ElevenLabs.** Se il video ha bisogno di una voce, la chiave si legge da una variabile d'ambiente, mai da un file o da un prompt:
   ```bash
   export ELEVENLABS_API_KEY="..."   # macOS/Linux
   $env:ELEVENLABS_API_KEY = "..."   # Windows PowerShell
   ```
   Se manca, chiedila all'utente invece di inventare o saltare il passo. Modello consigliato: `eleven_multilingual_v2`.
4. **Guarda gli [esempi](#esempi)** prima di scrivere la tua composizione: mostrano struttura file, timing (`data-start`, `class="clip"`) e come si integra la voce quando c'è.
5. **Solo ora chiedi all'utente cosa vuole costruire** — argomento, formato e orientamento, durata indicativa, se serve voce o no — e costruisci sul progetto HyperFrames appena installato.
6. **Apri l'[editor visivo](#leditor-visivo)** (`npx hyperframes preview --background`) prima di dichiarare finito: è lì che si vedono i dettagli che il codice da solo non mostra.

</details>

<details>
<summary><b>Preferisci installare a mano?</b></summary>

Serve se lavori su claude.ai o sull'app dove l'assistente non scrive in una cartella del tuo computer, o se preferisci partire da git:

```bash
git clone https://github.com/Lucas-Grilli/motore-video-ai.git
cd motore-video-ai
npx hyperframes init
```

Poi apri una chat con il tuo assistente in quella cartella e scrivi cosa vuoi costruire.

</details>

---

## L'editor visivo

HyperFrames non si pilota solo scrivendo HTML: porta con sé uno **Studio** locale completo — canvas, timeline, layer, inspector — che si apre in un comando e resta acceso mentre lavori:

```bash
npx hyperframes preview --background
```

<p align="center">
  <img src="assets/screenshot-studio.png" alt="HyperFrames Studio: canvas, timeline a scene, pannello Design/Layers/Renders/Variables" width="720">
  <br><em>(screenshot in arrivo)</em>
</p>

Da lì puoi scorrere la timeline, aprire ogni scena come blocco separato, ispezionare o modificare un elemento col pannello Design a destra — e quando qualcosa non ti convince, **selezionarlo e descrivere il cambiamento**: l'agente riceve file, istante preciso e bersaglio esatto, senza che tu debba spiegarlo a parole o riaprire il codice. Guardare e scorrere nello Studio non consuma un solo token: il costo entra solo quando chiedi davvero una modifica.

Non sostituisce l'agente — resta lui a scrivere la composizione — ma è la superficie giusta per le rifiniture: uno spazio che non torna, un colore che stona, un timing di un frame. Il contratto completo (comandi, URL di sessione, ponte di selezione) vive nella documentazione che `npx hyperframes init` installa nel tuo progetto.

---

## Come funziona

```mermaid
flowchart LR
    A["tu: un'idea<br/>o un dato"] --> B["l'agente legge<br/>questo README"]
    B --> C["installa HyperFrames<br/>(npx hyperframes init)"]
    B --> D["imposta la chiave<br/>ElevenLabs, se serve voce"]
    C --> E["guarda esempi/<br/>per struttura e timing"]
    D --> E
    E --> F["scrive la composizione<br/>del tuo video"]
    F --> G["apri lo Studio<br/>per rifinire"]
    G --> H["npm run render"]
```

Nessun pezzo di questo repo genera un frame da solo: HyperFrames anima, renderizza e mostra lo Studio; ElevenLabs parla; tu decidi il contenuto. Questa cartella mette i pezzi insieme e li mostra funzionare su casi veri.

---

## Esempi

Due reel realmente pubblicati, non demo giocattolo — codice e asset in `esempi/`, sanificati da ogni riferimento privato.

<table>
<tr>
<td align="center" width="50%">
<img src="esempi/poltronave-caffe/output/preview.gif" width="220" alt="Anteprima Poltronave — Caffè V3"><br>
<b>Poltronave — Caffè V3</b><br>satira, no voce
</td>
<td align="center" width="50%">
<img src="esempi/dvns-calascio-abruzzo/output/preview.gif" width="220" alt="Anteprima DVNS — Calascio, Abruzzo"><br>
<b>DVNS — Calascio, Abruzzo</b><br>quiz narrato, con voce
</td>
</tr>
</table>

| Esempio | Cosa mostra | Voce | Fonte |
|---|---|---|---|
| [`poltronave-caffe/`](esempi/poltronave-caffe/) | Contatore satirico che sale, scontrino animato, musica chiptune originale | No | [poltronave.it](https://poltronave.it) |
| [`dvns-calascio-abruzzo/`](esempi/dvns-calascio-abruzzo/) | Quiz narrato su un comune d'Abruzzo, voce ElevenLabs sincronizzata parola per parola, mappa animata | **Sì** | [dovevannoinostrisoldi.com](https://www.dovevannoinostrisoldi.com/) |

**Dove Vanno I Nostri Soldi** è un sistema editoriale sui conti pubblici italiani (dati verificati, registro apartisan); il codice di questo esempio è la loro repo, qui dentro. **Poltronave** è un contatore satirico del debito pubblico, parodia dichiarata di nyan cat — i due progetti restano separati anche qui: mai la stessa scena, mai lo stesso branding.

Ogni cartella ha un suo `README.md` con i comandi di rendering e cosa cambia rispetto all'altro. Entrambi sono verticali 9:16 — il formato dell'esempio, non un vincolo del motore: vedi [Come funziona](#come-funziona) e la documentazione HyperFrames per gli altri.

---

## Le scelte che lo tengono in piedi

- **Puntatore, non pacchetto.** HyperFrames non è vendorizzato: si installa dal suo pacchetto ufficiale (`npx hyperframes`), che porta con sé la propria documentazione sempre aggiornata e il proprio editor visivo. Vendorizzarlo qui vorrebbe dire congelare una versione e perdere ogni fix a monte.
- **L'agente scrive, lo Studio rifinisce.** Un motore che sa fare solo l'una o solo l'altra cosa costringe a un compromesso: o tutto a mano, o tutto a codice riscritto per ogni dettaglio. Qui l'agente parte dal problema difficile (struttura, timing, dati) e lo Studio resta per l'ultimo miglio.
- **La chiave non è mai nel repo.** Solo variabile d'ambiente, mai in un file, un prompt o un log.
- **Due esempi, non uno.** Uno satirico senza voce, uno serio con voce narrata: coprono le due variabili che contano di più (con/senza narrazione, registro serio/registro satira) invece di un solo caso che lascia indovinare il resto.
- **Il prompt che incolli è minuscolo apposta.** Le istruzioni vere stanno in questo README, non nel prompt: così restano aggiornabili senza che tu debba ricordare o reincollare niente di nuovo.

---

## Cosa non fa

**Non genera voci.** Le genera ElevenLabs, con una chiave tua.

**Non decide il contenuto.** Il dato, l'angolo, il copione restano una scelta di chi lo usa — il repo non inventa cosa dire, solo come costruirlo.

**Non è vincolato al verticale.** I due esempi lo sono per scelta editoriale di chi li ha pubblicati, non per un limite del motore.

---

## Crediti

Il motore di rendering è [HyperFrames](https://hyperframes.heygen.com/) (HeyGen); la voce è [ElevenLabs](https://elevenlabs.io/). Gli esempi includono [GSAP](https://gsap.com/) (GreenSock, gratuito) per l'animazione e il font [Geist](https://vercel.com/font) (Vercel, SIL Open Font License).

---

## Licenza

MIT — vedi [LICENSE](LICENSE). Il codice è libero; gli esempi restano soggetti alle regole dei rispettivi progetti se li riusi come contenuto (satira dichiarata per Poltronave, dato verificato e apartisan per DVNS), non se li guardi solo come codice.

---

## Feedback

Critiche, casi che non copre, pattern HyperFrames che mancano: scrivetemi in qualsiasi momento.
