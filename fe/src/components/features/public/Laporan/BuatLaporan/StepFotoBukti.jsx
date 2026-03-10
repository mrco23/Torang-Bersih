import React, { useState, useRef } from "react";

const ALLOWED = ["image/jpeg", "image/png", "image/webp"];
const MAX_MB = 10;
const MAX_N = 5;

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
  const [error, setError] = useState(null);

  // Dua ref terpisah untuk Kamera dan Galeri
  const fileRef = useRef(null);
  const cameraRef = useRef(null);

  const fotos = formData.foto_bukti_urls || [];

  const processFiles = (files) => {
    setError(null);
    const arr = Array.from(files);

    if (fotos.length + arr.length > MAX_N) {
      setError(`Maksimal ${MAX_N} foto.`);
      return;
    }

    arr.forEach((f) => {
      if (!ALLOWED.includes(f.type)) {
        setError(`Format tidak didukung: ${f.name}`);
        return;
      }
      if (f.size > MAX_MB * 1024 * 1024) {
        setError(`Terlalu besar: ${f.name}. Maks ${MAX_MB}MB.`);
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) =>
        setFormData((p) => ({
          ...p,
          foto_bukti_urls: [
            ...(p.foto_bukti_urls || []),
            { url: e.target.result, name: f.name },
          ],
        }));
      reader.readAsDataURL(f);
    });

    // Reset isi input agar bisa memilih file yang sama lagi jika dihapus
    if (fileRef.current) fileRef.current.value = "";
    if (cameraRef.current) cameraRef.current.value = "";
  };

  const remove = (idx) =>
    setFormData((p) => ({
      ...p,
      foto_bukti_urls: p.foto_bukti_urls.filter((_, i) => i !== idx),
    }));

  return (
    <div className="animate-in fade-in space-y-6 duration-300">
      <div>
        <h2 className="text-[22px] font-bold text-gray-900">Foto Bukti</h2>
        <p className="mt-1 text-sm text-gray-500">
          Unggah foto kondisi tumpukan sampah yang ditemukan.
        </p>
      </div>

      {/* Kondisi Awal: Belum ada foto */}
      {fotos.length === 0 && (
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
              <p className="text-sm font-bold text-[#1e1f78]">Buka Kamera</p>
              <p className="mt-0.5 text-[11px] text-[#1e1f78]/70">
                Ambil foto langsung
              </p>
            </div>
          </button>

          {/* Tombol Galeri */}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 py-10 text-gray-500 transition-all hover:border-[#1e1f78] hover:bg-gray-100"
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
              <p className="text-sm font-bold text-gray-700">
                Pilih dari Galeri
              </p>
              <p className="mt-0.5 text-[11px] text-gray-500">
                Maksimal {MAX_N} foto
              </p>
            </div>
          </button>
        </div>
      )}

      {/* Preview Grid (Jika sudah ada foto) */}
      {fotos.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {fotos.map((foto, idx) => (
            <div
              key={idx}
              className="group relative aspect-square overflow-hidden rounded-xl border border-gray-200"
            >
              <img
                src={foto.url}
                alt={foto.name}
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => remove(idx)}
                className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <svg
                  className="size-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
              <span className="absolute top-1.5 left-1.5 flex size-5 items-center justify-center rounded-full bg-black/50 text-[10px] font-bold text-white">
                {idx + 1}
              </span>
            </div>
          ))}

          {/* Slot Tambah Foto Terbagi 2 (Kamera & Galeri) */}
          {fotos.length < MAX_N && (
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
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
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
                    d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                  />
                </svg>
                <span className="text-[10px] font-bold tracking-wider uppercase">
                  Galeri
                </span>
              </button>
            </div>
          )}
        </div>
      )}

      {error && <ErrorMsg msg={error} />}

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
        accept={ALLOWED.join(",")}
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
