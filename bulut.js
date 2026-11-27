// Giriş, erişim kodu ve ilerlemenin buluta kaydı. Uygulamanın kendisi (app.js) erişim doğrulanınca yüklenir.
(function(){
  const $ = id => document.getElementById(id);
  const ANAHTARLAR = ["durum", "skor", "ogren", "yanlis", "kelime", "kelimeBilgi"];
  const goster = ad => ["adimYukle","adimGiris","adimKod"].forEach(x => $(x).classList.toggle("gizli", x !== ad));
  const mesaj = t => { $("genelMesaj").textContent = t || ""; };

  if (!window.supabase || !AYAR.SUPABASE_URL || AYAR.SUPABASE_URL.includes("PROJE-KODUN")) {
    goster("adimYukle"); $("adimYukle").innerHTML = "<p>Sunucu ayarı eksik (ayar.js). İnternet bağlantınızı kontrol edin.</p>"; return;
  }
  const sb = supabase.createClient(AYAR.SUPABASE_URL, AYAR.SUPABASE_ANON);
  let kullanici = null, basladi = false, zamanlayici = null;

  // --- yerel ↔ bulut ---
  const yereliTopla = () => { const v = {}; ANAHTARLAR.forEach(k => { const x = localStorage.getItem("gm_" + k); if (x != null) v[k] = JSON.parse(x); }); return v; };
  const yereleYaz = v => ANAHTARLAR.forEach(k => { if (v && k in v) localStorage.setItem("gm_" + k, JSON.stringify(v[k])); else localStorage.removeItem("gm_" + k); });

  async function gonder(){
    zamanlayici = null;
    if (!kullanici) return;
    const { error } = await sb.from("ilerleme").upsert({ kullanici: kullanici.id, veri: yereliTopla(), guncellendi: new Date().toISOString() });
    if (error) console.warn("İlerleme kaydedilemedi:", error.message);
  }
  window.bulutKaydet = () => { if (basladi && !zamanlayici) zamanlayici = setTimeout(gonder, 1500); };
  addEventListener("pagehide", () => { if (zamanlayici) { clearTimeout(zamanlayici); gonder(); } });
  document.addEventListener("visibilitychange", () => { if (document.hidden && zamanlayici) { clearTimeout(zamanlayici); gonder(); } });

  async function uygulamayiAc(){
    // başka hesabın verisi bu cihazda kalmasın
    if (localStorage.getItem("gm_sahip") !== kullanici.id) { yereleYaz({}); localStorage.setItem("gm_sahip", kullanici.id); }
    const { data, error } = await sb.from("ilerleme").select("veri").eq("kullanici", kullanici.id).maybeSingle();
    if (!error && data) yereleYaz(data.veri); // buluttaki kayıt esastır
    $("kilit").classList.add("gizli");
    const s = document.createElement("script"); s.src = "app.js";
    s.onload = () => { const k = document.createElement("script"); k.src = "kelime-app.js"; document.body.appendChild(k); basladi = true; if (!data) gonder(); };
    document.body.appendChild(s);
  }

  async function durumuKontrolEt(){
    mesaj("");
    const { data: { session } } = await sb.auth.getSession();
    kullanici = session ? session.user : null;
    if (!kullanici) { goster("adimGiris"); return; }
    const { data: var_, error } = await sb.rpc("erisim_var");
    if (error) { goster("adimGiris"); mesaj("Sunucuya ulaşılamadı. Tekrar deneyin."); return; }
    if (var_) return uygulamayiAc();
    $("kullaniciAd").textContent = (kullanici.user_metadata && (kullanici.user_metadata.full_name || kullanici.user_metadata.name)) || kullanici.email;
    goster("adimKod"); setTimeout(() => $("kodGir").focus(), 300);
  }

  // --- düğmeler ---
  $("googleGiris").onclick = async () => {
    const { error } = await sb.auth.signInWithOAuth({ provider: "google", options: { redirectTo: location.origin + location.pathname, queryParams: { prompt: "select_account" } } });
    if (error) mesaj("Giriş başlatılamadı: " + error.message);
  };
  const cikis = async e => { e && e.preventDefault(); if (zamanlayici) { clearTimeout(zamanlayici); await gonder(); } await sb.auth.signOut(); yereleYaz({}); localStorage.removeItem("gm_sahip"); location.reload(); };
  $("cikis1").onclick = cikis;
  $("cikis2").onclick = cikis;

  $("kodGir").addEventListener("input", e => {
    const k = kodTemizle(e.target.value).slice(0, 8);
    e.target.value = k.length ? "GM-" + k.slice(0, 4) + (k.length > 4 ? "-" + k.slice(4) : "") : "";
    e.target.classList.remove("hata"); $("kilitMesaj").textContent = "";
  });
  $("adimKod").onsubmit = async e => {
    e.preventDefault();
    const g = $("kodGir"), b = $("kodBtn");
    const hata = t => { g.classList.remove("hata"); void g.offsetWidth; g.classList.add("hata"); $("kilitMesaj").textContent = t; };
    if (kodTemizle(g.value).length < 8) return hata("Kod eksik görünüyor.");
    b.disabled = true;
    const { data, error } = await sb.rpc("kod_kullan", { girdi: g.value });
    b.disabled = false;
    if (error) return hata("Sunucuya ulaşılamadı. Tekrar deneyin.");
    if (data === "tamam" || data === "zaten") return uygulamayiAc();
    hata(data === "kullanilmis" ? "Bu kod başka bir hesapta kullanılmış." : "Bu kod geçerli değil. Lütfen kontrol edin.");
  };

  durumuKontrolEt();
  if ("serviceWorker" in navigator && location.protocol.startsWith("http") && !/^(localhost|127\.)/.test(location.hostname)) navigator.serviceWorker.register("sw.js").catch(() => {});
})();
