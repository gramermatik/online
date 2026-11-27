// --- Kelime alıştırması (B1-B2-C1) ---
// Kayıt: gm_kelime = { "ingilizce": { d: doğru sayısı (0-3), n: bir sonraki tekrar zamanı, w: 1 = son cevap yanlış, y: toplam yanlış } }
// Öğrenildi sayılmak için 3 kez, FARKLI ZAMANLARDA doğru bilinmeli (1 gün, sonra 3 gün arayla).
(function(){
  const GUN = 864e5, ARALIK = [0, GUN, 3 * GUN], HEDEF = 3;
  let kayit = depo.al("kelime", {});
  let seviye = "hepsi", kmod = "normal", kSoru = null;
  const durumu = en => kayit[en] || null;
  const ogrenildi = en => (kayit[en] && kayit[en].d >= HEDEF);
  const sakla = () => depo.koy("kelime", kayit);

  function havuz(){ return KELIMELER.filter(k => seviye === "hepsi" || k.sv === seviye); }
  const yanlisListesi = () => havuz().filter(k => kayit[k.en] && kayit[k.en].w);

  function sec(){
    const p = havuz(), simdi = Date.now();
    if (kmod === "yanlis") { const y = yanlisListesi(); return y.length ? y[rastgele(y.length)] : null; }
    const vadesi = p.filter(k => { const s = kayit[k.en]; return s && !s.w && s.d > 0 && s.d < HEDEF && s.n <= simdi; });
    const yanlis = p.filter(k => kayit[k.en] && kayit[k.en].w);
    const yeni = p.filter(k => !kayit[k.en]);
    const r = Math.random();
    if (vadesi.length && r < .5) return vadesi[rastgele(vadesi.length)];
    if (yanlis.length && r < .75) return yanlis[rastgele(yanlis.length)];
    if (yeni.length) return yeni[rastgele(yeni.length)];
    if (vadesi.length) return vadesi[rastgele(vadesi.length)];
    if (yanlis.length) return yanlis[rastgele(yanlis.length)];
    const kalan = p.filter(k => !ogrenildi(k.en));
    const liste = kalan.length ? kalan : p;
    return liste[rastgele(liste.length)];
  }

  // anlamı çakışan şık olmasın ("ikna etmek" gibi)
  const parcalar = tr => tr.toLocaleLowerCase("tr").replace(/\(.*?\)/g, "").split(",").map(s => s.trim()).filter(Boolean);
  function celdiriciler(k){
    const benim = new Set(parcalar(k.tr));
    const uygunMu = x => x.en !== k.en && !parcalar(x.tr).some(p => benim.has(p));
    let aday = KELIMELER.filter(x => x.sv === k.sv && uygunMu(x));
    if (aday.length < 3) aday = KELIMELER.filter(uygunMu);
    const sonuc = [];
    while (sonuc.length < 3 && aday.length) sonuc.push(aday.splice(rastgele(aday.length), 1)[0]);
    return sonuc;
  }

  const noktalar = d => "●".repeat(Math.min(d, HEDEF)) + "○".repeat(Math.max(0, HEDEF - d));
  function ustCiz(){
    const p = havuz(), bil = p.filter(k => ogrenildi(k.en)).length, simdi = Date.now();
    const vade = p.filter(k => { const s = kayit[k.en]; return s && !s.w && s.d > 0 && s.d < HEDEF && s.n <= simdi; }).length;
    $("kOgren").textContent = `${bil} / ${p.length}`;
    $("kVade").textContent = vade;
    $("kYanlisSay").textContent = yanlisListesi().length;
  }

  function yeniKelime(){
    ustCiz();
    $("kSonuc").innerHTML = ""; $("kSonraki").classList.add("gizli");
    const k = sec();
    if (!k) {
      kSoru = null;
      $("kUyari").classList.add("gizli"); $("kSeviye").textContent = "";
      $("kMetin").textContent = "🎉 Tekrar edilecek yanlış kelimen yok!";
      $("kSec").innerHTML = `<div class="bos">Yanlış yaptığın kelimeler buraya gelir. Doğru bildikçe listeden çıkar.</div>`;
      return;
    }
    const s = durumu(k.en);
    const sec4 = [k, ...celdiriciler(k)].sort(() => Math.random() - .5);
    kSoru = { k, sec4 };
    $("kSeviye").textContent = k.sv;
    $("kSeviye").className = "sv sv-" + k.sv;
    $("kMetin").textContent = k.tr;
    $("kIlerleme").textContent = s ? noktalar(s.d) : "";
    $("kUyari").classList.toggle("gizli", !(s && s.y > 0));
    $("kSec").innerHTML = sec4.map((x, i) => `<button data-i="${i}">${x.en}</button>`).join("");
  }

  $("kSec").onclick = e => {
    const b = e.target.closest("button"); if (!b || !kSoru || !$("kSonraki").classList.contains("gizli")) return;
    const k = kSoru.k, x = kSoru.sec4[+b.dataset.i], ok = x.en === k.en, simdi = Date.now();
    [...$("kSec").children].forEach((el, i) => { if (kSoru.sec4[i].en === k.en) el.classList.add("dogru"); });
    const s = kayit[k.en] || (kayit[k.en] = { d: 0, n: 0, w: 0, y: 0 });
    let not = "";
    if (ok) {
      if (s.w) { s.w = 0; s.d = 1; s.n = simdi + GUN; not = "Yanlışlar listenden çıktı. 1 gün sonra tekrar sorulacak."; }
      else if (s.n <= simdi) {
        s.d++;
        if (s.d >= HEDEF) not = "🏆 Bu kelimeyi öğrendin!";
        else { s.n = simdi + ARALIK[s.d]; not = s.d === 1 ? "1 gün sonra tekrar sorulacak." : "3 gün sonra tekrar sorulacak."; }
      } else not = "Bugün zaten doğru bildin; sayaç bir sonraki tekrarda artar.";
    } else {
      b.classList.add("yanlis");
      s.d = 0; s.w = 1; s.y++; s.n = simdi;
      not = "Yanlışlar listene eklendi. Öğrenildi sayılması için baştan 3 kez doğru bilmelisin.";
      if (navigator.vibrate) navigator.vibrate(120);
    }
    sakla();
    $("kIlerleme").textContent = noktalar(s.d);
    $("kSonuc").innerHTML = `<div class="ipucu kelime-ornek"><b>${k.en}</b> = ${k.tr}<div class="orn">“${k.ornEn}”</div><small>${k.ornTr}</small><div class="kn">${ok ? "✅" : "❌"} ${not}</div></div>`;
    soyle(k.en, "en-US");
    $("kSonraki").classList.remove("gizli");
    ustCiz();
  };
  $("kSonraki").onclick = yeniKelime;
  $("kDinle").onclick = () => kSoru && soyle(kSoru.k.en, "en-US");
  document.querySelectorAll("[data-sv]").forEach(b => b.onclick = () => {
    seviye = b.dataset.sv; kmod = "normal";
    document.querySelectorAll("[data-sv]").forEach(x => x.classList.toggle("aktif", x === b));
    $("kYanlisBtn").classList.remove("aktif");
    yeniKelime();
  });
  $("kYanlisBtn").onclick = () => {
    kmod = kmod === "yanlis" ? "normal" : "yanlis";
    $("kYanlisBtn").classList.toggle("aktif", kmod === "yanlis");
    yeniKelime();
  };

  // --- ilk girişte bir kez çıkan "Önemli!" penceresi ---
  function onemliAc(){ $("kOnemli").classList.remove("kapan"); }
  $("kOnemliKapat").onclick = () => { $("kOnemli").classList.add("kapan"); depo.koy("kelimeBilgi", true); };
  $("kBilgiBtn").onclick = onemliAc;

  window.kelimeSayfasi = () => {
    if (!depo.al("kelimeBilgi", false)) onemliAc();
    if (!kSoru) yeniKelime(); else ustCiz();
  };
})();
