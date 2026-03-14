/**
 * utils/artikel.utils.js
 * Fungsi-fungsi helper untuk UserArtikelPage
 */

export const fmtDate = (iso) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };
  
  /** Strip tag HTML dan potong teks */
  export const stripHtml = (str) =>
    str ? str.replace(/<[^>]+>/g, "").slice(0, 100) + "…" : "";
  
  /** Bangun array nomor halaman dengan ellipsis */
  export const buildPages = (cur, total) => {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const p = [1];
    if (cur > 3) p.push("…");
    for (let i = Math.max(2, cur - 1); i <= Math.min(total - 1, cur + 1); i++) p.push(i);
    if (cur < total - 2) p.push("…");
    p.push(total);
    return p;
  };