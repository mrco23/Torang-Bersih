import React, { useState } from "react";

const KATEGORI_OPTIONS = ["Bank Sampah", "TPA", "Composting", "Kendaraan", "TPST"];

const validate = (name, value) => {
  if (!value?.toString().trim()) return "Wajib diisi.";
  if (name === "nama_aset") {
    if (value.trim().length < 3) return "Minimal 3 karakter.";
    if (value.trim().length > 100) return "Maksimal 100 karakter.";
  }
  return null;
};

const inputClass = (touched, error) => {
  const base = "w-full rounded border px-4 py-2.5 text-sm focus:outline-none transition-colors appearance-none bg-white";
  if (!touched) return `${base} border-gray-300 focus:border-[#1e1f78]`;
  if (error) return `${base} border-red-400 bg-red-50 focus:border-red-500`;
  return `${base} border-green-400 bg-green-50 focus:border-green-500`;
};

const ErrorMsg = ({ msg }) => msg ? (
  <p className="mt-1 flex items-center gap-1 text-[12px] text-red-500">
    <svg className="size-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
    {msg}
  </p>
) : null;

const StepInfoAset = ({ formData, handleChange }) => {
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
    if (touched[name]) setErrors((p) => ({ ...p, [name]: validate(name, value) }));
  };

  return (
    <div className="animate-in fade-in space-y-6 duration-300">
      <h2 className="mb-6 text-[22px] font-bold text-gray-900">Informasi Aset</h2>

      {/* Nama Aset */}
      <div>
        <label className="mb-2 block text-[13px] font-bold text-gray-800">Nama Aset / Fasilitas</label>
        <input
          type="text"
          name="nama_aset"
          value={formData.nama_aset}
          onChange={handleLocal}
          onBlur={handleBlur}
          placeholder="Cth: TPST Malalayang Terpadu"
          maxLength={100}
          className={inputClass(touched.nama_aset, errors.nama_aset)}
        />
        {touched.nama_aset && errors.nama_aset
          ? <ErrorMsg msg={errors.nama_aset} />
          : <p className="mt-1 text-right text-[11px] text-gray-400">{formData.nama_aset.length}/100</p>}
      </div>

      {/* Kategori Aset (Dropdown) */}
      <div>
        <label className="mb-2 block text-[13px] font-bold text-gray-800">Kategori Aset</label>
        <div className="relative">
          <select
            name="kategori_aset"
            value={formData.kategori_aset}
            onChange={handleLocal}
            onBlur={handleBlur}
            className={`${inputClass(touched.kategori_aset, errors.kategori_aset)} ${!formData.kategori_aset ? "text-gray-400" : "text-gray-900"}`}
          >
            <option value="" disabled>-- Pilih Kategori Aset --</option>
            {KATEGORI_OPTIONS.map((opt) => (
              <option key={opt} value={opt} className="text-gray-900">
                {opt}
              </option>
            ))}
          </select>
          {/* Custom Arrow Icon */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
            <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {touched.kategori_aset && <ErrorMsg msg={errors.kategori_aset} />}
      </div>

      {/* Status Aset */}
     <div>
  <label className="mb-3 block text-[13px] font-bold text-gray-800">
    Status Operasional
  </label>
  <div className="flex gap-6">
    {[
      { label: "Beroperasi", val: true },
      { label: "Tidak Aktif", val: false },
    ].map(({ label, val }) => (
      <label
        key={label}
        className="flex cursor-pointer items-center gap-2 text-[14px] font-medium text-gray-700 transition-colors hover:text-[#1e1f78]"
      >
        <input
          type="radio"
          name="status_aktif"
          checked={formData.status_aktif === val}
          onChange={() =>
            handleChange({ target: { name: "status_aktif", value: val } })
          }
          // accent-[#1e1f78] akan mengubah warna bulatan radio asli
          className="size-4 cursor-pointer accent-[#1e1f78]"
        />
        {label}
      </label>
    ))}
  </div>
</div>
    </div>
  );
};

export default StepInfoAset;