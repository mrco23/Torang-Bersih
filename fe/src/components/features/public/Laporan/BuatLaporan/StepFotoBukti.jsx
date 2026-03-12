import React, { useState, useRef, useEffect } from "react";

const RULES = {
  maxSizeMB: 10,
  maxFiles: 5,
  allowedTypes: ["image/jpeg", "image/png", "image/webp"],
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

export default function StepFotoBukti({ formData, setFormData }) {
  const [error, setError] = useState("");
  const [previews, setPreviews] = useState([]);
  const [dragOver, setDragOver] = useState(false);

  const fileRef = useRef(null);
  const cameraRef = useRef(null);

  // Load existing photos if user navigates back
  useEffect(() => {
    if (formData.foto_bukti_urls && formData.foto_bukti_urls.length > 0 && previews.length === 0) {
      const initialPreviews = formData.foto_bukti_urls.map((file) => ({
        file,
        url: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
      }));
      setPreviews(initialPreviews);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatSize = (bytes) =>
    bytes < 1024 * 1024
      ? `${(bytes / 1024).toFixed(0)} KB`
      : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

  const processFiles = (files) => {
    setError("");
    const incoming = Array.from(files);
    const currentList = previews;

    if (currentList.length + incoming.length > RULES.maxFiles) {
      setError(`Maksimal ${RULES.maxFiles} foto.`);
      return;
    }

    const valid = [];
    for (const file of incoming) {
      if (!RULES.allowedTypes.includes(file.type)) {
        setError("Hanya JPG, PNG, WEBP yang diizinkan.");
        continue;
      }
      if (file.size > RULES.maxSizeMB * 1024 * 1024) {
        setError(`Ukuran file maksimal ${RULES.maxSizeMB}MB.`);
        continue;
      }
      valid.push({
        file,
        url: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
      });
    }

    const updated = [...currentList, ...valid];
    setPreviews(updated);
    setFormData((prev) => ({
      ...prev,
      foto_bukti_urls: updated.map((p) => p.file),
    }));

    if (fileRef.current) fileRef.current.value = "";
    if (cameraRef.current) cameraRef.current.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    processFiles(e.dataTransfer.files);
  };

  const removePhoto = (idx) => {
    const updated = previews.filter((_, i) => i !== idx);
    setPreviews(updated);
    setFormData((prev) => ({
      ...prev,
      foto_bukti_urls: updated.map((p) => p.file),
    }));
  };

  return (
    <div className="animate-in fade-in space-y-6 duration-300">
      <div>
        <h2 className="text-[22px] font-bold text-gray-900">Foto Bukti</h2>
        <p className="mt-1 text-[13px] text-gray-500">
          Unggah foto kondisi tumpukan sampah yang ditemukan. Maks. {RULES.maxFiles} foto, {RULES.maxSizeMB}MB per file.
        </p>
      </div>

      {/* Kondisi Awal: Belum ada foto */}
      {previews.length === 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Tombol Kamera */}
          <button
            type="button"
            onClick={() => cameraRef.current?.click()}
            className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-[#1e1f78]/30 bg-[#f0f1ff]/50 py-10 transition-all hover:border-[#1e1f78] hover:bg-[#f0f1ff]"
          >
            <div className="flex size-12 items-center justify-center rounded-full border border-[#1e1f78]/10 bg-white text-[#1e1f78] shadow-sm">
              <svg
                className="size-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
                />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-[13px] font-bold text-[#1e1f78]">Buka Kamera</p>
              <p className="mt-0.5 text-[11px] text-[#1e1f78]/70">
                Ambil foto langsung
              </p>
            </div>
          </button>

          {/* Tombol Galeri (Drop Zone) */}
          <button
            type="button"
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            className={`flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed py-10 transition-all ${
              dragOver
                ? "border-[#1e1f78] bg-[#f0f1ff]"
                : "border-gray-300 bg-gray-50 text-gray-500 hover:border-[#1e1f78] hover:bg-gray-100"
            }`}
          >
            <div className="flex size-12 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm">
              <svg
                className="size-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-[13px] font-bold text-gray-700">
                Pilih dari Galeri
              </p>
              <p className="mt-0.5 text-[11px] text-gray-500">
                Atau seret foto ke sini
              </p>
            </div>
          </button>
        </div>
      )}

      {error && <ErrorMsg msg={error} />}

      {/* Preview Grid (Jika sudah ada foto) */}
      {previews.length > 0 && (
        <div>
          <p className="mb-3 text-[12px] font-semibold text-gray-500">
            {previews.length}/{RULES.maxFiles} foto terupload
          </p>
          <div className="grid grid-cols-3 gap-3">
            {previews.map((p, idx) => (
              <div
                key={idx}
                className="group relative aspect-square overflow-hidden rounded-xl border border-gray-200"
              >
                <img
                  src={p.url}
                  alt={p.name}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                
                {/* Overlay info */}
                <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 via-black/40 to-transparent px-2 py-2">
                  <p className="truncate text-[10px] font-medium text-white">{p.name}</p>
                  <p className="text-[10px] text-white/70">
                    {formatSize(p.size)}
                  </p>
                </div>

                {/* Tombol hapus */}
                <button
                  type="button"
                  onClick={() => removePhoto(idx)}
                  className="absolute top-1.5 right-1.5 flex size-6 items-center justify-center rounded-full bg-red-500 text-white opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
                >
                  <svg
                    className="size-3.5"
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
                <span className="absolute top-1.5 left-1.5 flex size-5 items-center justify-center rounded-full bg-black/60 text-[10px] font-bold text-white backdrop-blur-md">
                  {idx + 1}
                </span>
              </div>
            ))}

            {/* Slot Tambah Foto Terbagi 2 (Kamera & Galeri) */}
            {previews.length < RULES.maxFiles && (
              <div className="flex aspect-square flex-col gap-2">
                <button
                  type="button"
                  onClick={() => cameraRef.current?.click()}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-gray-300 text-gray-400 transition-colors hover:border-[#1e1f78] hover:text-[#1e1f78]"
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
                      d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
                    />
                  </svg>
                  <span className="text-[10px] font-bold tracking-wider uppercase">
                    Kamera
                  </span>
                </button>
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileRef.current?.click()}
                  className={`flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg border-2 border-dashed transition-colors ${
                    dragOver
                      ? "border-[#1e1f78] bg-[#f0f1ff] text-[#1e1f78]"
                      : "border-gray-300 text-gray-400 hover:border-[#1e1f78] hover:text-[#1e1f78]"
                  }`}
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
                      d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                    />
                  </svg>
                  <span className="text-[10px] font-bold tracking-wider uppercase">
                    Galeri
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Info tanpa Emoji */}
      <div className="flex items-start gap-3 rounded-lg border border-blue-100 bg-blue-50/60 px-4 py-3">
        <svg
          className="mt-0.5 size-4 shrink-0 text-[#1e1f78]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-[12px] leading-relaxed text-gray-600">
          <span className="mr-1 font-bold text-[#1e1f78]">TIPS:</span>
          Ambil foto dari beberapa sudut. Pastikan lokasi tumpukan terlihat
          jelas. Foto malam hari tetap diterima selama objek terlihat.
        </p>
      </div>

      {/* Hidden Inputs */}
      <input
        ref={fileRef}
        type="file"
        accept={RULES.allowedTypes.join(",")}
        multiple
        onChange={(e) => processFiles(e.target.files)}
        className="hidden"
      />
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(e) => processFiles(e.target.files)}
        className="hidden"
      />
    </div>
  );
}
