# DVNS — Calascio, quiz con voce

Reel narrato: un quiz su Calascio (L'Aquila, Abruzzo, il borgo di "Ladyhawke") con una domanda, la risposta e un dato reale, una mappa animata della regione e la voce narrante generata da ElevenLabs.

**È l'esempio da guardare per capire la voce**: l'altro esempio in questo repo è muto.

**Cosa mostra tecnicamente:**
- Voce ElevenLabs (`eleven_multilingual_v2`) generata con allineamento parola per parola (endpoint `with-timestamps`): il file audio in `assets/audio/voce/` porta con sé i tempi reali, e la composizione sincronizza testo a schermo ed effetti sulla voce vera, non su una durata stimata.
- Musica di sottofondo tenuta bassa sotto la voce, effetti puntuali solo sui momenti chiave (reveal della risposta).
- Mappa dell'Abruzzo (`assets/abruzzo.geojson`) come elemento geografico animato.

**Render:**

```bash
npm run render
npm run check
```

Dato, fonte e metodo: [Dove Vanno I Nostri Soldi](https://www.dovevannoinostrisoldi.com/).
