import React, { useState, useRef } from "react";

const RULES = {
  foto_aset: {
    maxSizeMB: 5,
    allowedTypes: ["image/jpeg", "image/png", "image/webp", "image/svg+xml"],
    allowedExt: ["JPG", "PNG", "WEBP", "SVG"],
  },
};

const StepFotoAset = ({ setFotoAsetFiles }) => {
  const [previews, setPreviews] = useState([]); // { file, url, name, size }
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const processFiles = (files) => {
    setError("");
    const incoming = Array.from(files);
    const current = previews;

    if (current.length + incoming.length > RULES.foto_aset.maxSizeMB) {
      setError(`Maksimal ${RULES.foto_aset.maxSizeMB} foto.`);
      return;
    }

    const valid = [];
    for (const file of incoming) {
      if (!RULES.foto_aset.allowedTypes.includes(file.type)) {
        setError("Hanya JPG, PNG, WEBP yang diizinkan.");
        return;
      }
      if (file.size > RULES.foto_aset.maxSizeMB * 1024 * 1024) {
        setError(`Ukuran file maksimal ${RULES.foto_aset.maxSizeMB}MB.`);
        return;
      }
      valid.push({
        file,
        url: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
      });
    }

    const updated = [...current, ...valid];
    setPreviews(updated);
    // Simpan object File agar bisa merangkai FormData di submit
    setFotoAsetFiles((prev) => ({
      ...prev,
      foto_aset_urls: updated.map((p) => p.file),
    }));
  };

  const handleFileInput = (e) => processFiles(e.target.files);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    processFiles(e.dataTransfer.files);
  };

  const removePhoto = (idx) => {
    const updated = previews.filter((_, i) => i !== idx);
    setPreviews(updated);
    setFotoAsetFiles((prev) => ({
      ...prev,
      foto_aset_urls: updated.map((p) => p.file),
    }));
  };

  const formatSize = (bytes) =>
    bytes < 1024 * 1024
      ? `${(bytes / 1024).toFixed(0)} KB`
      : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

  return (
    <div className="animate-in fade-in space-y-6 duration-300">
      <div className="mb-6">
        <h2 className="text-[22px] font-bold text-gray-900">Foto Aset</h2>
        <p className="mt-1 text-[13px] text-gray-500">
          Upload foto aset untuk mempermudah verifikasi. Maks.{" "}
          {RULES.foto_aset.maxSizeMB} foto, {RULES.foto_aset.maxSizeMB}MB per
          file.
        </p>
      </div>

      {/* Drop zone */}
      {previews.length < RULES.foto_aset.maxSizeMB && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed py-10 transition-colors ${
            dragOver
              ? "border-emerald-600 bg-emerald-50"
              : "border-gray-300 bg-gray-50 hover:border-emerald-600 hover:bg-emerald-50/40"
          }`}
        >
          <div className="flex size-12 items-center justify-center rounded-full bg-emerald-600/10">
            <svg
              className="size-6 text-emerald-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-[13px] font-semibold text-emerald-700">
              Klik atau seret foto ke sini
            </p>
            <p className="text-[12px] text-gray-400">
              JPG, PNG, WEBP · maks {RULES.foto_aset.maxSizeMB}MB
            </p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={handleFileInput}
          />
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="flex items-center gap-1 text-[12px] text-red-500">
          <svg
            className="size-3 shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}

      {/* Preview grid */}
      {previews.length > 0 && (
        <div>
          <p className="mb-3 text-[12px] font-semibold text-gray-500">
            {previews.length}/{RULES.foto_aset.maxSizeMB} foto terupload
          </p>
          <div className="grid grid-cols-3 gap-3">
            {previews.map((p, idx) => (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-lg border border-gray-200"
              >
                <img
                  src={p.url}
                  alt={p.name}
                  className="h-28 w-full object-cover transition-transform group-hover:scale-105"
                />
                {/* Overlay info */}
                <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/60 to-transparent px-2 py-1.5">
                  <p className="truncate text-[10px] text-white">{p.name}</p>
                  <p className="text-[10px] text-white/70">
                    {formatSize(p.size)}
                  </p>
                </div>
                {/* Tombol hapus */}
                <button
                  type="button"
                  onClick={() => removePhoto(idx)}
                  className="absolute top-1.5 right-1.5 flex size-6 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <svg
                    className="size-3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                {/* Badge nomor */}
                <span className="absolute top-1.5 left-1.5 flex size-5 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">
                  {idx + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Foto opsional info */}
      {previews.length === 0 && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
          <p className="text-[12px] text-gray-500">
            <span className="font-semibold text-gray-700">
              Foto bersifat opsional
            </span>{" "}
            namun sangat disarankan. Foto membantu admin memverifikasi
            keberadaan dan kondisi aset lebih cepat.
          </p>
        </div>
      )}
    </div>
  );
};

export default StepFotoAset;
