import React, { useState, useEffect } from "react";
import {
  RiCloseLine,
  RiSaveLine,
  RiImageLine,
  RiPriceTag3Line,
  RiSettings4Line,
} from "react-icons/ri";
import ArtikelEditor from "../../public/artikel/BuatArtikel/ArtikelEditor";
import { referensiAPI } from "../../../../services/api/routes/referensi.route";
import toaster from "../../../../utils/toaster";

export default function ArtikelEditModal({
  isOpen,
  onClose,
  article,
  onSave,
  updating = false,
}) {
  const [form, setForm] = useState({
    judul_artikel: "",
    konten_teks: "",
    kategori_id: "",
    tags: [],
    status_publikasi: "draft",
  });
  const [fotoFile, setFotoFile] = useState(null);
  const [fotoPreview, setFotoPreview] = useState("");
  const [categories, setCategories] = useState([]);
  const [tagInput, setTagInput] = useState("");

  // Initialize form when article changes
  useEffect(() => {
    if (article) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        judul_artikel: article.judul_artikel || "",
        konten_teks: article.konten_teks || "",
        kategori_id: article.kategori?.id || article.kategori_id || "",
        tags: article.tags || [],
        status_publikasi: article.status_publikasi || "draft",
      });
      setFotoPreview(article.foto_cover_url || "");
    }
  }, [article]);

  // Fetch categories
  useEffect(() => {
    if (isOpen) {
      const fetchCategories = async () => {
        try {
          const res = await referensiAPI.getAll("kategori-artikel", {
            include_inactive: true,
          });
          setCategories(res.data?.data || []);
        } catch (err) {
          console.error("Gagal memuat kategori:", err);
          toaster.error("Gagal memuat daftar kategori artikel.");
        }
      };
      fetchCategories();
    }
  }, [isOpen]);

  if (!isOpen || !article) return null;

  const handleJudulChange = (val) =>
    setForm((prev) => ({ ...prev, judul_artikel: val }));
  const handleKontenChange = (val) =>
    setForm((prev) => ({ ...prev, konten_teks: val }));

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setFotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const addTag = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = tagInput.trim().replace(/,/g, "");
      if (val && !form.tags.includes(val)) {
        setForm((prev) => ({ ...prev, tags: [...prev.tags, val] }));
      }
      setTagInput("");
    }
  };

  const removeTag = (tag) => {
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
  };

  const handleSubmit = async () => {
    if (!form.judul_artikel.trim())
      return toaster.error("Judul tidak boleh kosong");
    const success = await onSave(form, fotoFile);
    if (success) {
      if (success.message) {
        toaster.success(success.message);
      } else {
        toaster.success("Artikel berhasil diperbarui");
      }
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative flex h-full max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Isi Artikel</h2>
            <p className="text-xs text-gray-500">
              Sesuaikan konten dan data publikasi artikelmu.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <RiCloseLine className="h-6 w-6" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Left: Editor */}
            <div className="lg:col-span-2">
              <ArtikelEditor
                judul={form.judul_artikel}
                konten={form.konten_teks}
                onJudulChange={handleJudulChange}
                onKontenChange={handleKontenChange}
              />
            </div>

            {/* Right: Sidebar / Configuration */}
            <div className="space-y-6">
              {/* Cover Image */}
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <label className="mb-2 block text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                  Foto Cover
                </label>
                <div
                  className="group relative h-40 w-full overflow-hidden rounded-lg border-2 border-dashed border-gray-200 bg-white"
                  onClick={() =>
                    document.getElementById("edit-foto-cover").click()
                  }
                >
                  {fotoPreview ? (
                    <img
                      src={fotoPreview}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-2 text-gray-400 group-hover:text-[#1e1f78]">
                      <RiImageLine className="h-10 w-10" />
                      <span className="text-[11px]">Klik untuk ganti foto</span>
                    </div>
                  )}
                  <input
                    id="edit-foto-cover"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFotoChange}
                  />
                  {fotoPreview && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                      <span className="text-xs font-bold text-white">
                        Ganti Foto
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Kategori & Tags */}
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <label className="mb-3 block text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                  Kategori & Tags
                </label>

                {/* Kategori */}
                <div className="mb-4">
                  <p className="mb-1.5 text-xs font-semibold text-gray-700">
                    Pilih Kategori
                  </p>
                  <select
                    value={form.kategori_id}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        kategori_id: e.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#1e1f78]"
                  >
                    <option value="">Pilih Kategori...</option>
                    {categories
                      .filter(
                        (cat) => cat.is_active || cat.id === form.kategori_id,
                      )
                      .map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.nama} {!cat.is_active && "(Nonaktif)"}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Tags */}
                <div>
                  <p className="mb-1.5 text-xs font-semibold text-gray-700">
                    Tags (pisahkan dengan koma)
                  </p>
                  <div className="flex flex-wrap gap-2 rounded-lg border border-gray-200 bg-white p-2 focus-within:border-[#1e1f78]">
                    {form.tags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-1 rounded bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700"
                      >
                        {tag}
                        <button onClick={() => removeTag(tag)}>
                          <RiCloseLine className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={addTag}
                      className="min-w-[60px] flex-1 text-sm outline-none"
                      placeholder="Tambah..."
                    />
                  </div>
                </div>
              </div>

              {/* Status Publikasi */}
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <label className="mb-3 block text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                  <RiSettings4Line className="mr-1 inline h-3 w-3" /> Status
                  Publikasi
                </label>
                <div className="flex gap-2">
                  {["draft", "published"].map((status) => (
                    <button
                      key={status}
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          status_publikasi: status,
                        }))
                      }
                      className={`flex-1 rounded-lg py-2 text-xs font-bold capitalize transition-all ${
                        form.status_publikasi === status
                          ? status === "published"
                            ? "bg-green-600 text-white shadow-md ring-2 ring-green-100"
                            : "bg-amber-400 text-white shadow-md ring-2 ring-amber-100"
                          : "bg-white text-gray-500 hover:bg-gray-100"
                      }`}
                    >
                      {status === "published" ? "Publikasi" : "Simpan Draf"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t bg-gray-50 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-800"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={updating}
            className="flex items-center gap-2 rounded-xl bg-[#1e1f78] px-6 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-[#1a1b65] disabled:opacity-50"
          >
            {updating ? (
              <span className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Menyimpan...
              </span>
            ) : (
              <>
                <RiSaveLine className="h-4 w-4" />
                Simpan Perubahan
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
