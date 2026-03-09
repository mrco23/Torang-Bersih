import React, { useState } from "react";

const FormTindakLanjut = ({ isOpen, onClose, laporanId }) => {
  // STATE MAPPING KE DATABASE
  const [tindakan, setTindakan] = useState("Pembersihan Penuh");
  const [kategoriInstitusi, setKategoriInstitusi] = useState("Komunitas");
  const [namaInstitusi, setNamaInstitusi] = useState("");
  const [foto, setFoto] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    const payloadTindakLanjut = {
      id_laporan: laporanId,
      tindak_lanjut_penanganan: tindakan,
      kategori_institusi: kategoriInstitusi,
      nama_institusi: namaInstitusi,
      foto_tindakan_file: foto,
    };

    console.log("Data siap dikirim ke Database:", payloadTindakLanjut);
    alert("Bukti penanganan berhasil dikirim! Laporan akan berstatus Selesai.");
    onClose();
  };

  return (
    // Tambahkan pt-20 agar modal agak ke bawah (tidak menabrak Navbar yang fixed di atas)
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pt-20 sm:p-6 sm:pt-24">
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

            {/* 4. FOTO TINDAKAN (Dibuat Lebih Pendek) */}
            <div className="mb-1">
              <label className="mb-1.5 block text-[13px] font-bold text-(--dark)">
                Bukti Foto Tindakan <span className="text-red-500">*</span>
              </label>
              <div className="group flex justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 px-4 py-5 transition-colors hover:border-(--primary) hover:bg-(--gray-shine)">
                <div className="text-center">
                  {foto ? (
                    <div className="flex flex-col items-center">
                      <div className="mb-2 flex size-10 items-center justify-center rounded-full bg-(--gray-shine) text-(--primary)">
                        <svg
                          className="size-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2.5"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <p className="text-xs font-bold text-(--primary)">
                        {foto.name}
                      </p>
                      <button
                        type="button"
                        onClick={() => setFoto(null)}
                        className="mt-1 text-[11px] font-semibold text-red-500 hover:underline"
                      >
                        Hapus file
                      </button>
                    </div>
                  ) : (
                    <>
                      <svg
                        className="mx-auto size-8 text-(--gray-placeholder) transition-colors group-hover:text-(--primary)"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                        />
                      </svg>
                      <div className="mt-2 flex justify-center text-xs leading-5 text-(--gray)">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md font-bold text-(--primary) focus-within:outline-none hover:text-(--primary-dark) hover:underline"
                        >
                          <span>Pilih file</span>
                          <input
                            id="file-upload"
                            type="file"
                            className="sr-only"
                            onChange={(e) => setFoto(e.target.files[0])}
                            required
                          />
                        </label>
                        <p className="pl-1">atau tarik ke sini</p>
                      </div>
                    </>
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
            className="rounded-lg px-4 py-2 text-xs font-bold text-(--gray) transition-colors hover:bg-gray-200 hover:text-(--dark) active:scale-95"
          >
            Batal
          </button>
          <button
            type="submit"
            form="form-tindak-lanjut"
            className="flex items-center gap-1.5 rounded-lg bg-(--primary) px-5 py-2 text-xs font-bold text-white shadow-md transition-all hover:bg-(--primary-dark) active:scale-95"
          >
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
            Kirim Bukti
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormTindakLanjut;
