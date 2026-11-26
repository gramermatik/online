// Gramermatik kelime çubukları
// Fiil: [ingilizce, türkçe kök, geniş zaman, yumuşamış kök (gerekirse), bayrak]
// bayrak: d = "neye" (yönelme: look at, help...), r = "nereye" (hareket: go, come...)
const FIILLER = [
  ["talk","konuş","konuşur"],["go","git","gider","gid","r"],["come","gel","gelir","","r"],["eat","ye","yer"],
  ["drink","iç","içer"],["sleep","uyu","uyur"],["read","oku","okur"],["write","yaz","yazar"],
  ["listen","dinle","dinler","","d"],["look","bak","bakar","","d"],["see","gör","görür"],["watch","izle","izler"],
  ["work","çalış","çalışır"],["study","ders çalış","ders çalışır"],["play","oyna","oynar"],["run","koş","koşar","","r"],
  ["walk","yürü","yürür","","r"],["swim","yüz","yüzer"],["cook","yemek yap","yemek yapar"],["buy","satın al","satın alır"],
  ["sell","sat","satar"],["pay","öde","öder"],["open","aç","açar"],["close","kapat","kapatır"],
  ["wait","bekle","bekler"],["help","yardım et","yardım eder","yardım ed","d"],["ask","sor","sorar"],["answer","cevap ver","cevap verir"],
  ["call","ara","arar"],["send","gönder","gönderir","","r"],["bring","getir","getirir"],["take","al","alır"],
  ["give","ver","verir"],["find","bul","bulur"],["lose","kaybet","kaybeder","kaybed"],["learn","öğren","öğrenir"],
  ["teach","öğret","öğretir"],["understand","anla","anlar"],["know","bil","bilir"],["think","düşün","düşünür"],
  ["remember","hatırla","hatırlar"],["forget","unut","unutur"],["try","dene","dener"],["start","başla","başlar","","d"],
  ["finish","bitir","bitirir"],["stop","dur","durur"],["sit","otur","oturur"],["wear","giy","giyer"],
  ["sing","şarkı söyle","şarkı söyler"],["dance","dans et","dans eder","dans ed"],["laugh","gül","güler","","d"],["cry","ağla","ağlar"],
  ["smile","gülümse","gülümser","","d"],["live","yaşa","yaşar"],["love","sev","sever"],["like","beğen","beğenir"],
  ["hate","nefret et","nefret eder","nefret ed"],["travel","seyahat et","seyahat eder","seyahat ed","r"],["drive","araba sür","araba sürer","","r"],["fly","uç","uçar","","r"],
  ["climb","tırman","tırmanır","","r"],["jump","zıpla","zıplar"],["fall","düş","düşer","","r"],["throw","at","atar"],
  ["catch","yakala","yakalar"],["hold","tut","tutar"],["carry","taşı","taşır","","r"],["clean","temizle","temizler"],
  ["wash","yıka","yıkar"],["cut","kes","keser"],["break","kır","kırar"],["fix","tamir et","tamir eder","tamir ed"],
  ["build","inşa et","inşa eder","inşa ed"],["draw","çiz","çizer"],["paint","boya","boyar"],["visit","ziyaret et","ziyaret eder","ziyaret ed"],
  ["meet","buluş","buluşur"],["choose","seç","seçer"],["change","değiştir","değiştirir"],["use","kullan","kullanır"],
  ["move","taşın","taşınır","","r"],["return","dön","döner","","r"],["leave","ayrıl","ayrılır"],["arrive","var","varır","","r"],
  ["stay","kal","kalır"],["rest","dinlen","dinlenir"],["win","kazan","kazanır"],["believe","inan","inanır","","d"],
  ["hear","duy","duyar"],["feel","hisset","hisseder","hissed"],["tell","anlat","anlatır"],["say","söyle","söyler"],
  ["show","göster","gösterir"],["explain","açıkla","açıklar"],["plan","planla","planlar"],["order","sipariş ver","sipariş verir"],
  ["shout","bağır","bağırır","","d"],["dream","hayal et","hayal eder","hayal ed"],["save","biriktir","biriktirir"],["share","paylaş","paylaşır"],
].map(([en,tr,aor,soft,f])=>({en,tr,aor,soft:soft||tr,f:f||""}));

const SIFATLAR = [
  ["big","büyük"],["small","küçük"],["good","iyi"],["bad","kötü"],["beautiful","güzel"],
  ["ugly","çirkin"],["new","yeni"],["old","eski"],["hot","sıcak"],["cold","soğuk"],
  ["easy","kolay"],["difficult","zor"],["cheap","ucuz"],["expensive","pahalı"],["fast","hızlı"],
  ["slow","yavaş"],["long","uzun"],["short","kısa"],["high","yüksek"],["clean","temiz"],
  ["dirty","kirli"],["full","dolu"],["empty","boş"],["heavy","ağır"],["light","hafif"],
  ["strong","güçlü"],["weak","zayıf"],["important","önemli"],["interesting","ilginç"],["boring","sıkıcı"],
  ["funny","komik"],["dangerous","tehlikeli"],["safe","güvenli"],["true","doğru"],["wrong","yanlış"],
  ["possible","mümkün"],["ready","hazır"],["open","açık"],["closed","kapalı"],["quiet","sessiz"],
  ["loud","gürültülü"],["dark","karanlık"],["delicious","lezzetli"],["fresh","taze"],["sweet","tatlı"],
  ["free","ücretsiz"],["wet","ıslak"],["soft","yumuşak"],["perfect","mükemmel"],["strange","garip"],
].map(([en,tr])=>({en,tr}));

// İsim: [ingilizce (artikelli), türkçe, "benim" hali]
const ISIMLER = [
  ["money","para","param"],["time","zaman","zamanım"],["a car","araba","arabam"],["a house","ev","evim"],["a book","kitap","kitabım"],
  ["a phone","telefon","telefonum"],["a computer","bilgisayar","bilgisayarım"],["a job","iş","işim"],["a friend","arkadaş","arkadaşım"],["a dog","köpek","köpeğim"],
  ["a cat","kedi","kedim"],["a problem","sorun","sorunum"],["a question","soru","sorum"],["an idea","fikir","fikrim"],["a plan","plan","planım"],
  ["water","su","suyum"],["food","yemek","yemeğim"],["coffee","kahve","kahvem"],["tea","çay","çayım"],["bread","ekmek","ekmeğim"],
  ["milk","süt","sütüm"],["a ticket","bilet","biletim"],["a key","anahtar","anahtarım"],["a bag","çanta","çantam"],["a bike","bisiklet","bisikletim"],
  ["a garden","bahçe","bahçem"],["a room","oda","odam"],["a bed","yatak","yatağım"],["a table","masa","masam"],["a chair","sandalye","sandalyem"],
  ["a pen","kalem","kalemim"],["homework","ödev","ödevim"],["a meeting","toplantı","toplantım"],["a party","parti","partim"],["a gift","hediye","hediyem"],
  ["a camera","kamera","kameram"],["a passport","pasaport","pasaportum"],["an umbrella","şemsiye","şemsiyem"],["a brother","erkek kardeş","erkek kardeşim"],["a sister","kız kardeş","kız kardeşim"],
  ["a teacher","öğretmen","öğretmenim"],["a hobby","hobi","hobim"],["a dream","hayal","hayalim"],["a secret","sır","sırrım"],["a chance","şans","şansım"],
  ["energy","enerji","enerjim"],["a pet","evcil hayvan","evcil hayvanım"],["a watch","saat","saatim"],["a map","harita","haritam"],["a holiday","tatil","tatilim"],
].map(([en,tr,my])=>({en,tr,my}));

// Soru plakası uyumu: anlamsız cümleler çıkmasın diye
// "What ...?" sorulabilen fiiller (nesne alanlar)
const SORU_NE = new Set(["eat","drink","read","write","see","watch","buy","sell","open","ask","send","bring","take","give","find","lose","learn","teach","understand","know","think","remember","forget","try","play","wear","love","like","throw","carry","clean","wash","cut","break","fix","build","draw","paint","choose","change","use","win","hear","feel","tell","say","show","explain","plan","order","save","share","dream","believe"]);
// "Which one ...?" sorulabilen fiiller (seçim yapılabilenler)
const SORU_HANGI = new Set(["eat","drink","read","watch","buy","sell","take","give","bring","choose","like","love","wear","use","order","play","try","learn"]);
// "Where ...?" ile anlamsız olan fiiller (zihinsel / yersiz)
const SORU_NEREDE_YOK = new Set(["know","understand","think","remember","forget","believe","love","like","hate","feel","dream","say","tell","answer","explain","plan","change"]);
