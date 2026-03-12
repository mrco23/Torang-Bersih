import React, { useState } from "react";
import { laporanAPI } from "../../../../services/api/routes/laporan.route";
import toaster from "../../../../utils/toaster";

const FormTindakLanjut = ({ isOpen, onClose, laporanId }) => {
  // STATE MAPPING KE DATABASE
  const [tindakan, setTindakan] = useState("Pembersihan Penuh");
  const [kategoriInstitusi, setKategoriInstitusi] = useState("Komunitas");
  const [namaInstitusi, setNamaInstitusi] = useState("");
  const [catatan, setCatatan] = useState("");
  const [fotoSebelum, setFotoSebelum] = useState(null);
  const [previewSebelum, setPreviewSebelum] = useState(null);
  const [fotoSetelah, setFotoSetelah] = useState(null);
  const [previewSetelah, setPreviewSetelah] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fotoSetelah) {
      toaster.warning("Bukti foto setelah tindakan wajib diunggah.");
      return;
    }

    setSubmitting(true);
    try {
      const payloadTindakLanjut = {
        tindak_lanjut_penanganan: tindakan,
        tim_penindak: `${kategoriInstitusi} - ${namaInstitusi}`,
        catatan: catatan,
      };

      const fotoFiles = {
        ...(fotoSebelum && { foto_sebelum: [fotoSebelum] }),
        foto_setelah: [fotoSetelah],
      };

      await laporanAPI.createTindakLanjut(
        laporanId,
        payloadTindakLanjut,
        fotoFiles,
      );

      toaster.success(
        "Bukti penanganan berhasil dikirim! Status laporan akan diperbarui.",
      );

      // Reset form
      setTindakan("Pembersihan Penuh");
      setKategoriInstitusi("Komunitas");
      setNamaInstitusi("");
      setCatatan("");
      setFotoSebelum(null);
      setPreviewSebelum(null);
      setFotoSetelah(null);
      setPreviewSetelah(null);

      onClose();
    } catch (error) {
      console.error("Gagal mengirim tindak lanjut:", error);
      toaster.error("Gagal mengirim bukti penanganan. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    // Tambahkan pt-20 agar modal agak ke bawah (tidak menabrak Navbar yang fixed di atas)
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pt-20 sm:p-6 sm:pt-24">
      {/* Latar Belakang Blur */}
      <div
        className="backdrop-blur-s absolute inset-0 bg-gray-900/60 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Kontainer Modal: Dibuat lebih pendek (max-h-[75vh] atau 80vh) agar responsif */}
      <div className="animate-in fade-in zoom-in-95 relative flex max-h-[80vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-gray-900/5 duration-200">
        {/* Header Form - Dipersempit padding vertikalnya (py-4) */}
        <div className="shrink-0 border-b border-gray-100 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-(--dark)">
                Form Tindak Lanjut
              </h2>
              <p className="text-xs font-medium text-(--gray)">
                Laporan ID: {laporanId}
              </p>
            </div>
            <button
              onClick={onClose}
              className="flex size-7 items-center justify-center rounded-full bg-(--gray-shine) text-(--gray-muted) transition-colors hover:bg-red-50 hover:text-red-500"
            >
              <svg
                className="size-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Isi Form (Scrollable) - Dipersempit gap/margin (mb-4 bukan mb-6) */}
        <div className="scrollbar-hide overflow-y-auto px-6 py-5">
          <form id="form-tindak-lanjut" onSubmit={handleSubmit}>
            {/* 1. KATEGORI INSTITUSI */}
            <div className="mb-4">
              <label className="mb-2 block text-[13px] font-bold text-(--dark)">
                Mewakili Kategori Apa? <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {["Pemerintah", "Komunitas", "Public"].map((kat) => (
                  <label
                    key={kat}
                    className={`flex cursor-pointer items-center justify-center rounded-lg border px-2 py-2 text-xs font-bold transition-all ${
                      kategoriInstitusi === kat
                        ? "border-(--primary) bg-(--gray-shine) text-(--primary) ring-1 ring-(--primary)"
                        : "border-gray-200 bg-white text-(--gray) hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="kategori_institusi"
                      value={kat}
                      className="sr-only"
                      onChange={(e) => setKategoriInstitusi(e.target.value)}
                    />
                    <span className="truncate">{kat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 2. NAMA INSTITUSI */}
            <div className="mb-4">
              <label
                htmlFor="nama_institusi"
                className="mb-1.5 block text-[13px] font-bold text-(--dark)"
              >
                Nama Institusi / Penindak{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="nama_institusi"
                required
                className="block w-full rounded-lg border-0 bg-gray-50 px-3 py-2.5 text-sm text-(--dark-text) ring-1 ring-gray-200 transition-all ring-inset placeholder:text-(--gray-placeholder) focus:bg-white focus:ring-2 focus:ring-(--primary) focus:ring-inset"
                placeholder="Contoh: DLH Manado / Trash Hero"
                value={namaInstitusi}
                onChange={(e) => setNamaInstitusi(e.target.value)}
              />
            </div>

            {/* 3. TINDAKAN PENANGANAN */}
            <div className="mb-4">
              <label
                htmlFor="tindakan"
                className="mb-1.5 block text-[13px] font-bold text-(--dark)"
              >
                Jenis Tindakan <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="tindakan"
                  required
                  className="block w-full appearance-none rounded-lg border-0 bg-gray-50 px-3 py-2.5 text-sm font-medium text-(--dark-text) ring-1 ring-gray-200 transition-all ring-inset focus:bg-white focus:ring-2 focus:ring-(--primary) focus:ring-inset"
                  value={tindakan}
                  onChange={(e) => setTindakan(e.target.value)}
                >
                  <option value="Pembersihan Penuh">
                    Pembersihan Penuh (Selesai)
                  </option>
                  <option value="Pengangkutan Sebagian">
                    Pengangkutan Sebagian
                  </option>
                  <option value="Survei Lokasi">
                    Survei & Pemasangan Larangan
                  </option>
                  <option value="Edukasi Warga Sekitar">
                    Edukasi Warga Sekitar
                  </option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-(--gray)">
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
              </div>
            </div>

            {/* 4. CATATAN (Opsional) */}
            <div className="mb-4">
              <label
                htmlFor="catatan"
                className="mb-1.5 block text-[13px] font-bold text-(--dark)"
              >
                Catatan (Opsional)
              </label>
              <textarea
                id="catatan"
                rows="2"
                className="block w-full resize-none rounded-lg border-0 bg-gray-50 px-3 py-2.5 text-sm text-(--dark-text) ring-1 ring-gray-200 transition-all ring-inset placeholder:text-(--gray-placeholder) focus:bg-white focus:ring-2 focus:ring-(--primary) focus:ring-inset"
                placeholder="Tambahkan detail penanganan atau kendala (jika ada)"
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
              ></textarea>
            </div>

            {/* 4. FOTO TINDAKAN (Sebelum & Setelah) */}
            <div className="mb-1 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Foto Sebelum */}
              <div>
                <label className="mb-1.5 block text-[13px] font-bold text-(--dark)">
                  Foto Sebelum (Opsional)
                </label>
                <div className="relative group flex justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 transition-colors hover:border-(--primary) hover:bg-(--gray-shine) overflow-hidden h-32">
                  <input 
                    id="file-upload-sebelum" 
                    type="file" 
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setFotoSebelum(file);
                        setPreviewSebelum(URL.createObjectURL(file));
                      }
                    }} 
                  />
                  {previewSebelum ? (
                    <div className="absolute inset-0 w-full h-full">
                      <img src={previewSebelum} alt="Preview Sebelum" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
                        <span className="text-white text-[11px] font-bold ring-1 ring-white/50 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm">Ganti Foto</span>
                      </div>
                      <button 
                        type="button" 
                        onClick={(e) => {
                          e.preventDefault();
                          setFotoSebelum(null);
                          setPreviewSebelum(null);
                          document.getElementById("file-upload-sebelum").value = "";
                        }} 
                        className="absolute top-2 right-2 flex size-6 items-center justify-center rounded-full bg-white/90 text-red-500 hover:bg-red-500 hover:text-white transition z-30 shadow-sm cursor-pointer border border-red-100"
                        style={{ zIndex: 30 }}
                      >
                        <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center pointer-events-none">
                      <svg className="size-6 mb-2 text-(--gray-placeholder) transition-colors group-hover:text-(--primary)" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                      </svg>
                      <div className="text-[11px] font-medium text-(--gray)">
                        <span className="font-bold text-(--primary) group-hover:underline">Klik untuk unggah</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Foto Setelah */}
              <div>
                <label className="mb-1.5 block text-[13px] font-bold text-(--dark)">
                  Foto Setelah <span className="text-red-500">*</span>
                </label>
                <div className="relative group flex justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 transition-colors hover:border-(--primary) hover:bg-(--gray-shine) overflow-hidden h-32">
                  <input 
                    id="file-upload-setelah" 
                    type="file" 
                    accept="image/*"
                    required={!fotoSetelah}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setFotoSetelah(file);
                        setPreviewSetelah(URL.createObjectURL(file));
                      }
                    }} 
                  />
                  {previewSetelah ? (
                    <div className="absolute inset-0 w-full h-full">
                      <img src={previewSetelah} alt="Preview Setelah" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
                        <span className="text-white text-[11px] font-bold ring-1 ring-white/50 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm">Ganti Foto</span>
                      </div>
                      <button 
                        type="button" 
                        onClick={(e) => {
                          e.preventDefault();
                          setFotoSetelah(null);
                          setPreviewSetelah(null);
                          document.getElementById("file-upload-setelah").value = "";
                        }} 
                        className="absolute top-2 right-2 flex size-6 items-center justify-center rounded-full bg-white/90 text-red-500 hover:bg-red-500 hover:text-white transition z-30 shadow-sm cursor-pointer border border-red-100"
                        style={{ zIndex: 30 }}
                      >
                        <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center pointer-events-none">
                      <svg className="size-6 mb-2 text-(--gray-placeholder) transition-colors group-hover:text-(--primary)" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                      </svg>
                      <div className="text-[11px] font-medium text-(--gray)">
                        <span className="font-bold text-(--primary) group-hover:underline">Klik untuk unggah</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer Form - Tombol Aksi */}
        <div className="flex shrink-0 items-center justify-end gap-3 border-t border-gray-100 bg-gray-50/80 px-6 py-3.5">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-lg px-4 py-2 text-xs font-bold text-(--gray) transition-colors hover:bg-gray-200 hover:text-(--dark) active:scale-95 disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="submit"
            form="form-tindak-lanjut"
            disabled={submitting}
            className="flex items-center gap-1.5 rounded-lg bg-(--primary) px-5 py-2 text-xs font-bold text-white shadow-md transition-all hover:bg-(--primary-dark) active:scale-95 disabled:cursor-not-allowed disabled:opacity-75"
          >
            {submitting ? (
              <div className="size-3.5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            ) : (
              <svg
                className="size-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            )}
            {submitting ? "Mengirim..." : "Kirim Bukti"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormTindakLanjut;
