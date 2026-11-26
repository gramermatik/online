// Erişim kodu yazım yardımcısı. Doğrulama sunucuda (Supabase kod_kullan) yapılır.
function kodTemizle(girdi) {
  let k = String(girdi || "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (k.startsWith("GM")) k = k.slice(2);
  return k;
}
