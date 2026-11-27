// Yazarak cevap: bir Türkçe cümleye karşılık kabul edilen TÜM İngilizce çeviriler.
// Kısaltmalar (I'm, don't, won't...) karşılaştırmadan önce açılır, bu yüzden burada sadece açık hâller yazılır.

// Fiillerin 2. hali (geçmiş zaman). "I went" = "I did go" ikisi de doğru.
const V2_DUZENSIZ = {
  go:"went", come:"came", eat:"ate", drink:"drank", sleep:"slept", read:"read", write:"wrote", see:"saw",
  swim:"swam", buy:"bought", sell:"sold", pay:"paid", send:"sent", bring:"brought", take:"took", give:"gave",
  find:"found", lose:"lost", teach:"taught", understand:"understood", know:"knew", think:"thought", forget:"forgot",
  sit:"sat", wear:"wore", sing:"sang", run:"ran", drive:"drove", fly:"flew", fall:"fell", throw:"threw",
  catch:"caught", hold:"held", cut:"cut", break:"broke", build:"built", draw:"drew", meet:"met", choose:"chose",
  leave:"left", win:"won", hear:"heard", feel:"felt", tell:"told", say:"said", stop:"stopped", plan:"planned",
  learn:"learned", dream:"dreamed", travel:"traveled",
};
const V2_EK = { learn:["learnt"], dream:["dreamt"], travel:["travelled"] };
function v2(en){
  if (V2_DUZENSIZ[en]) return V2_DUZENSIZ[en];
  if (/[^aeiou]y$/.test(en)) return en.slice(0, -1) + "ied";
  if (en.endsWith("e")) return en + "d";
  return en + "ed";
}
const v2Hepsi = en => [v2(en), ...(V2_EK[en] || [])];

// Karşılaştırma için metni sadeleştir: küçük harf, noktalama yok, kısaltmalar açık.
const KISALTMA = [
  [/\bwon't\b/g, "will not"], [/\bcan't\b/g, "can not"], [/\bcannot\b/g, "can not"], [/\bshan't\b/g, "shall not"],
  [/\blet's\b/g, "let us"], [/\bwanna\b/g, "want to"], [/\bgonna\b/g, "going to"], [/\bgotta\b/g, "got to"],
  [/\bi'm\b/g, "i am"], [/\byou're\b/g, "you are"], [/\bit's\b/g, "it is"], [/\bthere's\b/g, "there is"],
  [/\bi've\b/g, "i have"], [/\bi'll\b/g, "i will"], [/\byou'll\b/g, "you will"], [/\bit'll\b/g, "it will"], [/\bthere'll\b/g, "there will"],
  [/\bi'd\b/g, "i would"], [/\byou'd\b/g, "you would"],
  [/\b(\w+)n't\b/g, "$1 not"],
  // kesme işaretsiz yazılanlar: dont, cant, im, lets...
  [/\b(do|does|did|is|was|are|were|have|has|should|could|would|must)nt\b/g, "$1 not"], [/\bcant\b/g, "can not"], [/\bwont\b/g, "will not"],
  [/\bim\b/g, "i am"], [/\bive\b/g, "i have"], [/\bits\b/g, "it is"], [/\btheres\b/g, "there is"], [/\blets\b/g, "let us"],
];
function sadelestir(s){
  // Türkçe klavye: İ, ı, I hepsi "i" sayılır (yazım hatası değil)
  s = String(s || "").replace(/[İIı]/g, "i").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[’‘`´]/g, "'");
  for (const [r, y] of KISALTMA) s = s.replace(r, y);
  s = s.replace(/[^a-z' ]+/g, " ").replace(/'/g, "");
  s = s.replace(/\b(a|an)\b/g, " "); // a / an yazılmasa da olur
  return s.replace(/\s+/g, " ").trim();
}

// Satır başına kabul edilen kalıplar. Her fonksiyon açık hâlde cümleler döndürür.
const KABUL = {
  fiil: [
    v => [`I ${v.en}`],
    v => [`I am ${ing(v.en)}`],
    v => [`Are you ${ing(v.en)}`],
    v => [`I did ${v.en}`, ...v2Hepsi(v.en).map(x => `I ${x}`)],
    v => [`Did you ${v.en}`],
    v => [`I can ${v.en}`, `I am able to ${v.en}`],
    v => [`Can you ${v.en}`, `Could you ${v.en}`],
    v => [`I will ${v.en}`, `I am going to ${v.en}`, `I shall ${v.en}`],
    v => [`Will you ${v.en}`, `Are you going to ${v.en}`],
    v => [`I should ${v.en}`, `I ought to ${v.en}`],
    v => [`Should I ${v.en}`, `Shall I ${v.en}`],
    v => [`I have to ${v.en}`, `I must ${v.en}`, `I have got to ${v.en}`],
    v => [`I want to ${v.en}`, `I would like to ${v.en}`],
    v => [`Do you want to ${v.en}`, `Would you like to ${v.en}`],
    v => [`I need to ${v.en}`, `I have to ${v.en}`, `I must ${v.en}`],
    v => [`Let me ${v.en}`],
    v => [`Let us ${v.en}`],
    v => [`Do not ${v.en}`],
  ],
  sifat: [
    a => [`It was ${a.en}`],
    a => [`Was it ${a.en}`],
    a => [`It was not ${a.en}`],
    a => [`It is ${a.en}`],
    a => [`Is it ${a.en}`],
    a => [`It is not ${a.en}`],
    a => [`It will be ${a.en}`, `It is going to be ${a.en}`],
    a => [`Will it be ${a.en}`, `Is it going to be ${a.en}`],
    a => [`It will not be ${a.en}`, `It is not going to be ${a.en}`],
    a => [`It can be ${a.en}`, `It may be ${a.en}`, `It might be ${a.en}`, `It could be ${a.en}`],
    a => [`Can it be ${a.en}`, `Could it be ${a.en}`],
    a => [`It can not be ${a.en}`],
    a => [`It should be ${a.en}`, `It must be ${a.en}`, `It ought to be ${a.en}`],
    a => [`Should it be ${a.en}`],
    a => [`It should not be ${a.en}`, `It must not be ${a.en}`],
    a => [`It could be ${a.en}`, `It could have been ${a.en}`, `It might have been ${a.en}`],
    a => [`Could it be ${a.en}`, `Could it have been ${a.en}`],
    a => [`It could not be ${a.en}`, `It could not have been ${a.en}`],
  ],
  isim: [
    n => [`There was ${n.en}`],
    n => [`Was there ${n.en}`],
    n => [`There was not ${n.en}`, `There was no ${yalin(n)}`],
    n => [`There is ${n.en}`],
    n => [`Is there ${n.en}`],
    n => [`There is not ${n.en}`, `There is no ${yalin(n)}`],
    n => [`There will be ${n.en}`, `There is going to be ${n.en}`],
    n => [`Will there be ${n.en}`, `Is there going to be ${n.en}`],
    n => [`There will not be ${n.en}`, `There will be no ${yalin(n)}`, `There is not going to be ${n.en}`],
    n => [`I had ${n.en}`],
    n => [`Did you have ${n.en}`],
    n => [`I did not have ${n.en}`, `I had no ${yalin(n)}`],
    n => [`I have ${n.en}`, `I have got ${n.en}`],
    n => [`Do you have ${n.en}`, `Have you got ${n.en}`],
    n => [`I do not have ${n.en}`, `I have not got ${n.en}`, `I have no ${yalin(n)}`],
    n => [`I will have ${n.en}`, `I am going to have ${n.en}`],
    n => [`Will you have ${n.en}`, `Are you going to have ${n.en}`],
    n => [`I will not have ${n.en}`, `I am not going to have ${n.en}`],
  ],
  soru: [
    v => [`What do you ${v.en}`],
    v => [`What did you ${v.en}`],
    v => [`What will you ${v.en}`, `What are you going to ${v.en}`],
    v => [`When do you ${v.en}`],
    v => [`When did you ${v.en}`],
    v => [`When will you ${v.en}`, `When are you going to ${v.en}`],
    v => [`Where do you ${v.en}`],
    v => [`Where did you ${v.en}`],
    v => [`Where will you ${v.en}`, `Where are you going to ${v.en}`],
    v => [`How do you ${v.en}`],
    v => [`How did you ${v.en}`],
    v => [`How will you ${v.en}`, `How are you going to ${v.en}`],
    v => [`Who did ${v.en}`, ...v2Hepsi(v.en).map(x => `Who ${x}`)],
    v => [`Who will ${v.en}`, `Who is going to ${v.en}`],
    v => [`Why did you ${v.en}`],
    v => [`Why do not you ${v.en}`, `Why do you not ${v.en}`, `Why are you not ${ing(v.en)}`],
    v => [`Which one do you ${v.en}`, `Which do you ${v.en}`],
  ],
};
// "a car" → "car" (There is no car / I have no car için)
const yalin = n => n.en.replace(/^(a|an) /, "");

// Bir cümle için kabul edilen tüm cevaplar (ekranda gösterilecek doğal hâlleriyle)
function kabulListesi(a){
  const w = PLAKALAR[a.k].cubuk()[a.w];
  const ana = cumle(a.k, a.s, w).en.replace(/[.?]$/, "");
  const liste = [ana, ...KABUL[a.k][a.s](w)];
  const gorulen = new Set(), sonuc = [];
  for (const c of liste) { const s = sadelestir(c); if (!gorulen.has(s)) { gorulen.add(s); sonuc.push(c); } }
  return sonuc;
}

// İki metin arasındaki harf farkı (yazım hatası toleransı için)
function harfFarki(a, b){
  if (Math.abs(a.length - b.length) > 2) return 9;
  let onceki = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const simdi = [i];
    for (let j = 1; j <= b.length; j++) simdi[j] = Math.min(onceki[j] + 1, simdi[j - 1] + 1, onceki[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    onceki = simdi;
  }
  return onceki[b.length];
}

// Sonuç: { durum: "dogru" | "yazim" | "yanlis", eslesen, liste }
function cevapKontrol(a, yazilan){
  const liste = kabulListesi(a), y = sadelestir(yazilan);
  for (const c of liste) if (sadelestir(c) === y) return { durum: "dogru", eslesen: c, liste };
  // tek harflik yazım hatası (kelime yapısı aynı kalmak şartıyla) doğru sayılır ama gösterilir
  for (const c of liste) {
    const s = sadelestir(c);
    if (s.length >= 8 && s.split(" ").length === y.split(" ").length && harfFarki(s, y) === 1) return { durum: "yazim", eslesen: c, liste };
  }
  return { durum: "yanlis", eslesen: null, liste };
}
