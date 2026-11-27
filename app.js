const $ = id => document.getElementById(id);
const RENK = {kirmizi:["#d62828","#a51c1c"],mavi:["#7cc6e8","#3f93bb"],sari:["#f4a72a","#c27a0e"],kirmizi2:["#d62828","#a51c1c"]};
const SINIF = {fiil:"k",sifat:"m",isim:"s",soru:"k"};
const depo = { al(k,d){try{const v=localStorage.getItem("gm_"+k);return v==null?d:JSON.parse(v)}catch(e){return d}}, koy(k,v){try{localStorage.setItem("gm_"+k,JSON.stringify(v))}catch(e){} if(window.bulutKaydet) bulutKaydet(); } };

let durum = depo.al("durum", {plaka:"fiil", satir:0, kelime:{fiil:0,sifat:0,isim:0,soru:0}});
$("sayac").textContent = TOPLAM.toLocaleString("tr") + " cümle";

// --- ses ---
// Android uygulaması içinde telefonun kendi ses motoru (Capacitor eklentisi) kullanılır
const yerelSes = window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform() && window.Capacitor.Plugins.TextToSpeech;
function soyle(metin, dil){
  if(yerelSes){
    yerelSes.stop().catch(()=>{}).finally(()=> yerelSes.speak({text:metin, lang:dil, rate: dil==="en-US" ? .9 : 1, category:"playback"}).catch(()=>{}));
    return;
  }
  if(!("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(metin);
  u.lang = dil; u.rate = dil==="en-US" ? .9 : 1;
  const ses = speechSynthesis.getVoices().find(v=>v.lang.replace("_","-").startsWith(dil.slice(0,2)));
  if(ses) u.voice = ses;
  speechSynthesis.speak(u);
}

// --- kutu ---
function sekmeleriCiz(){
  $("sekmeler").innerHTML = Object.entries(PLAKALAR).map(([k,p]) =>
    `<button class="${SINIF[k]} ${k===durum.plaka?"aktif":""}" data-k="${k}">${p.ad}</button>`).join("");
}
$("sekmeler").onclick = e => { const k = e.target.dataset.k; if(!k) return; durum.plaka=k; durum.satir=Math.min(durum.satir, PLAKALAR[k].satirlar.length-1); ciz(); };

const gunlukHtml = g => g ? `💬 <span>${g.etiket}:</span> ${g.metin}` : "";
function gunlukGoster(){ const a = soruV.a, h = gunlukHtml(gunluk(a.k, a.s, PLAKALAR[a.k].cubuk()[a.w])); $("qGunluk").innerHTML = h; $("qGunluk").classList.toggle("gizli", !h); }
function ciz(){
  const p = PLAKALAR[durum.plaka], [r1,r2] = RENK[p.renk];
  document.documentElement.style.setProperty("--plaka", r1);
  document.documentElement.style.setProperty("--plaka-k", r2);
  sekmeleriCiz();
  const kelimeler = p.cubuk(), w = kelimeler[durum.kelime[durum.plaka]];
  if(!uygun(durum.plaka, durum.satir, w)) durum.satir = p.satirlar.findIndex((_,i)=>uygun(durum.plaka,i,w));
  const satirHtml = (i,t) => `<div class="satir ${i===durum.satir?"secili":""} ${uygun(durum.plaka,i,w)?"":"kapali"}" data-i="${i}">${t}</div>`;
  $("plaka").innerHTML =
    `<div class="sutun sol">${p.satirlar.map((r,i)=>satirHtml(i,r[0])).join("")}</div>
     <div class="yuva" style="--n:${p.satirlar.length}"><div class="cubuk" id="cubuk" style="--i:${durum.satir}">${w.en.replace(/^an? /,"").toLocaleUpperCase("en")}<small>${w.tr.toLocaleUpperCase("tr")}</small></div></div>
     <div class="sutun sag">${p.satirlar.map((r,i)=>satirHtml(i,r[1])).join("")}</div>`;
  $("cubukAd").textContent = `${w.en} · ${w.tr}`;
  const c = cumle(durum.plaka, durum.satir, w);
  $("cEn").textContent = c.en;
  $("cTr").textContent = c.tr;
  $("cGunluk").innerHTML = gunlukHtml(gunluk(durum.plaka, durum.satir, w));
  $("cIpucu").textContent = "💡 " + IPUCU[durum.plaka][durum.satir];
  depo.koy("durum", durum);
  sigdir();
  ipucuOku();
}
// Sığmayan yazıyı (çubuk ve plaka satırları) taşana kadar küçült
function sigdir(){
  document.querySelectorAll("#cubuk, #cubuk small, .satir").forEach(e=>{
    e.style.fontSize = "";
    let f = parseFloat(getComputedStyle(e).fontSize);
    while(e.scrollWidth > e.clientWidth + 1 && f > 7){ f -= .5; e.style.fontSize = f + "px"; }
  });
}
window.addEventListener("resize", ()=>{ sigdir(); });
if(document.fonts) document.fonts.ready.then(sigdir); // yazı tipi yüklenince yeniden ölç
// plaka alanı: aşağıda gizli satır varsa "▼ kaydır" etiketi görünür
function ipucuOku(){ const a = $("plakaAlan"); $("asagi").classList.toggle("yok", a.scrollTop + a.clientHeight >= a.scrollHeight - 6); }
$("plakaAlan").addEventListener("scroll", ipucuOku, {passive:true});
window.addEventListener("resize", ipucuOku);
$("plaka").onclick = e => {
  const s = e.target.closest(".satir");
  if(s && s.classList.contains("kapali")) return;
  if(s){ durum.satir = +s.dataset.i; ciz(); soyle($("cEn").textContent,"en-US"); }
  else if(e.target.closest(".cubuk")) listeAc();
};
function kaydir(d){ const n = PLAKALAR[durum.plaka].cubuk().length; durum.kelime[durum.plaka] = (durum.kelime[durum.plaka]+d+n)%n; ciz(); }
$("onceki").onclick = () => kaydir(-1);
$("sonraki").onclick = () => kaydir(1);
$("dinleEn").onclick = () => soyle($("cEn").textContent, "en-US");
$("dinleTr").onclick = () => soyle($("cTr").textContent, "tr-TR");
$("zar").onclick = () => { const l = TUM_CUMLELER.filter(c=>c.k===durum.plaka), c = l[Math.floor(Math.random()*l.length)]; durum.satir = c.s; durum.kelime[durum.plaka] = c.w; ciz(); };

// kaydırma hareketi: plakada sola/sağa çek → çubuk değişir
let dx0=null;
$("plaka").addEventListener("touchstart", e=>{dx0=e.touches[0].clientX},{passive:true});
$("plaka").addEventListener("touchend", e=>{ if(dx0==null) return; const d=e.changedTouches[0].clientX-dx0; if(Math.abs(d)>60) kaydir(d<0?1:-1); dx0=null; });

// çubuk listesi
function listeAc(){ $("perde").classList.add("acik"); $("ara").value=""; listeCiz(); }
function listeCiz(){
  const q = $("ara").value.toLocaleLowerCase("tr").trim();
  $("izgara").innerHTML = PLAKALAR[durum.plaka].cubuk().map((w,i)=>
    (!q || w.en.includes(q) || w.tr.toLocaleLowerCase("tr").includes(q)) ? `<button data-i="${i}">${w.en}<small>${w.tr}</small></button>` : "").join("");
}
$("tumu").onclick = listeAc;
$("ara").oninput = listeCiz;
$("izgara").onclick = e => { const b = e.target.closest("button"); if(!b) return; durum.kelime[durum.plaka] = +b.dataset.i; $("perde").classList.remove("acik"); ciz(); };
$("perde").onclick = e => { if(e.target.id==="perde") $("perde").classList.remove("acik"); };

// --- alıştırma ---
let mod = "tr", skor = depo.al("skor",{dogru:0,seri:0,rekor:0}), soruV = null;
// öğrenilenler (doğru bilinen cümleler) ve yanlışlar: "plaka|satır|kelime" anahtarıyla saklanır
const anahtar = a => `${a.k}|${a.s}|${a.w}`;
const coz = key => { const [k,s,w] = key.split("|"); return {k, s:+s, w:+w}; };
const ogrenilen = new Set(depo.al("ogren", []));
let yanlislar = depo.al("yanlis", []);
function kaydet(){ depo.koy("ogren", [...ogrenilen]); depo.koy("yanlis", yanlislar); $("yanlisSay").textContent = yanlislar.length; }
const rastgele = n => Math.floor(Math.random()*n);
function rastgeleCumle(){
  if(mod==="tekrar") return coz(yanlislar[rastgele(yanlislar.length)]);
  return TUM_CUMLELER[rastgele(TUM_CUMLELER.length)];
}
function yeniSoru(){
  $("qIpucu").classList.add("gizli"); $("qGunluk").classList.add("gizli");
  if(mod==="tekrar" && !yanlislar.length){
    soruV = null;
    $("qEtiket").textContent = "";
    $("qMetin").textContent = "🎉 Tekrar edilecek yanlışın yok!";
    $("qSec").innerHTML = `<div class="bos">Alıştırmada yanlış yaptığın cümleler buraya gelir. Doğru bildikçe listeden çıkar.</div>`;
    $("qSonraki").classList.add("gizli");
    return;
  }
  const a = rastgeleCumle(), p = PLAKALAR[a.k], dogru = cumle(a.k,a.s,p.cubuk()[a.w]);
  if(mod==="yaz"){
    soruV = {dogru, sec:[], a, yaz:true};
    $("qEtiket").textContent = "Bu cümleyi İngilizce yaz";
    $("qMetin").textContent = dogru.tr;
    $("qSec").innerHTML = `<form class="yaz-form" id="yazForm" autocomplete="off"><input id="yazGir" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="done" placeholder="İngilizcesini yaz…" aria-label="Cevabın"><button class="btn ana" type="submit" id="yazKontrol">Kontrol et</button></form><div id="yazSonuc"></div>`;
    $("qSonraki").classList.add("gizli");
    $("yazForm").onsubmit = e => { e.preventDefault(); yazKontrol(); };
    setTimeout(()=>$("yazGir").focus(), 50);
    return;
  }
  const set = new Map([[dogru.en, dogru]]);
  let deneme = 0;
  while(set.size<4 && deneme++<50){
    // çeldiriciler: çoğu aynı kelimeyle farklı kalıp → zaman/kip farkını öğretir
    const s = Math.random()<.75 ? rastgele(p.satirlar.length) : a.s;
    const w = s===a.s ? rastgele(p.cubuk().length) : a.w;
    if(!uygun(a.k,s,p.cubuk()[w])) continue;
    const c = cumle(a.k,s,p.cubuk()[w]); set.set(c.en, c);
  }
  const sec = [...set.values()].sort(()=>Math.random()-.5);
  soruV = {dogru, sec, a};
  const en = mod==="en";
  $("qEtiket").textContent = mod==="tekrar" ? "🔁 Tekrar: bu cümlenin İngilizcesi hangisi?" : en ? "Bu cümlenin Türkçesi hangisi?" : "Bu cümlenin İngilizcesi hangisi?";
  $("qMetin").textContent = en ? dogru.en : dogru.tr;
  $("qSec").innerHTML = sec.map((c,i)=>`<button data-i="${i}">${en?c.tr:c.en}</button>`).join("");
  $("qSonraki").classList.add("gizli");
  if(mod==="en") soyle(dogru.en,"en-US");
}
function puanCiz(){ $("pDogru").textContent=skor.dogru; $("pSeri").textContent=skor.seri; $("pRekor").textContent=skor.rekor; }
$("qSec").onclick = e => {
  if(soruV && soruV.yaz) return;
  const b = e.target.closest("button"); if(!b || !$("qSonraki").classList.contains("gizli")) return;
  const c = soruV.sec[+b.dataset.i], ok = c.en===soruV.dogru.en;
  [...$("qSec").children].forEach((x,i)=>{ if(soruV.sec[i].en===soruV.dogru.en) x.classList.add("dogru"); });
  const key = anahtar(soruV.a);
  if(ok){ skor.dogru++; skor.seri++; skor.rekor=Math.max(skor.rekor,skor.seri); ogrenilen.add(key); yanlislar = yanlislar.filter(x=>x!==key); }
  else { b.classList.add("yanlis"); skor.seri=0; ogrenilen.delete(key); if(!yanlislar.includes(key)) yanlislar.push(key); if(navigator.vibrate) navigator.vibrate(120); }
  depo.koy("skor",skor); puanCiz(); kaydet();
  $("qIpucu").textContent = "💡 " + IPUCU[soruV.a.k][soruV.a.s];
  $("qIpucu").classList.remove("gizli");
  gunlukGoster();
  soyle(soruV.dogru.en,"en-US");
  $("qSonraki").classList.remove("gizli");
};
// yazarak cevap: o anlama gelen tüm doğru çeviriler kabul edilir (cevaplar.js)
const kacis = s => s.replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[c]);
const noktala = (c, ornek) => c + (ornek.endsWith("?") ? "?" : ".");
function yazKontrol(){
  const g = $("yazGir");
  if(!soruV || !soruV.yaz || !$("qSonraki").classList.contains("gizli")) return yeniSoru();
  if(!g.value.trim()){ g.focus(); return; }
  const s = cevapKontrol(soruV.a, g.value), ok = s.durum !== "yanlis", key = anahtar(soruV.a);
  const digerleri = s.liste.filter(c => c !== s.eslesen).map(c => noktala(c, soruV.dogru.en));
  g.classList.add(ok ? "dogru" : "yanlis"); g.readOnly = true;
  $("yazKontrol").textContent = "Sonraki ▶";
  let html;
  if(s.durum === "dogru") html = `<b>✅ Doğru!</b>`;
  else if(s.durum === "yazim") html = `<b>✅ Doğru, küçük bir yazım hatası var:</b>${kacis(noktala(s.eslesen, soruV.dogru.en))}`;
  else html = `<b>❌ Doğrusu:</b>${kacis(soruV.dogru.en)}`;
  const kalan = s.durum === "yanlis" ? digerleri.filter(c => c !== soruV.dogru.en) : digerleri;
  if(kalan.length) html += `<div style="margin-top:.4rem;font-size:.92rem">Bunlar da doğru:</div><ul>${kalan.map(c=>`<li>${kacis(c)}</li>`).join("")}</ul>`;
  $("yazSonuc").innerHTML = `<div class="yaz-sonuc">${html}</div>`;
  if(ok){ skor.dogru++; skor.seri++; skor.rekor=Math.max(skor.rekor,skor.seri); ogrenilen.add(key); yanlislar = yanlislar.filter(x=>x!==key); }
  else { skor.seri=0; ogrenilen.delete(key); if(!yanlislar.includes(key)) yanlislar.push(key); if(navigator.vibrate) navigator.vibrate(120); }
  depo.koy("skor",skor); puanCiz(); kaydet();
  $("qIpucu").textContent = "💡 " + IPUCU[soruV.a.k][soruV.a.s];
  $("qIpucu").classList.remove("gizli");
  gunlukGoster();
  soyle(soruV.dogru.en,"en-US");
  $("qSonraki").classList.remove("gizli");
  $("yazKontrol").focus();
}
$("qSonraki").onclick = yeniSoru;
$("qDinle").onclick = () => soruV && (mod==="en" ? soyle(soruV.dogru.en,"en-US") : soyle(soruV.dogru.tr,"tr-TR"));
const modDugmeleri = document.querySelectorAll("[data-mod]");
modDugmeleri.forEach(b=>b.onclick=()=>{ mod=b.dataset.mod; modDugmeleri.forEach(x=>x.classList.toggle("aktif",x===b)); yeniSoru(); });

// --- ilerleme ---
const RENK_ADI = {fiil:"var(--kirmizi)",sifat:"var(--mavi)",isim:"var(--sari)",soru:"var(--kirmizi)"};
function ilerlemeCiz(){
  const yuzdeYaz = y => (y>0 && y<10 ? y.toFixed(1).replace(".",",") : Math.round(y));
  const n = ogrenilen.size, yuzde = yuzdeYaz(n/TOPLAM*100);
  $("halka").style.setProperty("--y", n/TOPLAM*100);
  $("genelYuzde").textContent = "%" + yuzde;
  $("ogrenSay").textContent = n.toLocaleString("tr");
  $("toplamSay").textContent = TOPLAM.toLocaleString("tr");
  $("cubuklar").innerHTML = Object.entries(PLAKALAR).map(([k,p])=>{
    const top = TUM_CUMLELER.filter(c=>c.k===k).length;
    const bil = [...ogrenilen].filter(x=>x.startsWith(k+"|")).length;
    const y = bil/top*100;
    return `<div class="bar"><div class="bar-ust">${p.ad} plakası <span>${bil} / ${top} · %${yuzdeYaz(y)}</span></div><div class="bar-ic"><div style="width:${y}%;background:${RENK_ADI[k]}"></div></div></div>`;
  }).join("");
  $("yanlisBaslik").textContent = yanlislar.length ? `(${yanlislar.length})` : "";
  $("yanlisListe").innerHTML = yanlislar.length
    ? yanlislar.slice().reverse().map(key=>{ const a = coz(key), c = cumle(a.k,a.s,PLAKALAR[a.k].cubuk()[a.w]); return `<div>${c.en}<small>${c.tr}</small></div>`; }).join("")
    : `<div class="bos">Henüz yanlışın yok 👏</div>`;
}

// --- sayfalar ---
document.querySelectorAll("nav.alt button").forEach(b=>b.onclick=()=>{
  const s = b.dataset.sayfa;
  document.querySelectorAll("nav.alt button").forEach(x=>x.classList.toggle("aktif",x===b));
  ["kutu","alistirma","ilerleme"].forEach(id=>$(id).classList.toggle("gizli", id!==s));
  if(s==="alistirma" && !soruV) yeniSoru();
  if(s==="ilerleme") ilerlemeCiz();
});
kaydet();

// --- nasıl çalışır penceresi: 5 sn sonra kendiliğinden kapanır ---
let bilgiZaman;
function bilgiKapat(){ clearTimeout(bilgiZaman); $("bilgi").classList.add("kapan"); }
function bilgiAc(){
  const b = $("bilgi"), s = $("bilgiSure");
  b.classList.remove("kapan");
  s.style.animation = "none"; void s.offsetWidth; s.style.animation = "azal 5s linear forwards";
  clearTimeout(bilgiZaman); bilgiZaman = setTimeout(bilgiKapat, 5000);
}
$("bilgiKapat").onclick = bilgiKapat;
$("bilgi").onclick = e => { if(e.target.id==="bilgi") bilgiKapat(); };
$("yardim").onclick = bilgiAc;

ciz(); puanCiz(); bilgiAc();
