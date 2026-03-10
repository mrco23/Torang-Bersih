import React, { useState } from "react";

const inputCls = (t, e) => {
  const base =
    "w-full rounded border px-4 py-2.5 text-sm focus:outline-none transition-colors appearance-none bg-white";
  if (!t) return `${base} border-gray-300 focus:border-[#1e1f78]`;
  if (e) return `${base} border-red-400 bg-red-50 focus:border-red-500`;
  return `${base} border-gray-300 focus:border-[#1e1f78]`; // Menghilangkan hijau sukses berlebihan di dropdown
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

// Data dibersihkan dari emoji
const JENIS = [
  "Organik",
  "Plastik",
  "Tekstil",
  "Kaca",
  "Logam",
  "Kertas",
  "B3",
  "Campuran",
];

const BERAT = [
  { label: "Kurang dari 5 kg", val: 2.5 },
  { label: "5 - 20 kg", val: 12.5 },
  { label: "20 - 50 kg", val: 35 },
  { label: "50 - 100 kg", val: 75 },
  { label: "Lebih dari 100 kg", val: 150 },
];

const KARAKTERISTIK = ["Bisa didaur ulang", "Residu"];

const BENTUK = [
  { val: "Tercecer", desc: "Sampah tersebar di area sekitar" },
  { val: "Menumpuk", desc: "Sampah bertumpuk di satu titik" },
];

// Ikon panah bawah kustom untuk dropdown
const SelectArrow = () => (
  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
    <svg
      className="size-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M19 9l-7 7-7-7"
      />
    </svg>
  </div>
);

export default function StepDetailLaporan({
  formData,
  setFormData,
  handleChange,
}) {
  const [touched, setTouched] = useState({});

  const handleSelectChange = (e) => {
    const { name, value } = e.target;

    // Khusus untuk berat, kita pastikan nilainya disimpan sebagai angka (float)
    const finalValue = name === "estimasi_berat_kg" ? parseFloat(value) : value;

    setFormData((p) => ({ ...p, [name]: finalValue }));
    setTouched((p) => ({ ...p, [name]: true }));
  };

  const handleTextareaBlur = () => {
    setTouched((p) => ({ ...p, deskripsi: true }));
  };

  return (
    <div className="animate-in fade-in space-y-6 duration-300">
      <h2 className="text-[22px] font-bold text-gray-900">Detail Laporan</h2>
      <p className="-mt-4 text-sm text-gray-500">
        Lengkapi informasi berikut untuk pendataan sistem.
      </p>

      {/* Jenis Sampah */}
      <div>
        <label className="mb-2 block text-[13px] font-bold text-gray-800">
          Jenis Sampah
        </label>
        <div className="relative">
          <select
            name="jenis_sampah"
            value={formData.jenis_sampah || ""}
            onChange={handleSelectChange}
            className={`${inputCls(touched.jenis_sampah, touched.jenis_sampah && !formData.jenis_sampah)} ${!formData.jenis_sampah ? "text-gray-400" : "text-gray-700"}`}
          >
            <option value="" disabled>
              -- Pilih jenis sampah --
            </option>
            {JENIS.map((jenis) => (
              <option key={jenis} value={jenis} className="text-gray-900">
                {jenis}
              </option>
            ))}
          </select>
          <SelectArrow />
        </div>
        {touched.jenis_sampah && !formData.jenis_sampah && (
          <ErrorMsg msg="Jenis sampah wajib dipilih." />
        )}
      </div>

      {/* Estimasi Berat */}
      <div>
        <label className="mb-2 block text-[13px] font-bold text-gray-800">
          Estimasi Berat
        </label>
        <div className="relative">
          <select
            name="estimasi_berat_kg"
            value={formData.estimasi_berat_kg || ""}
            onChange={handleSelectChange}
            className={`${inputCls(touched.estimasi_berat_kg, touched.estimasi_berat_kg && !formData.estimasi_berat_kg)} ${!formData.estimasi_berat_kg ? "text-gray-400" : "text-gray-700"}`}
          >
            <option value="" disabled>
              -- Pilih estimasi berat --
            </option>
            {BERAT.map((b) => (
              <option key={b.val} value={b.val} className="text-gray-900">
                {b.label}
              </option>
            ))}
          </select>
          <SelectArrow />
        </div>
        {touched.estimasi_berat_kg && !formData.estimasi_berat_kg && (
          <ErrorMsg msg="Estimasi berat wajib dipilih." />
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Karakteristik */}
        <div>
          <label className="mb-2 block text-[13px] font-bold text-gray-800">
            Karakteristik
          </label>
          <div className="relative">
            <select
              name="karakteristik"
              value={formData.karakteristik || ""}
              onChange={handleSelectChange}
              className={`${inputCls(touched.karakteristik, touched.karakteristik && !formData.karakteristik)} ${!formData.karakteristik ? "text-gray-400" : "text-gray-700"}`}
            >
              <option value="" disabled>
                -- Pilih karakteristik --
              </option>
              {KARAKTERISTIK.map((k) => (
                <option key={k} value={k} className="text-gray-900">
                  {k}
                </option>
              ))}
            </select>
            <SelectArrow />
          </div>
          {touched.karakteristik && !formData.karakteristik && (
            <ErrorMsg msg="Karakteristik wajib dipilih." />
          )}
        </div>

        {/* Bentuk Timbulan */}
        <div>
          <label className="mb-2 block text-[13px] font-bold text-gray-800">
            Bentuk Timbulan
          </label>
          <div className="relative">
            <select
              name="bentuk_timbulan"
              value={formData.bentuk_timbulan || ""}
              onChange={handleSelectChange}
              className={`${inputCls(touched.bentuk_timbulan, touched.bentuk_timbulan && !formData.bentuk_timbulan)} ${!formData.bentuk_timbulan ? "text-gray-400" : "text-gray-700"}`}
            >
              <option value="" disabled>
                -- Pilih bentuk timbulan --
              </option>
              {BENTUK.map((b) => (
                <option key={b.val} value={b.val} className="text-gray-900">
                  {b.val} - {b.desc}
                </option>
              ))}
            </select>
            <SelectArrow />
          </div>
          {touched.bentuk_timbulan && !formData.bentuk_timbulan && (
            <ErrorMsg msg="Bentuk timbulan wajib dipilih." />
          )}
        </div>
      </div>

      {/* Deskripsi */}
      <div>
        <label className="mb-2 flex items-center gap-1.5 text-[13px] font-bold text-gray-800">
          Deskripsi Tambahan
          <span className="text-[11px] font-normal text-gray-400">
            (Opsional)
          </span>
        </label>
        <textarea
          name="deskripsi"
          value={formData.deskripsi || ""}
          onChange={handleChange}
          onBlur={handleTextareaBlur}
          rows="3"
          maxLength={500}
          placeholder="Tuliskan detail tambahan (misal: bau menyengat, menutupi jalan, dll)"
          className="w-full resize-none rounded border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 transition-colors placeholder:text-gray-400 focus:border-[#1e1f78] focus:outline-none"
        />
        <p className="mt-1 text-right text-[11px] text-gray-400">
          {(formData.deskripsi || "").length} / 500
        </p>
      </div>
    </div>
  );
}
