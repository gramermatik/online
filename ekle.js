// "Ana ekrana ekle" yardımcısı: cihaza göre en basit adımları gösterir.
(function(){
  const uygulamaModu = matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
  if (uygulamaModu) return; // zaten ana ekrandan açılmış

  const ua = navigator.userAgent;
  const ios = /iPhone|iPad|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const android = /Android/.test(ua);
  if (!ios && !android) return; // bilgisayarda gösterme

  const safari = ios && !/CriOS|FxiOS|EdgiOS|OPiOS|GSA|Instagram|FBAN|FBAV/.test(ua);
  let yukleOlayi = null;

  const PAYLAS = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-label="Paylaş"><path d="M12 3v12M7 8l5-5 5 5"/><rect x="4" y="11" width="16" height="10" rx="2"/></svg>';
  const EKLE = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-label="Ekle"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="M12 8v8M8 12h8"/></svg>';
  const MENU = '<b style="font-size:1.2em;line-height:1">⋮</b>';

  function icerik(){
    if (ios && !safari) return `
      <h3>Önce Safari'de aç</h3>
      <ol><li>Bu sayfanın adresini kopyala: <b>gramermatik.github.io/online</b></li>
      <li><b>Safari</b>'yi aç ve adresi yapıştır.</li>
      <li>Sonra bu kutudaki adımları orada yap.</li></ol>`;
    if (ios) return `
      <h3>iPhone'da ana ekrana ekle</h3>
      <ol><li>${/iPad/.test(ua)||!/iPhone|iPod/.test(ua) ? "Üstteki" : "Alttaki"} <span class="ek-ikon">${PAYLAS}</span> <b>Paylaş</b> düğmesine dokun.</li>
      <li>Aşağı kaydır, <span class="ek-ikon">${EKLE}</span> <b>Ana Ekrana Ekle</b>'ye dokun.</li>
      <li>Sağ üstteki <b>Ekle</b>'ye dokun. Bitti!</li></ol>`;
    if (yukleOlayi) return `
      <h3>Telefonuna yükle</h3>
      <p>Tek dokunuşla ana ekranına ekle, uygulama gibi aç.</p>
      <button class="btn ana" id="ekYukle" type="button">📲 Yükle</button>`;
    return `
      <h3>Android'de ana ekrana ekle</h3>
      <ol><li>Sağ üstteki <span class="ek-ikon">${MENU}</span> <b>üç noktaya</b> dokun.</li>
      <li><b>Ana ekrana ekle</b> ya da <b>Uygulamayı yükle</b>'ye dokun.</li>
      <li><b>Yükle</b>'ye dokun. Bitti!</li></ol>`;
  }

  const stil = document.createElement("style");
  stil.textContent = `
  .ek-kutu{position:fixed;left:50%;bottom:calc(5.2rem + env(safe-area-inset-bottom));transform:translateX(-50%);z-index:60;width:min(26rem,calc(100% - 1.5rem));background:var(--kart,#fff);color:var(--yazi,#1d1d1f);border:2px solid var(--cizgi,#ddd);border-radius:18px;padding:1rem 1.1rem;box-shadow:0 10px 30px rgba(0,0,0,.25);animation:ekGel .35s ease-out}
  .ek-kutu.ust{bottom:auto;top:.75rem}
  .ek-kutu h3{margin:0 2rem .5rem 0;font-size:1.05rem}
  .ek-kutu ol{margin:0;padding-left:1.3rem;line-height:1.7}
  .ek-kutu p{margin:0 0 .7rem;color:var(--soluk,#666)}
  .ek-kutu .btn.ana{width:100%;padding:.75rem;font-weight:900;font-size:1.05rem}
  .ek-ikon{display:inline-flex;vertical-align:middle;color:#0a7aff}
  .ek-kapat{position:absolute;top:.5rem;right:.6rem;background:none;border:0;font-size:1.2rem;color:var(--soluk,#666);cursor:pointer;padding:.3rem}
  .ek-ok{position:fixed;left:50%;bottom:.3rem;transform:translateX(-50%);z-index:60;font-size:1.8rem;animation:ekZipla 1s infinite;pointer-events:none}
  @keyframes ekGel{from{opacity:0;transform:translate(-50%,1rem)}}
  @keyframes ekZipla{50%{transform:translate(-50%,.4rem)}}`;
  document.head.appendChild(stil);

  let kutu = null, ok = null;
  function kapat(kalici){
    if (kutu) kutu.remove(); if (ok) ok.remove(); kutu = ok = null;
    if (kalici) localStorage.setItem("gm_ekleKapandi", Date.now());
  }
  function goster(){
    const son = +localStorage.getItem("gm_ekleKapandi") || 0;
    if (Date.now() - son < 3 * 864e5) return; // kapatıldıysa 3 gün sorma
    kapat(false);
    kutu = document.createElement("div");
    kutu.className = "ek-kutu" + (android ? " ust" : "");
    kutu.setAttribute("role", "dialog");
    kutu.innerHTML = `<button class="ek-kapat" aria-label="Kapat">✕</button>` + icerik();
    document.body.appendChild(kutu);
    kutu.querySelector(".ek-kapat").onclick = () => kapat(true);
    const b = kutu.querySelector("#ekYukle");
    if (b) b.onclick = async () => { yukleOlayi.prompt(); const s = await yukleOlayi.userChoice; yukleOlayi = null; kapat(s.outcome !== "accepted"); };
    if (ios && safari && /iPhone|iPod/.test(ua)) { ok = document.createElement("div"); ok.className = "ek-ok"; ok.textContent = "👇"; document.body.appendChild(ok); }
  }

  addEventListener("beforeinstallprompt", e => { e.preventDefault(); yukleOlayi = e; if (kutu) goster(); });
  addEventListener("appinstalled", () => kapat(true));
  window.ekleYardimci = () => { localStorage.removeItem("gm_ekleKapandi"); goster(); };
  setTimeout(goster, 1500);
})();
