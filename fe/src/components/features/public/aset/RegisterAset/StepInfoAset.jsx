import React, { useState } from "react";

const RULES = {
  nama_aset: {
    minLength: 3,
    maxLength: 100,
    pattern: /^[a-zA-Z0-9\s\-&'.(),]+$/,
    patternMsg:
      "Hanya huruf, angka, spasi, dan karakter - & ' . ( ) yang diizinkan.",
  },
  deskripsi_aset: {
    minLength: 50,
    maxLength: 500,
  },
};

const validate = (name, value) => {
  if (!value || (typeof value === "string" && !value.trim()))
    return "Wajib diisi.";
  const r = RULES[name];
  if (!r) return null;
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

const CharCount = ({ current, min }) => {
  const isBelowMin = current < min;
  return (
    <p
      className={`mt-1 text-right text-[11px] ${isBelowMin ? "text-gray-400" : "text-green-500"}`}
    >
      {isBelowMin
        ? `${current}/${min} karakter (minimal ${min})`
        : `${current} karakter ✓`}
    </p>
  );
};

const StepInfoAset = ({ formData, handleChange, kategoriAset = [] }) => {
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((p) => ({ ...p, [name]: true }));
    setErrors((p) => ({ ...p, [name]: validate(name, value) }));
  };

  const handleLocal = (e) => {
    handleChange(e);
    const { name, value } = e.target;
    if (touched[name])
      setErrors((p) => ({ ...p, [name]: validate(name, value) }));
  };

  return (
    <div className="animate-in fade-in space-y-6 duration-300">
      <h2 className="mb-6 text-[22px] font-bold text-gray-900">
        Informasi Aset
      </h2>

      {/* Nama Aset */}
      <div>
        <label className="mb-2 block text-[13px] font-bold text-gray-800">
          Nama Aset / Fasilitas
        </label>
        <input
          type="text"
          name="nama_aset"
          value={formData.nama_aset}
          onChange={handleLocal}
          onBlur={handleBlur}
          placeholder="Cth: TPST Malalayang Terpadu"
          maxLength={RULES.nama_aset.maxLength}
          className={inputClass(touched.nama_aset, errors.nama_aset)}
        />
        {touched.nama_aset && errors.nama_aset ? (
          <ErrorMsg msg={errors.nama_aset} />
        ) : (
          <p className="mt-1 text-right text-[11px] text-gray-400">
            {formData.nama_aset.length}/{RULES.nama_aset.maxLength}
          </p>
        )}
      </div>

      {/* Kategori Aset (Dropdown) */}
      <div>
        <label className="mb-2 block text-[13px] font-bold text-gray-800">
          Kategori Aset
        </label>
        <select
          name="kategori_aset_id"
          value={formData.kategori_aset_id}
          onChange={handleLocal}
          onBlur={handleBlur}
          className={`${inputClass(touched.kategori_aset_id, errors.kategori_aset_id)} text-gray-600`}
        >
          <option value="" disabled>
            -- Pilih Kategori Aset --
          </option>
          {kategoriAset.map((opt) => (
            <option key={opt.id} value={opt.id} className="text-gray-900">
              {opt.nama}
            </option>
          ))}
        </select>
        <ErrorMsg
          msg={touched.kategori_aset_id ? errors.kategori_aset_id : null}
        />
      </div>

      {/* Deskripsi Aset */}
      <div>
        <label className="mb-2 block text-[13px] font-bold text-gray-800">
          Deskripsi Aset
        </label>
        <textarea
          name="deskripsi_aset"
          value={formData.deskripsi_aset}
          onChange={handleLocal}
          onBlur={handleBlur}
          rows={4}
          placeholder="Jelaskan secara singkat mengenai aset/fasilitas yang ingin didaftarkan"
          maxLength={500}
          className={`${inputClass(touched.deskripsi_aset, errors.deskripsi_aset)} resize-none`}
        />
        {touched.deskripsi_aset && errors.deskripsi_aset ? (
          <ErrorMsg msg={errors.deskripsi_aset} />
        ) : (
          <CharCount
            current={formData.deskripsi_aset.length}
            min={RULES.deskripsi_aset.minLength}
          />
        )}
      </div>
    </div>
  );
};

export default StepInfoAset;
