import React, { useState, useRef } from "react";

// ─── Aturan Validasi ───────────────────────────────────────────────
const RULES = {
  nama_organisasi: {
    minLength: 3,
    maxLength: 100,
    pattern: /^[a-zA-Z0-9\s\-&'.(),]+$/,
    patternMsg:
      "Hanya huruf, angka, spasi, dan karakter - & ' . ( ) yang diizinkan.",
  },
  deskripsi: {
    minLength: 20,
    maxLength: 500,
  },
  logo: {
    maxSizeMB: 2,
    allowedTypes: ["image/jpeg", "image/png", "image/webp", "image/svg+xml"],
    allowedExt: ["JPG", "PNG", "WEBP", "SVG"],
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

const CharCount = ({ current, max, min }) => {
  const remaining = max - current;
  const isBelowMin = current < min;
  const isWarning = !isBelowMin && remaining <= 20;
  return (
    <p
      className={`mt-1 text-right text-[11px] ${isWarning ? "text-orange-500" : isBelowMin ? "text-gray-400" : "text-gray-400"}`}
    >
      {isBelowMin
        ? `Minimal ${min - current} karakter lagi`
        : `${remaining} karakter tersisa`}
    </p>
  );
};

// ══════════════════════════════════════════════════════════════════
const StepProfilOrganisasi = ({ formData, handleChange, setFormData }) => {
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoError, setLogoError] = useState(null);
  const [logoFileName, setLogoFileName] = useState(null);
  const fileInputRef = useRef(null);

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
  };

  const handleLocalChange = (e) => {
    handleChange(e);
    const { name, value } = e.target;
    if (touched[name])
      setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    setLogoError(null);
    setLogoPreview(null);
    setLogoFileName(null);
    if (!file) return;

    if (!RULES.logo.allowedTypes.includes(file.type)) {
      setLogoError(
        `Format tidak didukung. Gunakan: ${RULES.logo.allowedExt.join(", ")}`,
      );
      return;
    }
    if (file.size > RULES.logo.maxSizeMB * 1024 * 1024) {
      setLogoError(`Ukuran file melebihi ${RULES.logo.maxSizeMB}MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      setLogoPreview(ev.target.result);
      setLogoFileName(file.name);
      if (setFormData)
        setFormData((prev) => ({ ...prev, logo_url: ev.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    setLogoFileName(null);
    setLogoError(null);
    if (setFormData) setFormData((prev) => ({ ...prev, logo_url: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="animate-in fade-in space-y-6 duration-300">
      <h2 className="mb-8 text-[22px] font-bold text-gray-900">
        Profil Kolabolator
      </h2>

      {/* Nama Organisasi */}
      <div>
        <label className="mb-2 block text-[13px] font-bold text-gray-800">
          Apa nama resmi organisasi atau komunitas Anda?
        </label>
        <input
          type="text"
          name="nama_organisasi"
          value={formData.nama_organisasi}
          onChange={handleLocalChange}
          onBlur={handleBlur}
          placeholder="Cth: Trash Hero Manado"
          maxLength={RULES.nama_organisasi.maxLength}
          className={inputClass(
            touched.nama_organisasi,
            errors.nama_organisasi,
          )}
        />
        {touched.nama_organisasi && errors.nama_organisasi ? (
          <ErrorMsg msg={errors.nama_organisasi} />
        ) : (
          <CharCount
            current={formData.nama_organisasi.length}
            max={RULES.nama_organisasi.maxLength}
            min={RULES.nama_organisasi.minLength}
          />
        )}
      </div>

      {/* Jenis Kolaborator */}
      <div>
        <label className="mb-2 block text-[13px] font-bold text-gray-800">
          Termasuk dalam kategori apakah gerakan Anda?
        </label>
        <select
          name="jenis_kolaborator"
          value={formData.jenis_kolaborator}
          onChange={handleLocalChange}
          onBlur={handleBlur}
          className={`${inputClass(touched.jenis_kolaborator, errors.jenis_kolaborator)} text-gray-600`}
        >
          <option value="" disabled>
            -- Kategori --
          </option>
          <option value="Komunitas">Komunitas</option>
          <option value="LSM">LSM</option>
          <option value="Sekolah">Sekolah / Universitas</option>
          <option value="Instansi">Instansi Pemerintah</option>
          <option value="CSR">CSR Perusahaan</option>
        </select>
        <ErrorMsg
          msg={touched.jenis_kolaborator ? errors.jenis_kolaborator : null}
        />
      </div>

      {/* Deskripsi */}
      <div>
        <label className="mb-2 block text-[13px] font-bold text-gray-800">
          Ceritakan singkat fokus utama gerakan persampahan Anda.
        </label>
        <textarea
          name="deskripsi"
          value={formData.deskripsi}
          onChange={handleLocalChange}
          onBlur={handleBlur}
          rows="3"
          maxLength={RULES.deskripsi.maxLength}
          placeholder="Minimal 20 karakter..."
          className={`${inputClass(touched.deskripsi, errors.deskripsi)} resize-none`}
        />
        {touched.deskripsi && errors.deskripsi ? (
          <ErrorMsg msg={errors.deskripsi} />
        ) : (
          <CharCount
            current={formData.deskripsi.length}
            max={RULES.deskripsi.maxLength}
            min={RULES.deskripsi.minLength}
          />
        )}
      </div>

      {/* Upload Logo */}
      <div>
        <label className="mb-2 block text-[13px] font-bold text-gray-800">
          Unggah logo
        </label>
        {logoPreview ? (
          <div className="flex items-center gap-4 rounded border border-green-300 bg-green-50 px-4 py-3">
            <img
              src={logoPreview}
              alt="Preview Logo"
              className="size-12 rounded object-contain"
            />
            <div className="flex flex-1 flex-col overflow-hidden">
              <span className="truncate text-sm font-semibold text-gray-800">
                {logoFileName}
              </span>
              <span className="text-[11px] text-green-600">
                Logo berhasil dipilih ✓
              </span>
            </div>
            <button
              type="button"
              onClick={handleRemoveLogo}
              className="ml-auto shrink-0 text-gray-400 hover:text-red-500"
              title="Hapus logo"
            >
              <svg
                className="size-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-2 rounded border border-gray-300 px-6 py-2.5 text-sm font-semibold text-[#1e1f78] hover:bg-gray-50"
          >
            <svg
              className="size-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            Upload File
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept={RULES.logo.allowedTypes.join(",")}
          onChange={handleLogoChange}
          className="hidden"
        />
        {logoError ? (
          <ErrorMsg msg={logoError} />
        ) : (
          !logoPreview && (
            <p className="mt-1 text-[11px] text-gray-400">
              Format: {RULES.logo.allowedExt.join(", ")} · Maks.{" "}
              {RULES.logo.maxSizeMB}MB · Opsional
            </p>
          )
        )}
      </div>
    </div>
  );
};

export default StepProfilOrganisasi;
