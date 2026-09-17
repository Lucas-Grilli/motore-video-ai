(function () {
  "use strict";

  var fmt = function (n) { return "€ " + Math.floor(n).toLocaleString("it-IT"); };
  var fmtSecs = function (s) { return s.toFixed(1).replace(".", ","); };

  function track(name) {
    try { if (typeof window.va === "function") { window.va("event", { name: name }); } } catch (e) {}
  }

  // "di" + articolo: "di il Ponte" no, "del Ponte" si'.
  function di(s) {
    var m = s.match(/^(il|lo|la|l')\s?/i);
    if (!m) { return "DI " + s.toUpperCase(); }
    var art = m[1].toLowerCase();
    var prep = art === "il" ? "DEL " : art === "lo" ? "DELLO " : art === "la" ? "DELLA " : "DELL'";
    return prep + s.slice(m[0].length).toUpperCase();
  }

  function eqText(cfg, secs, growth) {
    if (secs < 0.3) { return ""; }
    var item = cfg.eqs[Math.floor(secs / 2.4) % cfg.eqs.length];
    var count = growth / item.cost;
    if (item.pct || count < 1) {
      var p = count * 100;
      var pTxt = (p >= 0.01 ? p.toFixed(2) : p.toFixed(5)).replace(".", ",");
      var art = p >= 1 ? "PER L'" : "PER LO ";
      return "BASTAVANO " + art + pTxt + "% " + di(item.s);
    }
    if (count < 2) { return "BASTAVANO GIUSTO PER " + item.s.toUpperCase(); }
    return "BASTAVANO PER " + Math.floor(count).toLocaleString("it-IT") + " " + item.p.toUpperCase();
  }

  // Stessa selezione di eqText (stessa formula sull'indice), ma senza maiuscolo forzato: per il testo
  // condiviso, dove IL MAIUSCOLO FISSO leggeva come urlato in mezzo a una frase normale.
  function diHuman(s) {
    var m = s.match(/^(il|lo|la|l')\s?/i);
    if (!m) { return "di " + s; }
    var art = m[1].toLowerCase();
    var prep = art === "il" ? "del " : art === "lo" ? "dello " : art === "la" ? "della " : "dell'";
    return prep + s.slice(m[0].length);
  }
  function eqTextHuman(cfg, secs, growth) {
    if (secs < 0.3) { return ""; }
    var item = cfg.eqs[Math.floor(secs / 2.4) % cfg.eqs.length];
    var count = growth / item.cost;
    if (item.pct || count < 1) {
      var p = count * 100;
      var pTxt = (p >= 0.01 ? p.toFixed(2) : p.toFixed(5)).replace(".", ",");
      return "bastavano " + (p >= 1 ? "per l'" : "per lo ") + pTxt + "% " + diHuman(item.s);
    }
    if (count < 2) { return "bastavano giusto per " + item.s; }
    return "bastavano per " + Math.floor(count).toLocaleString("it-IT") + " " + item.p;
  }

  function stars(el, n) {
    if (!el) { return; }
    for (var i = 0; i < n; i++) {
      var s = document.createElement("i");
      var size = Math.random() < 0.3 ? 6 : 4;
      s.style.cssText = "top:" + (Math.random() * 100).toFixed(1) + "vh;left:" + (Math.random() * 100).toFixed(1) + "vw;width:" + size + "px;height:" + size + "px;--dur:" + (6 + Math.random() * 8).toFixed(1) + "s;--delay:-" + (Math.random() * 10).toFixed(1) + "s";
      el.appendChild(s);
    }
  }

  // Un data: URI si decodifica a mano: fetch() su data: e' bloccato dalle CSP piu' strette (es. la pagina di anteprima).
  function loadBytes(url) {
    if (url.indexOf("data:") === 0) {
      var b64 = url.slice(url.indexOf(",") + 1);
      var bin = atob(b64);
      var bytes = new Uint8Array(bin.length);
      for (var i = 0; i < bin.length; i++) { bytes[i] = bin.charCodeAt(i); }
      return Promise.resolve(bytes.buffer);
    }
    return fetch(url).then(function (res) { return res.arrayBuffer(); });
  }

  function setupAudio(url, button, slider) {
    if (!url || !button) { return; }
    var AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) { button.hidden = true; if (slider) { slider.hidden = true; } return; }
    var ctx = new AudioCtx();
    var gain = ctx.createGain();
    var ready = false;
    var failed = false;
    var wanted = true;
    var volume = slider ? (parseInt(slider.value, 10) / 100) : 0.52;
    gain.gain.value = wanted ? volume : 0;
    gain.connect(ctx.destination);

    function setLabel() {
      var playing = ready && wanted && ctx.state === "running";
      button.classList.toggle("off", ready && !wanted);
      button.classList.toggle("needs-gesture", ready && wanted && !playing);
      button.classList.toggle("ko", failed);
      button.setAttribute("aria-pressed", playing ? "true" : "false");
      button.title = failed ? "Audio non disponibile su questo browser" : (playing ? "Audio acceso" : (wanted ? "Clicca per far partire l'audio" : "Audio spento"));
    }

    loadBytes(url)
      .then(function (data) { return ctx.decodeAudioData(data); })
      .then(function (buffer) {
        var source = ctx.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        source.loopStart = 0;
        source.loopEnd = buffer.duration;
        source.connect(gain);
        source.start(0);
        ready = true;
        return ctx.resume();
      })
      .catch(function () { failed = true; })
      .then(setLabel);

    button.addEventListener("click", function () {
      if (!ready) { return; }
      if (wanted && ctx.state !== "running") {
        gain.gain.value = volume;
        ctx.resume().then(setLabel);
        return;
      }
      wanted = !wanted;
      gain.gain.value = wanted ? volume : 0;
      if (wanted) { ctx.resume().then(setLabel); } else { setLabel(); }
    });

    if (slider) {
      slider.addEventListener("input", function () {
        volume = parseInt(slider.value, 10) / 100;
        if (wanted) { gain.gain.value = volume; }
      });
    }

    // Sblocco al primo gesto ovunque nella pagina, non solo sul bottone. Niente {once:true}: se il primo
    // tocco arriva prima che il buffer sia pronto (decodifica ancora in corso), quel gesto andrebbe
    // sprecato per sempre e la musica non partirebbe mai da sola — si continua a provare a ogni gesto
    // finche' non riesce davvero, poi ci si stacca.
    function tryUnlock(event) {
      if (event.target === button) { return; }
      if (!(wanted && ready && ctx.state !== "running")) { return; }
      gain.gain.value = volume;
      ctx.resume().then(function () {
        setLabel();
        if (ctx.state === "running") { UNLOCK_EVENTS.forEach(function (n) { document.removeEventListener(n, tryUnlock); }); }
      });
    }
    var UNLOCK_EVENTS = ["pointerdown", "keydown", "touchend"];
    UNLOCK_EVENTS.forEach(function (n) { document.addEventListener(n, tryUnlock); });
    setLabel();
  }

  function buildPicker(eras, listEl, onPick) {
    eras.forEach(function (era) {
      var item = document.createElement("button");
      item.type = "button";
      item.className = "picker-item";
      item.dataset.era = era.id;
      item.innerHTML = '<span class="picker-thumb">' + window.POLTRONAVE_SVG(era.person) + '</span>' +
        '<span class="picker-label"><span class="picker-nome">' + era.nome + '</span><span class="picker-anno">' + era.inizio + "-" + era.fine + '</span></span>';
      item.addEventListener("click", function () { onPick(era.id); });
      listEl.appendChild(item);
    });

    // Sotto l'ultimo governo: il voto per andare indietro ai governi pre-euro. Ogni click e' una pagina vista di /pre-euro.
    var cta = document.createElement("button");
    cta.type = "button";
    cta.className = "picker-cta";
    var already = false;
    try { already = localStorage.getItem("poltronave_preeuro") === "1"; } catch (e) {}
    function setCta() {
      cta.textContent = already ? "SEGNATO, GRAZIE. SE SIETE IN TANTI, SI FA." : "VUOI ANCHE I GOVERNI PRE-EURO? CLICCA QUI E LO CONTIAMO.";
      cta.disabled = already;
    }
    cta.addEventListener("click", function () {
      if (already) { return; }
      already = true;
      try { localStorage.setItem("poltronave_preeuro", "1"); } catch (e) {}
      track("pre-euro");
      setCta();
      if (/vercel\.app$|localhost$/.test(location.hostname) || /\.(it|com|app)$/.test(location.hostname) && location.hostname.indexOf("claude") === -1) {
        location.href = "/pre-euro.html";
      }
    });
    setCta();
    listEl.appendChild(cta);
  }

  function start(eras, audioUrl) {
    var byId = {};
    eras.forEach(function (e) { byId[e.id] = e; });

    var els = {
      debt: document.getElementById("debt"), secs: document.getElementById("secs"),
      growth: document.getElementById("growth"), eq: document.getElementById("eq"),
      shareX: document.getElementById("share-x"), shareFb: document.getElementById("share-fb"),
      shareIg: document.getElementById("share-ig"), shareNative: document.getElementById("share-native"),
      shareRow: document.getElementById("share-row"), shareTitle: document.getElementById("share-title"),
      volume: document.getElementById("volume"),
      cardModal: document.getElementById("card-modal"), cardImg: document.getElementById("card-img"),
      cardVideo: document.getElementById("card-video"),
      cardSave: document.getElementById("card-save"), cardClose: document.getElementById("card-close"),
      cardStatic: document.getElementById("card-static"),
      audio: document.getElementById("audio-toggle"),
      toast: document.getElementById("toast"), ach: document.getElementById("ach"),
      mascotte: document.getElementById("mascotte"), badge: document.getElementById("era-badge"),
      info: document.getElementById("era-info"),
      picker: document.getElementById("picker"), pickerList: document.getElementById("picker-list"),
      pickerToggle: document.getElementById("picker-toggle"), pickerClose: document.getElementById("picker-close"),
      pickerOverlay: document.getElementById("picker-overlay")
    };

    var cfg = null, t0 = 0, lastAch = 0, achUntil = -1, toastUntil = -1;

    stars(document.querySelector(".stars"), 34);
    setupAudio(audioUrl, els.audio, els.volume);
    buildPicker(eras, els.pickerList, activate);

    function openPicker(open) {
      els.picker.classList.toggle("open", open);
      els.pickerOverlay.hidden = !open;
      els.pickerToggle.setAttribute("aria-expanded", open ? "true" : "false");
    }
    els.pickerToggle.addEventListener("click", function () { openPicker(!els.picker.classList.contains("open")); });
    els.pickerClose.addEventListener("click", function () { openPicker(false); });
    els.pickerOverlay.addEventListener("click", function () { openPicker(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") { openPicker(false); } });

    function activate(id) {
      cfg = byId[id] || byId.oggi;
      t0 = Date.now();
      lastAch = 0;
      achUntil = -1;
      els.ach.hidden = true;
      els.mascotte.innerHTML = window.POLTRONAVE_SVG(cfg.person);
      document.body.classList.toggle("era-storico", cfg.replay);
      if (cfg.replay) {
        els.badge.hidden = false;
        els.badge.textContent = "MACCHINA DEL TEMPO: " + cfg.nome.toUpperCase() + " · " + cfg.inizio + "-" + cfg.fine;
      } else {
        els.badge.hidden = true;
      }
      els.info.textContent = cfg.replay
        ? "Simulazione lineare del periodo " + cfg.periodo + ". Equivalenze e prezzi dell'epoca sono approssimativi."
        : "Il contatore estrapola linearmente l'ultimo dato ufficiale disponibile: 3.207,2 miliardi al 30 giugno 2026, circa 4.310 euro al secondo.";
      var items = els.pickerList.querySelectorAll(".picker-item");
      for (var i = 0; i < items.length; i++) { items[i].classList.toggle("selected", items[i].dataset.era === cfg.id); }
      if (history.replaceState) { history.replaceState(null, "", "#" + cfg.id); } else { location.hash = cfg.id; }
      tick();
    }

    // Il numero non deve mai andare a capo (spezzerebbe "+€" dalla cifra): invece di un font-size fisso,
    // si misura col canvas quanto ci sta e si restringe solo se serve. Ricalcola solo quando cambia la
    // lunghezza del testo (una cifra in piu', mai in ogni tick) o quando cambia lo spazio disponibile.
    var measureCanvas = document.createElement("canvas").getContext("2d");
    var fitCache = { debt: -1 };
    function fitText(el, minPx, maxPx) {
      var text = el.textContent, key = el.id + "|" + text.length + "|" + el.clientWidth;
      if (fitCache[el.id] === key) { return; }
      fitCache[el.id] = key;
      var avail = el.clientWidth;
      if (!avail) { return; }
      var size = maxPx;
      measureCanvas.font = "400 " + size + "px 'Press Start 2P'";
      while (size > minPx && measureCanvas.measureText(text).width > avail) {
        size -= 1;
        measureCanvas.font = "400 " + size + "px 'Press Start 2P'";
      }
      el.style.fontSize = size + "px";
    }
    if (document.fonts && document.fonts.ready) { document.fonts.ready.then(function () { fitCache = {}; fitText(els.debt, 13, 58); }); }
    window.addEventListener("resize", function () { fitCache = {}; });

    function tick() {
      var now = Date.now();
      var secs = (now - t0) / 1000;
      var growth = cfg.rate * secs;
      var debt = cfg.replay ? cfg.base + growth : cfg.base + cfg.rate * ((now - cfg.dataTs) / 1000);
      els.debt.textContent = fmt(debt);
      els.secs.textContent = fmtSecs(secs);
      els.growth.textContent = "+" + fmt(growth);
      els.eq.textContent = eqText(cfg, secs, growth);
      fitText(els.debt, 13, 58);
      var achs = cfg.achs || [];
      for (var i = 0; i < achs.length; i++) {
        if (secs >= achs[i][0] && lastAch < achs[i][0]) {
          lastAch = achs[i][0];
          els.ach.textContent = achs[i][1];
          achUntil = secs + 6;
        }
      }
      els.ach.hidden = !(secs < achUntil);
      if (toastUntil >= 0) { els.toast.hidden = !(secs < toastUntil); }
    }
    setInterval(tick, 100);

    // Condivisione, con la frizione piu' bassa che il web permette.
    // Telefono: un solo bottone, foglio nativo con la card gia' allegata (Instagram → Storia, WhatsApp, X...).
    // Desktop: X e Facebook a un click (card automatica dal link /s/era/secondi, generata da api/card.js);
    // Instagram copia la card negli appunti e apre instagram.com: si incolla.
    var hasServer = location.protocol === "https:" && !/claude\.ai$/.test(location.hostname);
    var canShareFiles = false;
    try { canShareFiles = !!(navigator.canShare && navigator.canShare({ files: [new File([""], "x.png", { type: "image/png" })] })); } catch (e) {}
    // Solo sui telefoni: anche Chrome per Windows sa condividere file, ma li' il foglio di sistema confonde.
    var isPhone = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || (window.matchMedia && matchMedia("(pointer: coarse)").matches);
    var oneButton = canShareFiles && hasServer && isPhone;
    els.shareNative.hidden = !oneButton;
    els.shareRow.hidden = oneButton;
    els.shareTitle.hidden = oneButton;

    // Tutto (testo, immagine, video, pagina /s/) deve nascere dallo STESSO numero di secondi, arrotondato
    // UNA volta sola qui. Prima l'immagine leggeva "3.6" dall'URL e ricalcolava il debito da li', mentre il
    // testo condiviso usava il valore esatto non arrotondato: stesso "3,6 secondi" scritto, cifre diverse
    // sotto — il bug visto su WhatsApp. Arrotondare prima e derivare tutto da li' li rende identici sempre.
    function shareState() {
      var secsR = Math.round(((Date.now() - t0) / 1000) * 10) / 10;
      var growth = cfg.rate * secsR;
      var s = secsR.toFixed(1);
      var pageUrl = location.origin + "/#" + cfg.id;
      return {
        secs: secsR,
        txt: cfg.shareText(fmtSecs(secsR), fmt(growth), eqTextHuman(cfg, secsR, growth)),
        shareUrl: hasServer ? location.origin + "/s/" + cfg.id + "/" + s : pageUrl,
        cardUrl: hasServer ? location.origin + "/api/card?era=" + encodeURIComponent(cfg.id) + "&s=" + s + "&f=story" : null,
        videoUrl: hasServer ? location.origin + "/api/video?era=" + encodeURIComponent(cfg.id) + "&s=" + s : null
      };
    }
    // Il container Node che genera il video (ffmpeg-static, ~75 MB) parte a freddo la prima volta: 6 s
    // buttati via prima ancora di iniziare a renderizzare. Non li paghiamo al click (troppo tardi per il
    // gesto) ne' per chiunque atterri sulla pagina (spreco): solo quando la sezione di condivisione entra
    // in vista, segno che l'utente e' arrivato fin li'. E' una sveglia senza rendering, non un video.
    if (hasServer && window.IntersectionObserver) {
      var shareSection = document.querySelector(".share");
      if (shareSection) {
        var warmed = false;
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (en) {
            if (en.isIntersecting && !warmed) {
              warmed = true;
              try { fetch(location.origin + "/api/video?warm=1", { cache: "no-store" }).catch(function () {}); } catch (e) {}
              io.disconnect();
            }
          });
        });
        io.observe(shareSection);
      }
    }
    function delay(ms) { return new Promise(function (resolve) { setTimeout(resolve, ms); }); }

    function showToast(msg) {
      els.toast.textContent = msg;
      toastUntil = (Date.now() - t0) / 1000 + 9;
      els.toast.hidden = false;
    }
    function copy(text) {
      if (navigator.clipboard && navigator.clipboard.writeText) { return navigator.clipboard.writeText(text).catch(function () {}); }
      return Promise.resolve();
    }
    function popup(url) { window.open(url, "_blank", "noopener,width=640,height=560"); }

    els.shareX.addEventListener("click", function () {
      var st = shareState();
      track("share-x");
      popup("https://x.com/intent/post?text=" + encodeURIComponent(st.txt) + "&url=" + encodeURIComponent(st.shareUrl));
      showToast(hasServer ? "SU X IL LINK MOSTRA LA TUA CARD CON " + fmtSecs(st.secs) + " SECONDI." : "APERTO X CON IL TUO SCORE.");
    });

    els.shareFb.addEventListener("click", function () {
      var st = shareState();
      track("share-fb");
      popup("https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(st.shareUrl));
      copy(st.txt);
      showToast(hasServer ? "FACEBOOK PRENDE LA CARD DAL LINK. IL TESTO E' NEGLI APPUNTI, SE VUOI INCOLLARLO." : "APERTO FACEBOOK. IL TESTO E' NEGLI APPUNTI.");
    });

    // La card si prepara gia' al tocco (pointerdown), cosi' al click il foglio nativo parte ancora dentro
    // il gesto dell'utente: Safari lo esige, Chrome lo gradisce. Si preparano in parallelo sia la card
    // ferma sia il video, cosi' sono pronti per qualunque dei due bottoni venga toccato.
    var prep = null;
    function prepCard() {
      var st = shareState();
      if (!st.cardUrl) { prep = null; return; }
      prep = {
        st: st,
        blob: fetch(st.cardUrl).then(function (r) { if (!r.ok) { throw new Error("card"); } return r.blob(); }),
        videoBlob: st.videoUrl ? fetch(st.videoUrl).then(function (r) { if (!r.ok) { throw new Error("video"); } return r.blob(); }) : null
      };
    }
    function takePrep() { if (!prep) { prepCard(); } var p = prep; prep = null; return p; }

    // Un bottone solo, sempre il video con l'audio come prima scelta. Il video parte al tocco (non prima:
    // il numero di secondi deve essere quello vero di quel momento), col container gia' scaldato dalla
    // sveglia sopra. Gli si danno 3,5 s per farcela dentro la finestra che il browser concede al gesto
    // (~5 s su Chromium): se non ce la fa, si scende sulla card ferma - gia' pronta, edge, veloce - senza
    // aspettare oltre e senza un secondo bottone. Se anche navigator.share() rifiuta, si mostra il nome
    // vero dell'errore invece di un messaggio generico: l'unico modo di sapere cos'e' successo senza
    // indovinare a distanza.
    els.shareNative.addEventListener("pointerdown", prepCard);
    els.shareNative.addEventListener("click", function () {
      track("share-native");
      var p = takePrep();
      showToast("PREPARO IL VIDEO CON L'AUDIO...");
      var text = p.st.txt + " " + p.st.shareUrl;
      var videoAsset = p.videoBlob
        ? p.videoBlob.then(function (blob) { return { blob: blob, ext: "mp4", type: "video/mp4" }; })
        : Promise.reject(new Error("no-video"));
      if (p.videoBlob) { p.videoBlob.catch(function () {}); }
      Promise.race([videoAsset, delay(3500).then(function () { return null; })])
        .catch(function () { return null; })
        .then(function (asset) {
          if (asset) { return asset; }
          return p.blob.then(function (blob) { return { blob: blob, ext: "png", type: "image/png" }; });
        })
        .then(function (asset) {
          var file = new File([asset.blob], "poltronave-" + cfg.id + "." + asset.ext, { type: asset.type });
          return navigator.share({ files: [file], text: text });
        })
        .then(function () { showToast("CONDIVISO. SU INSTAGRAM SCEGLI 'STORIA'."); })
        .catch(function (e) {
          if (e && e.name === "AbortError") { return; }
          track("share-native-error:" + (e && e.name));
          showToast("NON PARTITO (" + (e && e.name || "errore") + "): " + (e && e.message || "riprova"));
        });
    });

    // Desktop: Instagram non accetta link e instagram.com non ha un "incolla nella storia".
    // Si mostra il video (l'esperienza vera, con l'audio) con un tasto per salvarlo; chi preferisce
    // l'immagine ferma la trova a un click di distanza.
    function showMedia(el, other, blob, ext) {
      els.toast.hidden = true;
      other.hidden = true;
      if (el.src) { URL.revokeObjectURL(el.src); }
      el.src = URL.createObjectURL(blob);
      el.hidden = false;
      els.cardModal.hidden = false;
      els.cardSave.textContent = "SALVA " + (ext === "mp4" ? "IL VIDEO" : "L'IMMAGINE");
      els.cardSave.onclick = function () {
        var a = document.createElement("a");
        a.href = el.src;
        a.download = "poltronave-" + cfg.id + "." + ext;
        document.body.appendChild(a); a.click(); a.remove();
        els.cardSave.textContent = "SALVATA";
      };
    }
    els.shareIg.addEventListener("pointerdown", prepCard);
    els.shareIg.addEventListener("click", function () {
      track("share-ig");
      if (!hasServer) { showToast("INSTAGRAM VUOLE UN'IMMAGINE: FUNZIONA SUL SITO VERO, NON IN QUESTA ANTEPRIMA."); return; }
      var p = takePrep();
      showToast("PREPARO IL VIDEO CON L'AUDIO...");
      els.cardStatic.onclick = function () {
        showToast("PREPARO LA CARD...");
        p.blob.then(function (blob) { showMedia(els.cardImg, els.cardVideo, blob, "png"); })
          .catch(function () { showToast("LA CARD NON E' ARRIVATA. RIPROVA TRA UN ATTIMO."); });
      };
      if (p.videoBlob) {
        p.videoBlob.then(function (blob) { showMedia(els.cardVideo, els.cardImg, blob, "mp4"); })
          .catch(function () { els.cardStatic.onclick(); });
      } else {
        els.cardStatic.onclick();
      }
    });
    function closeCard() {
      els.cardModal.hidden = true;
      els.cardSave.textContent = "SALVA IL VIDEO";
      els.cardVideo.pause();
    }
    els.cardClose.addEventListener("click", closeCard);
    els.cardModal.addEventListener("click", function (e) { if (e.target === els.cardModal) { closeCard(); } });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") { closeCard(); } });

    var initial = (location.hash || "").replace("#", "");
    activate(byId[initial] ? initial : "oggi");
  }

  window.Poltronave = { start: start };
})();
