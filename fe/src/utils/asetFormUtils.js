// ─── Shared form utilities ────────────────────────────────────────
// Dipakai oleh semua StepAset component

export const RULES = {
  nama_aset: { minLength: 3, maxLength: 100 },
  alamat_lengkap: { minLength: 10, maxLength: 300 },
  kecamatan: { minLength: 3, maxLength: 80 },
  nama_pic: {
    minLength: 3, maxLength: 80,
    pattern: /^[a-zA-ZÀ-ÖØ-öø-ÿ\s'.,-]+$/,
    patternMsg: "Nama hanya boleh berisi huruf.",
  },
  no_whatsapp_pic: {
    pattern: /^(\+62|62|0)8[1-9][0-9]{6,11}$/,
    patternMsg: "Format: 08xxxxxxxxxx atau +628xxxxxxxxxx",
  },
  foto: {
    maxSizeMB: 5,
    maxFiles: 5,
    allowedTypes: ["image/jpeg", "image/png", "image/webp"],
    allowedExt: ["JPG", "PNG", "WEBP"],
  },
};

export const validate = (name, value) => {
  if (!value || (typeof value === "string" && !value.trim())) return "Wajib diisi.";
  const r = RULES[name];
  if (!r) return null;
  if (r.minLength && value.trim().length < r.minLength) return `Minimal ${r.minLength} karakter.`;
  if (r.maxLength && value.trim().length > r.maxLength) return `Maksimal ${r.maxLength} karakter.`;
  if (name === "no_whatsapp_pic") {
    const cleaned = value.replace(/[\s\-()]/g, "");
    if (!/^[\d+]+$/.test(cleaned)) return "Hanya boleh angka dan tanda +.";
    if (r.pattern && !r.pattern.test(cleaned)) return r.patternMsg;
    return null;
  }
  if (r.pattern && !r.pattern.test(value.trim())) return r.patternMsg;
  return null;
};

export const inputClass = (touched, error) => {
  const base = "w-full rounded border px-4 py-2.5 text-sm focus:outline-none transition-colors";
  if (!touched) return `${base} border-gray-300 focus:border-[#1e1f78]`;
  if (error)    return `${base} border-red-400 bg-red-50 focus:border-red-500`;
  return          `${base} border-green-400 bg-green-50 focus:border-green-500`;
};

export const ErrorMsg = ({ msg }) => msg ? (
  <p className="mt-1 flex items-center gap-1 text-[12px] text-red-500">
    <svg className="size-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
    </svg>
    {msg}
  </p>
) : null;

export const CharCount = ({ current, max, min }) => {
  const remaining  = max - current;
  const isBelowMin = current < min;
  const isWarning  = !isBelowMin && remaining <= 20;
  return (
    <p className={`mt-1 text-right text-[11px] ${isWarning ? "text-orange-500" : "text-gray-400"}`}>
      {isBelowMin ? `Minimal ${min - current} karakter lagi` : `${remaining} karakter tersisa`}
    </p>
  );
};