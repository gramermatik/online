// Türkçe ek motoru: ünlü uyumu, ünsüz benzeşmesi, kaynaştırma
const UNLU = "aeıioöuü";
const sonUnlu = s => { for (let i = s.length - 1; i >= 0; i--) if (UNLU.includes(s[i])) return s[i]; return "e"; };
const h2 = s => ("eiöü".includes(sonUnlu(s)) ? "e" : "a");
const h4 = s => ({ a: "ı", ı: "ı", e: "i", i: "i", o: "u", u: "u", ö: "ü", ü: "ü" })[sonUnlu(s)];
const unluBiter = s => UNLU.includes(s[s.length - 1]);
const D = s => ("fstkçşhp".includes(s[s.length - 1]) ? "t" : "d");
const soru = s => " m" + h4(s); // mı/mi/mu/mü

// --- fiil gövdeleri ---
const yGovde = v => (v.tr === "ye" ? "yiy" : unluBiter(v.tr) ? v.tr + "y" : v.soft); // ünlüyle başlayan ekler için
const surekli = v => {
  if (v.tr === "ye") return "yiyor";
  if (unluBiter(v.tr)) { const b = v.tr.slice(0, -1); return b + h4(b) + "yor"; }
  return v.soft + h4(v.tr) + "yor";
};
const olumsuzSurekli = v => v.tr + "m" + h4(v.tr) + "yor";
const gecmis = v => v.tr + D(v.tr) + h4(v.tr);
const gelecek = v => { const g = yGovde(v); const a = h2(g); return g + a + "c" + a + "k"; };
const gelecek1 = v => { const f = gelecek(v); return f.slice(0, -1) + "ğ" + h4(f) + "m"; };
const mali = v => v.tr + "m" + h2(v.tr) + "l" + h4(h2(v.tr));
const mak = v => v.tr + "m" + h2(v.tr) + "k";
const ing = en => {
  const ikiz = { run: "running", swim: "swimming", sit: "sitting", cut: "cutting", stop: "stopping", plan: "planning", win: "winning" };
  if (ikiz[en]) return ikiz[en];
  if (en.endsWith("ee")) return en + "ing";
  if (en.endsWith("e")) return en.slice(0, -1) + "ing";
  return en + "ing";
};

// --- PLAKALAR ---  [ingilizce kalıp, plakadaki türkçe ek, cümle(en), cümle(tr)]
const PLAKALAR = {
  fiil: {
    ad: "Fiil", renk: "kirmizi", cubuk: () => FIILLER,
    satirlar: [
      ["I", "ERİM, ARIM", v => `I ${v.en}.`, v => v.aor + h4(v.aor) + "m"],
      ["I AM", "YORUM", v => `I am ${ing(v.en)}.`, v => surekli(v) + "um"],
      ["ARE YOU", "YOR MUSUN?", v => `Are you ${ing(v.en)}?`, v => surekli(v) + " musun?"],
      ["I DID", "DIM, DİM", v => `I did ${v.en}.`, v => gecmis(v) + "m"],
      ["DID YOU", "DIN MI, DİN Mİ", v => `Did you ${v.en}?`, v => { const p = gecmis(v); return p + "n" + soru(p) + "?"; }],
      ["I CAN", "EBİLİRİM", v => `I can ${v.en}.`, v => yGovde(v) + h2(yGovde(v)) + "bilirim"],
      ["CAN YOU", "EBİLİR MİSİN?", v => `Can you ${v.en}?`, v => yGovde(v) + h2(yGovde(v)) + "bilir misin?"],
      ["I WILL", "ECEĞİM", v => `I will ${v.en}.`, v => gelecek1(v)],
      ["WILL YOU", "ECEK MİSİN?", v => `Will you ${v.en}?`, v => { const f = gelecek(v); return f + soru(f) + "s" + h4(f) + "n?"; }],
      ["I SHOULD", "MELİYİM", v => `I should ${v.en}.`, v => mali(v) + "y" + h4(mali(v)) + "m"],
      ["SHOULD I", "MELİ MİYİM?", v => `Should I ${v.en}?`, v => { const m = mali(v); return m + soru(m) + "y" + h4(m) + "m?"; }],
      ["I HAVE TO", "MEK ZORUNDAYIM", v => `I have to ${v.en}.`, v => mak(v) + " zorundayım"],
      ["I WANT TO", "MEK İSTİYORUM", v => `I want to ${v.en}.`, v => mak(v) + " istiyorum"],
      ["DO YOU WANT TO", "MEK İSTİYOR MUSUN?", v => `Do you want to ${v.en}?`, v => mak(v) + " istiyor musun?"],
      ["I NEED TO", "MEM LAZIM", v => `I need to ${v.en}.`, v => v.tr + "m" + h2(v.tr) + "m lazım"],
      ["LET ME", "EYİM, AYIM", v => `Let me ${v.en}.`, v => { const g = yGovde(v), a = h2(g); return g + a + "y" + h4(a) + "m"; }],
      ["LET'S", "ALIM, ELİM", v => `Let's ${v.en}.`, v => { const g = yGovde(v), a = h2(g); return g + a + "l" + h4(a) + "m"; }],
      ["DON'T", "ME, MA", v => `Don't ${v.en}.`, v => v.tr + "m" + h2(v.tr)],
    ],
  },
  sifat: {
    ad: "Sıfat", renk: "mavi", cubuk: () => SIFATLAR,
    satirlar: [
      ["IT WAS", "DI, Dİ", a => `It was ${a.en}.`, a => a.tr + (unluBiter(a.tr) ? "yd" : D(a.tr)) + h4(a.tr)],
      ["WAS IT", "MIYDI, MİYDİ?", a => `Was it ${a.en}?`, a => a.tr + soru(a.tr) + "yd" + h4(a.tr) + "?"],
      ["IT WAS NOT", "DEĞİLDİ", a => `It was not ${a.en}.`, a => a.tr + " değildi"],
      ["IT IS", "DIR, DİR", a => `It is ${a.en}.`, a => a.tr + D(a.tr) + h4(a.tr) + "r"],
      ["IS IT", "MI, Mİ?", a => `Is it ${a.en}?`, a => a.tr + soru(a.tr) + "?"],
      ["IT IS NOT", "DEĞİL", a => `It is not ${a.en}.`, a => a.tr + " değil"],
      ["IT WILL BE", "OLACAK", a => `It will be ${a.en}.`, a => a.tr + " olacak"],
      ["WILL IT BE", "OLACAK MI?", a => `Will it be ${a.en}?`, a => a.tr + " olacak mı?"],
      ["IT WILL NOT BE", "OLMAYACAK", a => `It will not be ${a.en}.`, a => a.tr + " olmayacak"],
      ["IT CAN BE", "OLABİLİR", a => `It can be ${a.en}.`, a => a.tr + " olabilir"],
      ["CAN IT BE", "OLABİLİR Mİ?", a => `Can it be ${a.en}?`, a => a.tr + " olabilir mi?"],
      ["IT CAN NOT BE", "OLAMAZ", a => `It cannot be ${a.en}.`, a => a.tr + " olamaz"],
      ["IT SHOULD BE", "OLMALI", a => `It should be ${a.en}.`, a => a.tr + " olmalı"],
      ["SHOULD IT BE", "OLMALI MI?", a => `Should it be ${a.en}?`, a => a.tr + " olmalı mı?"],
      ["IT SHOULDN'T BE", "OLMAMALI", a => `It shouldn't be ${a.en}.`, a => a.tr + " olmamalı"],
      ["IT COULD BE", "OLABİLİRDİ", a => `It could be ${a.en}.`, a => a.tr + " olabilirdi"],
      ["COULD IT BE", "OLABİLİR MİYDİ?", a => `Could it be ${a.en}?`, a => a.tr + " olabilir miydi?"],
      ["IT COULD NOT BE", "OLAMAZDI", a => `It could not be ${a.en}.`, a => a.tr + " olamazdı"],
    ],
  },
  isim: {
    ad: "İsim", renk: "sari", cubuk: () => ISIMLER,
    satirlar: [
      ["THERE WAS", "VARDI", n => `There was ${n.en}.`, n => n.tr + " vardı"],
      ["WAS THERE", "VAR MIYDI?", n => `Was there ${n.en}?`, n => n.tr + " var mıydı?"],
      ["THERE WAS NOT", "YOKTU", n => `There was not ${n.en}.`, n => n.tr + " yoktu"],
      ["THERE IS", "VAR", n => `There is ${n.en}.`, n => n.tr + " var"],
      ["IS THERE", "VAR MI?", n => `Is there ${n.en}?`, n => n.tr + " var mı?"],
      ["THERE IS NOT", "YOK", n => `There is not ${n.en}.`, n => n.tr + " yok"],
      ["THERE WILL BE", "OLACAK", n => `There will be ${n.en}.`, n => n.tr + " olacak"],
      ["WILL THERE BE", "OLACAK MI?", n => `Will there be ${n.en}?`, n => n.tr + " olacak mı?"],
      ["THERE WILL NOT BE", "OLMAYACAK", n => `There will not be ${n.en}.`, n => n.tr + " olmayacak"],
      ["I HAD", "M VARDI, IM VARDI", n => `I had ${n.en}.`, n => n.my + " vardı"],
      ["DID YOU HAVE", "N VAR MIYDI?", n => `Did you have ${n.en}?`, n => sen(n) + " var mıydı?"],
      ["I DIDN'T HAVE", "M YOKTU, IM YOKTU", n => `I didn't have ${n.en}.`, n => n.my + " yoktu"],
      ["I HAVE", "M VAR, IM VAR", n => `I have ${n.en}.`, n => n.my + " var"],
      ["DO YOU HAVE", "N VAR MI?", n => `Do you have ${n.en}?`, n => sen(n) + " var mı?"],
      ["I DON'T HAVE", "M YOK, IM YOK", n => `I don't have ${n.en}.`, n => n.my + " yok"],
      ["I WILL HAVE", "M OLACAK", n => `I will have ${n.en}.`, n => n.my + " olacak"],
      ["WILL YOU HAVE", "N OLACAK MI?", n => `Will you have ${n.en}?`, n => sen(n) + " olacak mı?"],
      ["I WILL NOT HAVE", "M OLMAYACAK", n => `I will not have ${n.en}.`, n => n.my + " olmayacak"],
    ],
  },
  soru: {
    ad: "Soru", renk: "kirmizi2", cubuk: () => FIILLER,
    satirlar: [
      ["WHAT DO YOU", "NE · ERSİN?", v => `What do you ${v.en}?`, v => ne(v) + " " + aor2(v) + "?"],
      ["WHAT DID YOU", "NE · DİN?", v => `What did you ${v.en}?`, v => ne(v) + " " + gecmis(v) + "n?"],
      ["WHAT WILL YOU", "NE · ECEKSİN?", v => `What will you ${v.en}?`, v => ne(v) + " " + gel2(v) + "?"],
      ["WHEN DO YOU", "NE ZAMAN · ERSİN?", v => `When do you ${v.en}?`, v => "ne zaman " + aor2(v) + "?"],
      ["WHEN DID YOU", "NE ZAMAN · DİN?", v => `When did you ${v.en}?`, v => "ne zaman " + gecmis(v) + "n?"],
      ["WHEN WILL YOU", "NE ZAMAN · ECEKSİN?", v => `When will you ${v.en}?`, v => "ne zaman " + gel2(v) + "?"],
      ["WHERE DO YOU", "NEREYE · ERSİN?", v => `Where do you ${v.en}?`, v => nere(v) + " " + aor2(v) + "?"],
      ["WHERE DID YOU", "NEREYE · DİN?", v => `Where did you ${v.en}?`, v => nere(v) + " " + gecmis(v) + "n?"],
      ["WHERE WILL YOU", "NEREDE · ECEKSİN?", v => `Where will you ${v.en}?`, v => nere(v) + " " + gel2(v) + "?"],
      ["HOW DO YOU", "NASIL · ERSİN?", v => `How do you ${v.en}?`, v => "nasıl " + aor2(v) + "?"],
      ["HOW DID YOU", "NASIL · DİN?", v => `How did you ${v.en}?`, v => "nasıl " + gecmis(v) + "n?"],
      ["HOW WILL YOU", "NASIL · ECEKSİN?", v => `How will you ${v.en}?`, v => "nasıl " + gel2(v) + "?"],
      ["WHO DID", "KİM · Dİ?", v => `Who did ${v.en}?`, v => "kim " + gecmis(v) + "?"],
      ["WHO WILL", "KİM · ECEK?", v => `Who will ${v.en}?`, v => "kim " + gelecek(v) + "?"],
      ["WHY DID YOU", "NEDEN · DİN?", v => `Why did you ${v.en}?`, v => "neden " + gecmis(v) + "n?"],
      ["WHY DON'T YOU", "NEDEN · MİYORSUN?", v => `Why don't you ${v.en}?`, v => "neden " + olumsuzSurekli(v) + "sun?"],
      ["WHICH ONE DO YOU", "HANGİSİNİ · ERSİN?", v => `Which one do you ${v.en}?`, v => "hangisini " + aor2(v) + "?"],
    ],
  },
};
const sen = n => n.my.slice(0, -1) + "n";
const aor2 = v => v.aor + "s" + h4(v.aor) + "n";
const gel2 = v => { const f = gelecek(v); return f + "s" + h4(f) + "n"; };
const ne = v => (v.f.includes("d") ? "neye" : "ne");
const nere = v => (v.f.includes("r") ? "nereye" : "nerede");

const buyukHarf = s => s.charAt(0).toLocaleUpperCase("tr") + s.slice(1);
function cumle(plakaKey, satir, kelime) {
  const p = PLAKALAR[plakaKey], r = p.satirlar[satir];
  let tr = buyukHarf(r[3](kelime));
  if (!tr.endsWith("?")) tr += ".";
  return { en: r[2](kelime), tr };
}
// Bu çubuk bu satırda anlamlı bir cümle kurar mı?
function uygun(plakaKey, satir, w) {
  if (plakaKey !== "soru") return true;
  const bas = PLAKALAR.soru.satirlar[satir][0];
  if (bas.startsWith("WHAT")) return SORU_NE.has(w.en);
  if (bas.startsWith("WHICH")) return SORU_HANGI.has(w.en);
  if (bas.startsWith("WHERE")) return !SORU_NEREDE_YOK.has(w.en);
  return true;
}
const TUM_CUMLELER = [];
for (const [k, p] of Object.entries(PLAKALAR))
  p.satirlar.forEach((_, s) => p.cubuk().forEach((w, i) => { if (uygun(k, s, w)) TUM_CUMLELER.push({ k, s, w: i }); }));
const TOPLAM = TUM_CUMLELER.length;

// --- Kalıp ipuçları: her satır için tek cümlelik açıklama ---
const IPUCU = {
  fiil: [
    "Geniş zaman: alışkanlıklar ve genel doğrular. (-er, -ar)",
    "Şimdiki zaman: şu an yaptığın iş. I am + fiil-ing. (-yor)",
    "Şu an yapıp yapmadığını sorar. Are you + fiil-ing? (-yor musun?)",
    "Geçmiş zaman: did + fiilin yalın hali. İkinci hal gerekmez! (-dı, -di)",
    "Geçmişte yapıp yapmadığını sorar. Did you + yalın fiil? (-dın mı?)",
    "Yapabilme, beceri ya da izin. Can'den sonra fiil hep yalın. (-ebilir)",
    "Rica ya da yetenek sorusu. Can you...? (-ebilir misin?)",
    "Gelecek zaman: karar ve niyet. Will + yalın fiil. (-ecek, -acak)",
    "Gelecekte yapıp yapmayacağını sorar. Will you...? (-ecek misin?)",
    "Tavsiye: yapsan iyi olur. Should + yalın fiil. (-meli)",
    "Tavsiye isteme: yapmalı mıyım? Should I...? (-meli miyim?)",
    "Zorunluluk: başka seçeneğin yok. Have to + yalın fiil. (-mek zorunda)",
    "İstek: yapmak istediğin şey. Want to + yalın fiil. (-mek istiyorum)",
    "Teklif ya da davet: yapmak ister misin? (-mek istiyor musun?)",
    "İhtiyaç: yapman gerekiyor. Need to + yalın fiil. (-mem lazım)",
    "İzin isteyerek teklif: bırak ben yapayım. Let me + yalın fiil. (-eyim)",
    "Birlikte yapmayı önerme. Let's = Let us. (-elim)",
    "Olumsuz emir: yapma! Don't + yalın fiil. (-me, -ma)",
  ],
  sifat: [
    "Geçmişte bir şeyin durumu. It was + sıfat. (-dı)",
    "Geçmişteki durumu sorar. Was it...? (mıydı?)",
    "Geçmişte öyle değildi. It was not = It wasn't. (değildi)",
    "Şimdiki durum. It is = It's. (-dır, ya da eksiz)",
    "Şimdiki durumu sorar. Is it...? (mı?)",
    "Şu an öyle değil. It is not = It isn't. (değil)",
    "Gelecekteki durum. It will be + sıfat. (olacak)",
    "Gelecekteki durumu sorar. Will it be...? (olacak mı?)",
    "Gelecekte öyle olmayacak. It will not = It won't. (olmayacak)",
    "Olasılık: öyle olabilir. (olabilir)",
    "Olasılığı sorar. Can it be...? (olabilir mi?)",
    "İmkânsızlık: öyle olamaz. Cannot = Can't. (olamaz)",
    "Beklenti ya da gereklilik: öyle olmalı. (olmalı)",
    "Beklentiyi sorar. Should it be...? (olmalı mı?)",
    "Öyle olmaması gerekir. Shouldn't = should not. (olmamalı)",
    "Geçmişte bir olasılık ya da tahmin: olabilirdi. (olabilirdi)",
    "Geçmişteki olasılığı sorar. Could it be...? (olabilir miydi?)",
    "Geçmişte imkânsızdı. Could not = Couldn't. (olamazdı)",
  ],
  isim: [
    "Geçmişte bir yerde bir şeyin varlığı. There was + isim. (vardı)",
    "Geçmişte var mıydı diye sorar. Was there...? (var mıydı?)",
    "Geçmişte yoktu. There was not = There wasn't. (yoktu)",
    "Şu an bir şeyin varlığı. There is = There's. (var)",
    "Var mı diye sorar. Is there...? (var mı?)",
    "Şu an yok. There is not = There isn't. (yok)",
    "Gelecekte olacak. There will be + isim. (olacak)",
    "Gelecekte olacak mı diye sorar. Will there be...? (olacak mı?)",
    "Gelecekte olmayacak. There won't be. (olmayacak)",
    "Sahiplik, geçmiş: benim vardı. I had + isim. (-im vardı)",
    "Senin var mıydı diye sorar. Did you have...? (-in var mıydı?)",
    "Benim yoktu. I didn't have + isim. (-im yoktu)",
    "Sahiplik, şimdi: benim var. I have + isim. (-im var)",
    "Senin var mı diye sorar. Do you have...? (-in var mı?)",
    "Benim yok. I don't have + isim. (-im yok)",
    "Gelecekte benim olacak. I will have + isim. (-im olacak)",
    "Senin olacak mı diye sorar. Will you have...? (-in olacak mı?)",
    "Gelecekte benim olmayacak. I will not have + isim. (-im olmayacak)",
  ],
  soru: [
    "What = ne. Genel alışkanlığı sorar: ne yaparsın? (-ersin)",
    "What = ne. Geçmişi sorar: ne yaptın? (-dın)",
    "What = ne. Geleceği sorar: ne yapacaksın? (-eceksin)",
    "When = ne zaman. Alışkanlığın zamanını sorar. (-ersin)",
    "When = ne zaman. Geçmişte ne zaman yaptığını sorar. (-dın)",
    "When = ne zaman. Gelecekte ne zaman yapacağını sorar. (-eceksin)",
    "Where = nerede / nereye. Alışkanlığın yerini sorar. (-ersin)",
    "Where = nerede / nereye. Geçmişte nerede yaptığını sorar. (-dın)",
    "Where = nerede / nereye. Gelecekte nerede yapacağını sorar. (-eceksin)",
    "How = nasıl. Bir şeyi nasıl yaptığını sorar. (-ersin)",
    "How = nasıl. Geçmişte nasıl yaptığını sorar. (-dın)",
    "How = nasıl. Gelecekte nasıl yapacağını sorar. (-eceksin)",
    "Who = kim. Geçmişte kimin yaptığını sorar. (-dı)",
    "Who = kim. Gelecekte kimin yapacağını sorar. (-ecek)",
    "Why = neden. Geçmişte neden yaptığını sorar. (-dın)",
    "Why don't you = neden yapmıyorsun? Öneri olarak da kullanılır. (-miyorsun)",
    "Which one = hangisi. Seçenekler arasından seçimi sorar. (-ersin)",
  ],
};
