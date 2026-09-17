(function () {
  "use strict";

  // Poltrona istituzionale volante: la poltronave. Condivisa da ogni era, cambia solo chi ci sta sopra.
  var CHAIR =
    '<rect x="5" y="5" width="3" height="13" fill="#2d5fb0"/><rect x="6" y="4" width="3" height="2" fill="#1d4287"/>' +
    '<rect x="7" y="14" width="17" height="4" fill="#2d5fb0"/><rect x="23" y="11" width="4" height="7" fill="#1d4287"/>' +
    '<rect x="6" y="18" width="21" height="2" fill="#1d4287"/><rect x="8" y="20" width="3" height="2" fill="#d9a520"/><rect x="22" y="20" width="3" height="2" fill="#d9a520"/>' +
    '<rect x="5" y="7" width="1" height="1" fill="#d9a520"/><rect x="5" y="11" width="1" height="1" fill="#d9a520"/><rect x="5" y="15" width="1" height="1" fill="#d9a520"/>' +
    '<rect x="5" y="2" width="1" height="3" fill="#009246"/><rect x="6" y="2" width="1" height="3" fill="#f1f2f1"/><rect x="7" y="2" width="1" height="3" fill="#ce2b37"/>';

  var PEOPLE = {
    meloni:
      '<rect x="12" y="0" width="8" height="1" fill="#d79b28"/><rect x="10" y="1" width="12" height="2" fill="#f0c14b"/>' +
      '<rect x="10" y="3" width="3" height="5" fill="#f0c14b"/><rect x="20" y="3" width="3" height="5" fill="#d79b28"/>' +
      '<rect x="12" y="2" width="9" height="7" fill="#f2c39b"/><rect x="13" y="3" width="7" height="1" fill="#efad79"/>' +
      '<rect x="13" y="4" width="3" height="1" fill="#8a5a2f"/><rect x="18" y="4" width="3" height="1" fill="#8a5a2f"/>' +
      '<rect x="14" y="5" width="1" height="1" fill="#7fc5df"/><rect x="19" y="5" width="1" height="1" fill="#7fc5df"/>' +
      '<rect x="17" y="5" width="1" height="2" fill="#d99668"/><rect x="15" y="7" width="5" height="1" fill="#b8243c"/>' +
      '<rect x="12" y="8" width="9" height="6" fill="#f2f0eb"/><rect x="16" y="8" width="2" height="4" fill="#d4d2d2"/>' +
      '<rect x="20" y="10" width="6" height="2" fill="#f2f0eb"/><rect x="26" y="11" width="1" height="1" fill="#f2c39b"/>' +
      '<rect x="13" y="14" width="8" height="2" fill="#303040"/><rect x="19" y="16" width="3" height="3" fill="#303040"/>',
    berlusconi:
      '<rect x="11" y="1" width="11" height="2" fill="#38291f"/><rect x="10" y="3" width="3" height="5" fill="#38291f"/><rect x="12" y="2" width="9" height="7" fill="#eab88a"/>' +
      '<rect x="13" y="4" width="3" height="1" fill="#4b3225"/><rect x="18" y="4" width="3" height="1" fill="#4b3225"/>' +
      '<rect x="14" y="5" width="1" height="1" fill="#34241e"/><rect x="19" y="5" width="1" height="1" fill="#34241e"/><rect x="17" y="5" width="1" height="2" fill="#c8845f"/>' +
      '<rect x="14" y="7" width="7" height="1" fill="#fff"/><rect x="15" y="8" width="5" height="1" fill="#b95d50"/>' +
      '<rect x="12" y="9" width="9" height="5" fill="#23232e"/><rect x="16" y="9" width="2" height="4" fill="#c0212e"/>' +
      '<rect x="20" y="10" width="6" height="2" fill="#23232e"/><rect x="26" y="11" width="1" height="1" fill="#eab88a"/>' +
      '<rect x="13" y="14" width="8" height="2" fill="#16161e"/><rect x="19" y="16" width="3" height="3" fill="#16161e"/>',
    prodi:
      '<rect x="13" y="1" width="8" height="1" fill="#c9c9c9"/><rect x="11" y="2" width="3" height="3" fill="#c9c9c9"/><rect x="20" y="2" width="3" height="3" fill="#a8a8a8"/>' +
      '<rect x="12" y="2" width="9" height="7" fill="#f2c39b"/>' +
      '<rect x="13" y="4" width="3" height="2" fill="#2a2a2a"/><rect x="18" y="4" width="3" height="2" fill="#2a2a2a"/><rect x="16" y="4" width="2" height="1" fill="#2a2a2a"/>' +
      '<rect x="14" y="5" width="1" height="1" fill="#8fb8cc"/><rect x="19" y="5" width="1" height="1" fill="#8fb8cc"/><rect x="17" y="5" width="1" height="2" fill="#d99668"/>' +
      '<rect x="14" y="7" width="7" height="1" fill="#b5b5b5"/><rect x="15" y="8" width="5" height="1" fill="#a9705a"/>' +
      '<rect x="12" y="9" width="9" height="5" fill="#1c2b4a"/><rect x="16" y="9" width="2" height="4" fill="#7a2030"/>' +
      '<rect x="20" y="10" width="6" height="2" fill="#1c2b4a"/><rect x="26" y="11" width="1" height="1" fill="#f2c39b"/>' +
      '<rect x="13" y="14" width="8" height="2" fill="#12131a"/><rect x="19" y="16" width="3" height="3" fill="#12131a"/>',
    monti:
      '<rect x="12" y="2" width="9" height="7" fill="#f2c39b"/><rect x="11" y="4" width="2" height="3" fill="#b0b0b0"/><rect x="21" y="4" width="2" height="3" fill="#9a9a9a"/>' +
      '<rect x="13" y="4" width="3" height="2" fill="#1a1a1a"/><rect x="18" y="4" width="3" height="2" fill="#1a1a1a"/><rect x="16" y="4" width="2" height="1" fill="#1a1a1a"/>' +
      '<rect x="14" y="5" width="1" height="1" fill="#9fc2d6"/><rect x="19" y="5" width="1" height="1" fill="#9fc2d6"/>' +
      '<rect x="17" y="5" width="1" height="2" fill="#d99668"/><rect x="14" y="7" width="7" height="1" fill="#c98a68"/><rect x="15" y="8" width="5" height="1" fill="#8a5a44"/>' +
      '<rect x="12" y="9" width="9" height="5" fill="#3a3d44"/><rect x="16" y="9" width="2" height="4" fill="#2c4a66"/>' +
      '<rect x="20" y="10" width="6" height="2" fill="#3a3d44"/><rect x="26" y="11" width="1" height="1" fill="#f2c39b"/>' +
      '<rect x="13" y="14" width="8" height="2" fill="#181a1e"/><rect x="19" y="16" width="3" height="3" fill="#181a1e"/>',
    letta:
      '<rect x="11" y="1" width="11" height="2" fill="#2a2118"/><rect x="10" y="3" width="3" height="5" fill="#2a2118"/><rect x="20" y="3" width="2" height="5" fill="#1d160f"/>' +
      '<rect x="12" y="2" width="9" height="7" fill="#f2c39b"/>' +
      '<rect x="13" y="4" width="3" height="1" fill="#2a2a2a"/><rect x="18" y="4" width="3" height="1" fill="#2a2a2a"/>' +
      '<rect x="14" y="5" width="1" height="1" fill="#5a4a3a"/><rect x="19" y="5" width="1" height="1" fill="#5a4a3a"/><rect x="17" y="5" width="1" height="2" fill="#d99668"/>' +
      '<rect x="15" y="7" width="5" height="1" fill="#b06a58"/>' +
      '<rect x="12" y="9" width="9" height="5" fill="#1e2d4d"/><rect x="16" y="9" width="2" height="4" fill="#2f5f9e"/>' +
      '<rect x="20" y="10" width="6" height="2" fill="#1e2d4d"/><rect x="26" y="11" width="1" height="1" fill="#f2c39b"/>' +
      '<rect x="13" y="14" width="8" height="2" fill="#14151b"/><rect x="19" y="16" width="3" height="3" fill="#14151b"/>',
    renzi:
      '<rect x="11" y="1" width="11" height="2" fill="#241f1c"/><rect x="10" y="3" width="3" height="5" fill="#241f1c"/><rect x="20" y="3" width="2" height="5" fill="#1a1512"/>' +
      '<rect x="12" y="2" width="9" height="7" fill="#f2c39b"/>' +
      '<rect x="14" y="5" width="1" height="1" fill="#3a2a20"/><rect x="19" y="5" width="1" height="1" fill="#3a2a20"/><rect x="17" y="5" width="1" height="2" fill="#d99668"/>' +
      '<rect x="15" y="7" width="5" height="1" fill="#c47a5e"/>' +
      '<rect x="12" y="9" width="9" height="5" fill="#eef0f2"/><rect x="15" y="9" width="4" height="2" fill="#f2c39b"/>' +
      '<rect x="20" y="10" width="6" height="2" fill="#f2c39b"/><rect x="26" y="11" width="1" height="1" fill="#f2c39b"/>' +
      '<rect x="13" y="14" width="8" height="2" fill="#2a3b52"/><rect x="19" y="16" width="3" height="3" fill="#2a3b52"/>',
    gentiloni:
      '<rect x="11" y="1" width="11" height="2" fill="#b8b8b8"/><rect x="10" y="3" width="3" height="5" fill="#b8b8b8"/><rect x="20" y="3" width="2" height="5" fill="#a0a0a0"/>' +
      '<rect x="12" y="2" width="9" height="7" fill="#f2c39b"/>' +
      '<rect x="13" y="4" width="3" height="1" fill="#2a2a2a"/><rect x="18" y="4" width="3" height="1" fill="#2a2a2a"/>' +
      '<rect x="14" y="5" width="1" height="1" fill="#6a7a8a"/><rect x="19" y="5" width="1" height="1" fill="#6a7a8a"/><rect x="17" y="5" width="1" height="2" fill="#d99668"/>' +
      '<rect x="15" y="7" width="5" height="1" fill="#b06a58"/>' +
      '<rect x="12" y="9" width="9" height="5" fill="#28324a"/><rect x="16" y="9" width="2" height="4" fill="#3a5a86"/>' +
      '<rect x="20" y="10" width="6" height="2" fill="#28324a"/><rect x="26" y="11" width="1" height="1" fill="#f2c39b"/>' +
      '<rect x="13" y="14" width="8" height="2" fill="#15181e"/><rect x="19" y="16" width="3" height="3" fill="#15181e"/>',
    conte:
      '<rect x="11" y="0" width="11" height="2" fill="#1e1a16"/><rect x="10" y="2" width="3" height="6" fill="#1e1a16"/><rect x="20" y="2" width="3" height="6" fill="#14110e"/>' +
      '<rect x="12" y="2" width="9" height="7" fill="#f2c39b"/>' +
      '<rect x="14" y="5" width="1" height="1" fill="#2a1f18"/><rect x="19" y="5" width="1" height="1" fill="#2a1f18"/><rect x="17" y="5" width="1" height="2" fill="#d99668"/>' +
      '<rect x="15" y="7" width="5" height="1" fill="#a85f4d"/>' +
      '<rect x="12" y="9" width="9" height="5" fill="#22242c"/><rect x="16" y="9" width="2" height="4" fill="#7a4a8a"/>' +
      '<rect x="20" y="10" width="6" height="2" fill="#22242c"/><rect x="26" y="11" width="1" height="1" fill="#f2c39b"/>' +
      '<rect x="13" y="14" width="8" height="2" fill="#101116"/><rect x="19" y="16" width="3" height="3" fill="#101116"/>',
    draghi:
      '<rect x="12" y="1" width="9" height="2" fill="#e2e2e2"/><rect x="10" y="3" width="3" height="5" fill="#d4d4d4"/><rect x="20" y="3" width="3" height="5" fill="#c8c8c8"/>' +
      '<rect x="12" y="2" width="9" height="7" fill="#f2c39b"/>' +
      '<rect x="12" y="4" width="4" height="2" fill="#151515"/><rect x="18" y="4" width="4" height="2" fill="#151515"/><rect x="16" y="4" width="2" height="1" fill="#151515"/>' +
      '<rect x="13" y="5" width="2" height="1" fill="#8fa8b8"/><rect x="19" y="5" width="2" height="1" fill="#8fa8b8"/><rect x="17" y="5" width="1" height="2" fill="#d99668"/>' +
      '<rect x="15" y="7" width="5" height="1" fill="#8a5044"/>' +
      '<rect x="12" y="9" width="9" height="5" fill="#1b1c22"/><rect x="16" y="9" width="2" height="4" fill="#26262c"/>' +
      '<rect x="20" y="10" width="6" height="2" fill="#1b1c22"/><rect x="26" y="11" width="1" height="1" fill="#f2c39b"/>' +
      '<rect x="13" y="14" width="8" height="2" fill="#0d0e12"/><rect x="19" y="16" width="3" height="3" fill="#0d0e12"/>'
  };

  function svg(personId) {
    return '<svg viewBox="0 0 34 24" xmlns="http://www.w3.org/2000/svg">' + CHAIR + (PEOPLE[personId] || "") + '</svg>';
  }

  var GENERIC_ACHS = [
    [10, "ACHIEVEMENT: 10 SECONDI NEL PASSATO. IL DEBITO NON SI FERMA MAI, NEMMENO QUI."],
    [30, "ACHIEVEMENT: 30 SECONDI. STAI PERDENDO TEMPO IN DUE EPOCHE CONTEMPORANEAMENTE."],
    [60, "ACHIEVEMENT: 1 MINUTO NEL PASSATO. TORNARE AL PRESENTE NON CAMBIA IL RISULTATO."],
    [300, "ACHIEVEMENT: 5 MINUTI QUI. IL DEBITO DI ALLORA E' GIA' STORIA. IL TUO TEMPO LIBERO, INVECE, NO."]
  ];

  function genericShare(nome) {
    return function (secs, growth, eq) {
      return "Ho perso " + secs + " secondi con " + nome + " sulla Poltronave: il debito pubblico e' cresciuto di +" + growth + ", " + eq + ". #Poltronave";
    };
  }

  // Ogni era: 5 equivalenze, l'ultima e' sempre il Ponte sullo Stretto alla data giusta. Prezzi dell'epoca, approssimativi e dichiarati tali.
  var ERAS = [
    {
      id: "oggi", nome: "Meloni", inizio: "2022", fine: "oggi", periodo: "22 ottobre 2022 – oggi", person: "meloni",
      replay: false, base: 3207247300000, rate: 4310, dataTs: Date.UTC(2026, 5, 30),
      eqs: [
        { cost: 1.3, s: "un caffe' al bar (1,30, e ti guardano pure male)", p: "caffe' al bar" },
        { cost: 750, s: "un mese di stanza singola a Milano", p: "mesi di stanza singola a Milano" },
        { cost: 120, s: "un Frecciarossa Roma-Milano comprato il giorno prima", p: "Frecciarossa comprati il giorno prima" },
        { cost: 300, s: "una bolletta del gas dell'inverno 2022", p: "bollette del gas dell'inverno 2022" },
        { cost: 100, s: "un biglietto per Taylor Swift a San Siro (2024)", p: "biglietti per Taylor Swift a San Siro" },
        { cost: 7, s: "un mese di Netflix con la pubblicita'", p: "mesi di Netflix con la pubblicita'" },
        { cost: 100000000, s: "un F-35", p: "F-35", pct: true },
        { cost: 13500000000, s: "il Ponte sullo Stretto (rilanciato nel 2023, cantiere mai aperto)", p: "Ponti sullo Stretto", pct: true }
      ],
      achs: [
        [10, "ACHIEVEMENT: 10 SECONDI = UN'UTILITARIA NUOVA. PUFF, SPARITA."],
        [30, "ACHIEVEMENT: 30 SECONDI = TRE LAUREE FUORI SEDE, TASSE COMPRESE. IN BOCCA AL LUPO CON LA TESI."],
        [60, "ACHIEVEMENT: 1 MINUTO = UN BILOCALE IN PERIFERIA. ERA TUO, ORA E' SPREAD."],
        [300, "ACHIEVEMENT: 5 MINUTI = UNA VILLA CON PISCINA. COMPLIMENTI PER LA COSTANZA (E PER NON AVERE UNA VITA)."],
        [1800, "ACHIEVEMENT: 30 MINUTI. SERIAMENTE, VAI A FARTI UN GIRO. IL DEBITO CRESCE LO STESSO SENZA DI TE."]
      ],
      shareText: function (secs, growth, eq) { return "Ho perso " + secs + " secondi sulla Poltronave: il debito pubblico e' cresciuto di +" + growth + ", " + eq + ". #Poltronave"; }
    },
    {
      id: "draghi", nome: "Draghi", inizio: "2021", fine: "2022", periodo: "13 febbraio 2021 – 22 ottobre 2022", person: "draghi",
      replay: true, base: 2644000000000, rate: 2380,
      eqs: [
        { cost: 15, s: "un tampone rapido in farmacia", p: "tamponi rapidi in farmacia" },
        { cost: 100, s: "un pieno di benzina a 2 euro al litro (estate 2022)", p: "pieni a 2 euro al litro" },
        { cost: 200, s: "il bonus 200 euro del decreto Aiuti", p: "bonus 200 euro" },
        { cost: 500, s: "un monopattino elettrico col bonus mobilita'", p: "monopattini col bonus mobilita'" },
        { cost: 9000000000, s: "il Ponte sullo Stretto (lasciato fuori dal PNRR)", p: "Ponti sullo Stretto", pct: true }
      ],
      achs: GENERIC_ACHS, shareText: genericShare("Draghi")
    },
    {
      id: "conte-ii", nome: "Conte II", inizio: "2019", fine: "2021", periodo: "5 settembre 2019 – 13 febbraio 2021", person: "conte",
      replay: true, base: 2439000000000, rate: 4500,
      eqs: [
        { cost: 300, s: "un banco a rotelle", p: "banchi a rotelle" },
        { cost: 0.5, s: "una mascherina chirurgica a prezzo calmierato", p: "mascherine a prezzo calmierato" },
        { cost: 600, s: "il bonus 600 euro delle partite IVA", p: "bonus 600 euro" },
        { cost: 10, s: "una pizza a domicilio in lockdown", p: "pizze a domicilio in lockdown" },
        { cost: 9000000000, s: "il Ponte sullo Stretto (fermo pure lui, come tutti nel 2020)", p: "Ponti sullo Stretto", pct: true }
      ],
      achs: GENERIC_ACHS, shareText: genericShare("Conte II")
    },
    {
      id: "conte-i", nome: "Conte I", inizio: "2018", fine: "2019", periodo: "1 giugno 2018 – 5 settembre 2019", person: "conte",
      replay: true, base: 2327700000000, rate: 2790,
      eqs: [
        { cost: 780, s: "una mensilita' di reddito di cittadinanza (importo massimo)", p: "mensilita' di reddito di cittadinanza" },
        { cost: 10, s: "un mese di DAZN per vedere la Serie A a scatti", p: "mesi di DAZN a scatti" },
        { cost: 30, s: "un volo Ryanair prima che facessero pagare il trolley", p: "voli Ryanair col trolley ancora gratis" },
        { cost: 9, s: "un biglietto per Avengers: Endgame", p: "biglietti per Avengers: Endgame" },
        { cost: 9000000000, s: "il Ponte sullo Stretto (definanziato di nuovo nel 2019)", p: "Ponti sullo Stretto", pct: true }
      ],
      achs: GENERIC_ACHS, shareText: genericShare("Conte I")
    },
    {
      id: "gentiloni", nome: "Gentiloni", inizio: "2016", fine: "2018", periodo: "12 dicembre 2016 – 1 giugno 2018", person: "gentiloni",
      replay: true, base: 2231500000000, rate: 2080,
      eqs: [
        { cost: 5, s: "un fidget spinner", p: "fidget spinner" },
        { cost: 10, s: "un mese di Spotify Premium", p: "mesi di Spotify Premium" },
        { cost: 12, s: "un biglietto per il Colosseo prima del rincaro", p: "biglietti per il Colosseo" },
        { cost: 2100, s: "uno stipendio mensile del 2017", p: "stipendi mensili del 2017" },
        { cost: 9000000000, s: "il Ponte sullo Stretto (ancora fermo, come sempre)", p: "Ponti sullo Stretto", pct: true }
      ],
      achs: GENERIC_ACHS, shareText: genericShare("Gentiloni")
    },
    {
      id: "renzi", nome: "Renzi", inizio: "2014", fine: "2016", periodo: "22 febbraio 2014 – 12 dicembre 2016", person: "renzi",
      replay: true, base: 2107500000000, rate: 1400,
      eqs: [
        { cost: 80, s: "il bonus 80 euro di un mese", p: "bonus 80 euro" },
        { cost: 39, s: "un biglietto per Expo Milano 2015", p: "biglietti per Expo 2015" },
        { cost: 10, s: "un selfie stick", p: "selfie stick" },
        { cost: 5, s: "un secchio per l'Ice Bucket Challenge", p: "secchi per l'Ice Bucket Challenge" },
        { cost: 9000000000, s: "il Ponte sullo Stretto (accantonato, di nuovo)", p: "Ponti sullo Stretto", pct: true }
      ],
      achs: GENERIC_ACHS, shareText: genericShare("Renzi")
    },
    {
      id: "letta", nome: "Letta", inizio: "2013", fine: "2014", periodo: "28 aprile 2013 – 22 febbraio 2014", person: "letta",
      replay: true, base: 2041300000000, rate: 2540,
      eqs: [
        { cost: 90, s: "un pieno di benzina a 1,80", p: "pieni a 1,80" },
        { cost: 300, s: "un Nokia Lumia (ci credevano davvero)", p: "Nokia Lumia" },
        { cost: 1, s: "un caffe' a 1 euro, l'ultimo anno in cui costava 1 euro", p: "caffe' a 1 euro" },
        { cost: 10000, s: "una Fiat Panda del 2013", p: "Fiat Panda del 2013" },
        { cost: 9500000000, s: "il Ponte sullo Stretto (la societa' Stretto di Messina messa in liquidazione nel 2013)", p: "Ponti sullo Stretto", pct: true }
      ],
      achs: GENERIC_ACHS, shareText: genericShare("Letta")
    },
    {
      id: "monti", nome: "Monti", inizio: "2011", fine: "2013", periodo: "16 novembre 2011 – 28 aprile 2013", person: "monti",
      replay: true, base: 1912400000000, rate: 2820,
      eqs: [
        { cost: 400, s: "la prima rata IMU sulla prima casa", p: "rate IMU sulla prima casa" },
        { cost: 1, s: "un caffe' con l'IVA appena salita al 21%", p: "caffe' con l'IVA al 21%" },
        { cost: 95, s: "un pieno di benzina a 1,90, record del 2012", p: "pieni a 1,90" },
        { cost: 8, s: "un Prosecco per festeggiare lo spread sotto 300", p: "Prosecchi per lo spread sotto 300" },
        { cost: 9000000000, s: "il Ponte sullo Stretto (de-finanziato definitivamente nel 2013)", p: "Ponti sullo Stretto", pct: true }
      ],
      achs: GENERIC_ACHS, shareText: genericShare("Monti")
    },
    {
      id: "berlusconi-iv", nome: "Berlusconi IV", inizio: "2008", fine: "2011", periodo: "8 maggio 2008 – 16 novembre 2011", person: "berlusconi",
      replay: true, base: 1663000000000, rate: 2280,
      eqs: [
        { cost: 0.15, s: "un SMS (ti ricordi gli SMS?)", p: "SMS (ti ricordi gli SMS?)" },
        { cost: 12000, s: "una Grande Punto", p: "Grandi Punto" },
        { cost: 500, s: "un Nokia N95 con la fotocamera da 5 megapixel", p: "Nokia N95" },
        { cost: 4000000000, s: "il salvataggio Alitalia del 2008", p: "salvataggi Alitalia", pct: true },
        { cost: 8500000000, s: "il Ponte sullo Stretto (progetto 2009, prima pietra mai posata)", p: "Ponti sullo Stretto", pct: true }
      ],
      achs: [
        [10, "ACHIEVEMENT: 10 SECONDI = UNA GRANDE PUNTO FULL OPTIONAL."],
        [60, "ACHIEVEMENT: 1 MINUTO = UN MONOLOCALE DEL 2008, MUTUO A TASSO VARIABILE."],
        [300, "ACHIEVEMENT: 5 MINUTI = UNA VILLA IN BRIANZA."],
        [1800, "ACHIEVEMENT: 30 MINUTI. NEL 2008 SAREBBE GIA' FINITA LA LEGISLATURA, PRIMA DI TE."]
      ],
      shareText: genericShare("Berlusconi IV")
    },
    {
      id: "prodi-ii", nome: "Prodi II", inizio: "2006", fine: "2008", periodo: "17 maggio 2006 – 8 maggio 2008", person: "prodi",
      replay: true, base: 1538600000000, rate: 1994,
      eqs: [
        { cost: 0.5, s: "un MMS, che non mandava mai nessuno", p: "MMS che non mandava nessuno" },
        { cost: 70, s: "una maglia dell'Italia campione del mondo 2006", p: "maglie dell'Italia campione del mondo" },
        { cost: 200, s: "un iPod Nano", p: "iPod Nano" },
        { cost: 30, s: "un mese di ADSL 'fino a' 7 mega", p: "mesi di ADSL 'fino a' 7 mega" },
        { cost: 10000000000, s: "il Ponte sullo Stretto (definanziato nel 2006)", p: "Ponti sullo Stretto", pct: true }
      ],
      achs: GENERIC_ACHS, shareText: genericShare("Prodi II")
    },
    {
      id: "berlusconi-iii", nome: "Berlusconi III", inizio: "2005", fine: "2006", periodo: "23 aprile 2005 – 17 maggio 2006", person: "berlusconi",
      replay: true, base: 1485900000000, rate: 1568,
      eqs: [
        { cost: 3, s: "una suoneria polifonica scaricata via SMS", p: "suonerie polifoniche" },
        { cost: 2000, s: "un Piaggio Liberty nuovo", p: "Piaggio Liberty nuovi" },
        { cost: 20, s: "un DVD di Star Wars Episodio III", p: "DVD di Star Wars Episodio III" },
        { cost: 50, s: "un biglietto per le Olimpiadi di Torino 2006", p: "biglietti per Torino 2006" },
        { cost: 9500000000, s: "il Ponte sullo Stretto (gara aggiudicata nel 2005, cantiere mai partito)", p: "Ponti sullo Stretto", pct: true }
      ],
      achs: GENERIC_ACHS, shareText: genericShare("Berlusconi III")
    },
    {
      id: "berlusconi-ii", nome: "Berlusconi II", inizio: "2001", fine: "2005", periodo: "11 giugno 2001 – 23 aprile 2005", person: "berlusconi",
      replay: true, base: 1358300000000, rate: 1046,
      eqs: [
        { cost: 0.77, s: "un caffe' a 1.500 lire, che poi divento' 1 euro (vai a capire)", p: "caffe' da 1.500 lire" },
        { cost: 150, s: "un Nokia 3310", p: "Nokia 3310" },
        { cost: 50, s: "un biglietto per Italia-Corea 2002 (poi non parliamone)", p: "biglietti per Italia-Corea 2002" },
        { cost: 20, s: "un mese di connessione a 56k, col modem che canta", p: "mesi di 56k col modem che canta" },
        { cost: 9000000000, s: "il Ponte sullo Stretto (Legge Obiettivo 2001, sul tavolo da allora)", p: "Ponti sullo Stretto", pct: true }
      ],
      achs: GENERIC_ACHS, shareText: genericShare("Berlusconi II")
    }
  ];

  // Le ere storiche partono da un dato mensile arrotondato a 100 milioni: il contatore non deve mostrare una cifra
  // tonda, quindi ogni era riceve uno sfasamento fisso, sotto i 100 milioni, ricavato dal suo id (stesso a ogni carico).
  ERAS.forEach(function (era) {
    if (!era.replay) { return; }
    var hsh = 0;
    for (var i = 0; i < era.id.length; i++) { hsh = (hsh * 31 + era.id.charCodeAt(i)) >>> 0; }
    era.base += 12000000 + (hsh % 76000000);
  });

  // Nel browser e' window; nelle edge function (api/card.js, api/share.js) e' globalThis.
  var root = typeof window !== "undefined" ? window : globalThis;
  root.POLTRONAVE_ERAS = ERAS;
  root.POLTRONAVE_SVG = svg;
})();
