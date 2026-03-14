import React, { useState, useRef } from "react";
import {
  RiImageAddLine,
  RiCloseLine,
  RiTimeLine,
  RiFileTextLine,
  RiCheckLine,
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiStarLine,
  RiLightbulbLine,
  RiUploadCloud2Line,
  RiPriceTag3Line,
} from "react-icons/ri";
import toaster from "../../../../../utils/toaster";
import { getKatStyle } from "./constant";

const TARGET_WORDS = 300;

const ArtikelSidebar = ({
  form,
  wordCount,
  readTime,
  onFormChange,
  onFotoFileChange,
  kategoriList,
  loadingKategori,
  fotoPreview,
}) => {
  const [showTips, setShowTips] = useState(false);
  const fileInputRef = useRef(null);

  const hasJudul = form.judul_artikel?.trim().length > 0;
  const hasKonten = wordCount >= 50;
  const hasKategori = !!form.kategori_id;
  const hasCover = !!fotoPreview;
  const hasTags = (form.tags || []).length > 0;

  const CHECKS = [
    { label: "Judul artikel", done: hasJudul, required: true },
    { label: "Isi artikel (≥ 50 kata)", done: hasKonten, required: true },
    { label: "Pilih topik", done: hasKategori, required: true },
    { label: "Foto cover (opsional)", done: hasCover, required: false },
    { label: "Tags artikel (opsional)", done: hasTags, required: false },
  ];

  const doneMandatory = CHECKS.filter((c) => c.required && c.done).length;
  const totalMandatory = CHECKS.filter((c) => c.required).length;
  const percent = Math.round((doneMandatory / totalMandatory) * 100);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      toaster.error("Format file tidak didukung. Gunakan JPG, PNG, atau WebP.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toaster.error("Ukuran foto maks 5 MB.");
      return;
    }

    onFotoFileChange(file);
    // Kosongkan fallback URL jika user memilih file lokal
    onFormChange("foto_cover_url", "");
  };

  const handleRemoveFoto = () => {
    onFotoFileChange(null);
    onFormChange("foto_cover_url", "");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-6">
      {/* CHECKLIST */}
      <div
        className={`rounded-xl border p-5 ${percent === 100 ? "border-green-200 bg-green-50" : "border-[#1e1f78]/20 bg-white"}`}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-800">
            {percent === 100 ? (
              <>
                <RiCheckLine className="text-green-600" /> Artikel Siap
                Diterbitkan
              </>
            ) : (
              <>
                <RiStarLine className="text-[#1e1f78]" /> Kelengkapan Artikel
              </>
            )}
          </h3>
          <span
            className={`text-sm font-semibold ${percent === 100 ? "text-green-600" : "text-[#1e1f78]"}`}
          >
            {percent}%
          </span>
        </div>
        <div className="mb-4 h-2 overflow-hidden rounded-full bg-gray-200">
          <div
            className={`h-2 transition-all ${percent === 100 ? "bg-green-500" : "bg-[#1e1f78]"}`}
            style={{ width: `${percent}%` }}
          />
        </div>
        <ul className="space-y-2 text-sm">
          {CHECKS.map((c, i) => (
            <li key={i} className="flex items-center gap-2">
              <div
                className={`flex h-5 w-5 items-center justify-center rounded-full border ${c.done ? "border-green-500 bg-green-500" : "border-gray-300"}`}
              >
                {c.done && <RiCheckLine className="text-xs text-white" />}
              </div>
              <span
                className={`${c.done ? "text-gray-400 line-through" : "font-medium text-gray-700"}`}
              >
                {c.label}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* PANJANG ARTIKEL */}
      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
          <RiFileTextLine className="text-gray-400" /> Panjang Artikel
        </h3>
        <div className="mb-2 flex justify-between text-xs text-gray-500">
          <span>{wordCount} kata</span>
          <span>Target {TARGET_WORDS}</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-gray-100">
          <div
            className={`h-2 ${wordCount >= TARGET_WORDS ? "bg-green-500" : "bg-[#1e1f78]"}`}
            style={{
              width: `${Math.min((wordCount / TARGET_WORDS) * 100, 100)}%`,
            }}
          />
        </div>
        <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <RiTimeLine /> {readTime} menit baca
          </span>
        </div>
      </div>

      {/* PILIH TOPIK dari API */}
      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-gray-700">
          Pilih Topik Artikel
        </h3>
        {loadingKategori ? (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-16 animate-pulse rounded-lg border border-gray-100 bg-gray-100 p-3"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {kategoriList.map((kat, idx) => {
              const style = getKatStyle(idx);
              const selected = form.kategori_id === kat.id;
              return (
                <button
                  key={kat.id}
                  onClick={() => onFormChange("kategori_id", kat.id)}
                  className={`rounded-lg border p-3 text-left transition ${selected ? `${style.bg} ${style.border}` : "border-gray-200 hover:bg-gray-50"}`}
                >
                  <p
                    className={`text-xs font-semibold ${selected ? style.color : "text-gray-700"}`}
                  >
                    {kat.nama}
                  </p>
                  {kat.deskripsi && (
                    <p className="mt-0.5 line-clamp-2 text-[11px] text-gray-500">
                      {kat.deskripsi}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* FOTO COVER — file upload */}
      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
          <RiImageAddLine className="text-gray-400" /> Foto Cover
        </h3>

        {fotoPreview ? (
          <div className="relative mb-3 overflow-hidden rounded-lg">
            <img
              src={fotoPreview}
              alt="cover preview"
              className="h-36 w-full object-cover"
            />
            <button
              onClick={handleRemoveFoto}
              className="absolute top-2 right-2 rounded-full bg-red-500 p-1 text-white transition hover:bg-red-600"
            >
              <RiCloseLine />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mb-3 flex h-28 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-gray-400 transition hover:border-[#1e1f78] hover:text-[#1e1f78]"
          >
            <RiUploadCloud2Line size={28} className="mb-1" />
            <span className="text-xs">Klik untuk pilih foto</span>
            <span className="text-[11px] text-gray-400">
              JPG, PNG, WebP · Maks 5 MB
            </span>
          </button>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />

        {fotoPreview && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full text-center text-xs font-medium text-[#1e1f78] hover:underline"
          >
            Ganti foto
          </button>
        )}
      </div>

      {/* TAGS (Opsional) */}
      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700">
          <RiPriceTag3Line className="text-gray-400" /> Tags Artikel
        </h3>

        <div className="mb-3 flex flex-wrap gap-2">
          {(form.tags || []).map((tag, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-[#1e1f78]"
            >
              #{tag}
              <button
                type="button"
                onClick={() => {
                  const newTags = form.tags.filter((_, idx) => idx !== i);
                  onFormChange("tags", newTags);
                }}
                className="text-[#1e1f78] hover:text-red-500"
              >
                <RiCloseLine className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
        </div>

        <input
          type="text"
          placeholder="Ketik tag dan tekan Enter..."
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm transition-colors focus:border-[#1e1f78] focus:ring-1 focus:ring-[#1e1f78] focus:outline-none"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              const val = e.target.value.trim();
              if (val) {
                const currentTags = form.tags || [];
                if (!currentTags.includes(val) && currentTags.length < 10) {
                  onFormChange("tags", [...currentTags, val]);
                } else if (currentTags.length >= 10) {
                  toaster.warning("Maksimal 10 tag.");
                }
              }
              e.target.value = "";
            }
          }}
        />
      </div>

      {/* TIPS */}
      <div className="rounded-xl border bg-white shadow-sm">
        <button
          onClick={() => setShowTips(!showTips)}
          className="flex w-full items-center justify-between px-5 py-4"
        >
          <span className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <RiLightbulbLine /> Tips Menulis
          </span>
          {showTips ? <RiArrowUpSLine /> : <RiArrowDownSLine />}
        </button>
        {showTips && (
          <div className="space-y-3 border-t px-5 py-4 text-xs text-gray-600">
            <p>Gunakan judul yang jelas dan mudah dipahami.</p>
            <p>Mulai artikel dengan inti cerita.</p>
            <p>Gunakan foto agar artikel lebih menarik.</p>
            <p>Bagi artikel menjadi beberapa sub judul.</p>
            <p>Gunakan tag agar artikel lebih mudah ditemukan.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtikelSidebar;
