import React, { useState } from "react";

const RULES = {
  penanggung_jawab: {
    minLength: 3,
    maxLength: 80,
    pattern: /^[a-zA-ZÀ-ÖØ-öø-ÿ\s'.,-]+$/,
    patternMsg: "Nama hanya boleh berisi huruf.",
  },
  kontak: {
    pattern: /^(\+62|62|0)8[1-9][0-9]{6,11}$/,
    patternMsg: "Format tidak valid. Cth: 08123456789",
  },
};

const validate = (name, value) => {
  if (!value?.trim()) return "Wajib diisi.";
  const r = RULES[name];

  if (name === "kontak") {
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

const StepKontakFasilitas = ({ formData, handleChange }) => {
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((p) => ({ ...p, [name]: true }));
    setErrors((p) => ({ ...p, [name]: validate(name, value) }));
  };

  const handleWaKeyDown = (e) => {
    const allowed = [
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
    if (
      !isDigit &&
      !isPlus &&
      !allowed.includes(e.key) &&
      !e.ctrlKey &&
      !e.metaKey
    )
      e.preventDefault();
  };

  const handleLocal = (e) => {
    const { name, value } = e.target;
    if (name === "penanggung_jawab" && /[0-9]/.test(e.nativeEvent?.data))
      return;
    if (name === "kontak") {
      const cleaned = value.replace(/[^\d+\s\-()]/g, "");
      handleChange({ target: { name, value: cleaned } });
      if (touched[name])
        setErrors((prev) => ({ ...prev, [name]: validate(name, cleaned) }));
      return;
    }
    handleChange(e);
    if (touched[name])
      setErrors((p) => ({ ...p, [name]: validate(name, value) }));
  };

  const isValid = (name) => touched[name] && !errors[name] && formData[name];

  return (
    <div className="animate-in fade-in space-y-6 duration-300">
      <h2 className="mb-6 text-[22px] font-bold text-gray-900">
        Kontak Fasilitas
      </h2>

      {/* Nama PIC */}
      <div>
        <label className="mb-2 block text-[13px] font-bold text-gray-800">
          Nama Penanggung Jawab
        </label>
        <div className="relative">
          <input
            type="text"
            name="penanggung_jawab"
            value={formData.penanggung_jawab}
            onChange={handleLocal}
            onBlur={handleBlur}
            placeholder="Cth: Ricky Watuseke"
            maxLength={RULES.penanggung_jawab.maxLength}
            className={`${inputClass(touched.penanggung_jawab, errors.penanggung_jawab)} pr-8`}
          />
          {isValid("penanggung_jawab") && <SuccessIcon />}
        </div>
        <ErrorMsg
          msg={touched.penanggung_jawab ? errors.penanggung_jawab : null}
        />
        {!errors.penanggung_jawab && (
          <p className="mt-1 text-[11px] text-gray-400">
            Hanya boleh berisi huruf, tanpa angka.
          </p>
        )}
      </div>

      {/* No WhatsApp PIC */}
      <div>
        <label className="mb-2 block text-[13px] font-bold text-gray-800">
          Nomor WhatsApp Penanggung Jawab
        </label>
        <div className="relative">
          <input
            type="tel"
            name="kontak"
            value={formData.kontak}
            onChange={handleLocal}
            onBlur={handleBlur}
            onKeyDown={handleWaKeyDown}
            placeholder="Cth: 08123456789"
            maxLength={16}
            inputMode="numeric"
            className={`${inputClass(touched.kontak, errors.kontak)} pr-8`}
          />
          {isValid("kontak") && <SuccessIcon />}
        </div>
        <ErrorMsg msg={touched.kontak ? errors.kontak : null} />
        {!errors.kontak && (
          <p className="mt-1 text-[11px] text-gray-400">
            Format: 08xxxxxxxxxx atau +628xxxxxxxxxx
          </p>
        )}
      </div>

      {/* Info box */}
      <div className="rounded-lg border border-emerald-100 bg-emerald-50/60 px-4 py-3">
        <p className="text-[12px] leading-relaxed text-gray-600">
          <span className="font-bold text-emerald-700">ℹ️ Informasi:</span>{" "}
          Kontak ini akan digunakan untuk keperluan koordinasi dan verifikasi
          data aset oleh admin TorangBersih.
        </p>
      </div>
    </div>
  );
};

export default StepKontakFasilitas;
