import React, { useState } from "react";

// ─── Aturan Validasi ───────────────────────────────────────────────
const RULES = {
  nama_pic: {
    minLength: 3,
    maxLength: 80,
    // Hanya huruf, spasi, titik, koma — tidak boleh angka/simbol lain
    pattern: /^[a-zA-ZÀ-ÖØ-öø-ÿ\s'.,-]+$/,
    patternMsg: "Nama hanya boleh berisi huruf, spasi, dan tanda baca dasar.",
  },
  no_whatsapp: {
    // Boleh diawali +62 atau 08, lanjut 8–13 digit
    pattern: /^(\+62|62|0)8[1-9][0-9]{6,11}$/,
    patternMsg: "Format nomor tidak valid. Cth: 08123456789 atau +628123456789",
    minDigits: 9,
    maxDigits: 15,
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
    patternMsg: "Format email tidak valid. Cth: nama@domain.com",
  },
};

const validate = (name, value) => {
  if (!value || !value.trim()) return "Wajib diisi.";
  const r = RULES[name];
  if (!r) return null;

  if (name === "no_whatsapp") {
    // Hanya izinkan: angka, +, spasi, strip (untuk keperluan copy-paste)
    const cleaned = value.replace(/[\s\-()]/g, "");
    if (!/^[\d+]+$/.test(cleaned))
      return "Nomor hanya boleh berisi angka dan tanda +.";
    if (r.pattern && !r.pattern.test(cleaned)) return r.patternMsg;
    return null;
  }

  if (r.minLength && value.trim().length < r.minLength)
    return `Minimal ${r.minLength} karakter.`;
  if (r.maxLength && value.trim().length > r.maxLength)
    return `Maksimal ${r.maxLength} karakter.`;
  if (r.pattern && !r.pattern.test(value.trim())) return r.patternMsg;
  return null;
};

const inputClass = (touched, error) => {
  const base =
    "w-full rounded border px-4 py-2.5 text-sm focus:outline-none transition-colors";
  if (!touched) return `${base} border-gray-300 focus:border-[#1e1f78]`;
  if (error) return `${base} border-red-400 bg-red-50 focus:border-red-500`;
  return `${base} border-green-400 bg-green-50 focus:border-green-500`;
};

const ErrorMsg = ({ msg }) =>
  msg ? (
    <p className="mt-1 flex items-center gap-1 text-[12px] text-red-500">
      <svg className="size-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
      {msg}
    </p>
  ) : null;

const SuccessIcon = () => (
  <svg
    className="absolute top-1/2 right-3 size-4 -translate-y-1/2 text-green-500"
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
      clipRule="evenodd"
    />
  </svg>
);

// ══════════════════════════════════════════════════════════════════
const StepKontakVerifikasi = ({ formData, handleChange }) => {
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [showWa, setShowWa] = useState(false);

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
  };

  // ── Khusus nomor WA: blokir input non-angka kecuali + di awal ──
  const handleWaKeyDown = (e) => {
    const allowedKeys = [
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "Tab",
      "Home",
      "End",
    ];
    const isDigit = /^[0-9]$/.test(e.key);
    const isPlus = e.key === "+" && e.target.selectionStart === 0;
    const isModifier = e.ctrlKey || e.metaKey; // izinkan Ctrl+C, Ctrl+V, dll.

    if (!isDigit && !isPlus && !allowedKeys.includes(e.key) && !isModifier) {
      e.preventDefault();
    }
  };

  const handleLocalChange = (e) => {
    const { name, value } = e.target;

    // Nama: blokir angka
    if (name === "nama_pic") {
      if (/[0-9]/.test(e.nativeEvent.data)) return; // tolak ketikan angka
    }

    // WA: tolak karakter non-angka & non-+ saat mengetik
    if (name === "no_whatsapp") {
      const cleaned = value.replace(/[^\d+\s\-()]/g, "");
      handleChange({ target: { name, value: cleaned } });
      if (touched[name])
        setErrors((prev) => ({ ...prev, [name]: validate(name, cleaned) }));
      return;
    }

    handleChange(e);
    if (touched[name])
      setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
  };

  const isValid = (name) => touched[name] && !errors[name] && formData[name];

  return (
    <div className="animate-in fade-in space-y-6 duration-300">
      <h2 className="mb-8 text-[22px] font-bold text-gray-900">
        Kontak & Verifikasi
      </h2>

      {/* Nama PIC */}
      <div>
        <label className="mb-2 block text-[13px] font-bold text-gray-800">
          Nama Penanggung Jawab?
        </label>
        <div className="relative">
          <input
            type="text"
            name="nama_pic"
            value={formData.nama_pic}
            onChange={handleLocalChange}
            onBlur={handleBlur}
            placeholder="Cth: Yenny Kalangi"
            maxLength={RULES.nama_pic.maxLength}
            className={`${inputClass(touched.nama_pic, errors.nama_pic)} pr-8`}
          />
          {isValid("nama_pic") && <SuccessIcon />}
        </div>
        <ErrorMsg msg={touched.nama_pic ? errors.nama_pic : null} />
        {!errors.nama_pic && (
          <p className="mt-1 text-[11px] text-gray-400">
            Hanya boleh berisi huruf — tidak boleh ada angka.
          </p>
        )}
      </div>

      {/* No. WhatsApp */}
      <div>
        <label className="mb-2 block text-[13px] font-bold text-gray-800">
          Nomor WhatsApp?
        </label>
        <div className="relative">
          <input
            type="tel"
            name="no_whatsapp"
            value={formData.no_whatsapp}
            onChange={handleLocalChange}
            onBlur={handleBlur}
            onKeyDown={handleWaKeyDown}
            placeholder="Cth: 08123456789"
            maxLength={16}
            inputMode="numeric"
            className={`${inputClass(touched.no_whatsapp, errors.no_whatsapp)} pr-8`}
          />
          {isValid("no_whatsapp") && <SuccessIcon />}
        </div>
        <ErrorMsg msg={touched.no_whatsapp ? errors.no_whatsapp : null} />
        {!errors.no_whatsapp && (
          <p className="mt-1 text-[11px] text-gray-400">
            Format: 08xxxxxxxxxx atau +628xxxxxxxxxx · Hanya angka yang
            diizinkan.
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="mb-2 block text-[13px] font-bold text-gray-800">
          Email?
        </label>
        <div className="relative">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleLocalChange}
            onBlur={handleBlur}
            placeholder="example@email.com"
            className={`${inputClass(touched.email, errors.email)} pr-8`}
          />
          {isValid("email") && <SuccessIcon />}
        </div>
        <ErrorMsg msg={touched.email ? errors.email : null} />
        {!errors.email && (
          <p className="mt-1 text-[11px] text-gray-400">
            Pastikan email aktif — digunakan untuk notifikasi verifikasi.
          </p>
        )}
      </div>

      {/* Info box verifikasi */}
      <div className="rounded-lg border border-blue-100 bg-blue-50/60 px-4 py-3">
        <p className="text-[12px] leading-relaxed text-gray-600">
          <span className="font-bold text-[#1e1f78]">
            ℹ️ Proses Verifikasi:
          </span>{" "}
          Data kontak yang Anda masukkan akan digunakan admin untuk
          memverifikasi pendaftaran. Pastikan nomor WA dan email aktif dan dapat
          dihubungi.
        </p>
      </div>
    </div>
  );
};

export default StepKontakVerifikasi;
