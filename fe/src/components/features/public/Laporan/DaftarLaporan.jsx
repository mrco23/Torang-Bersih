import React, { useState } from "react";
import LaporanItem from "./LaporanItem";

const DaftarLaporan = () => {
  const [activeTab, setActiveTab] = useState("Semua");
  const tabs = ["Semua", "Menunggu", "Selesai"];

  // DATA DUMMY (Dipetakan persis dari tabel laporan_sampah_ilegal)
  const laporanList = [
    {
      id: "REP-2026-001",
      id_warga: "USR-0921",
      nama_pelapor: "Warga Peduli (Anonim)",
      foto_bukti_urls: [
        "https://images.unsplash.com/photo-1618477461853-cf6ed80fbfc5?auto=format&fit=crop&w=300&q=80",
      ],
      latitude: 1.455,
      longitude: 124.832,
      alamat_lokasi:
        "Samping jembatan kuning, Jl. Pinggir Sungai Bahu, Kec. Malalayang, Kota Manado",
      jenis_sampah: "Plastik & Residu",
      estimasi_berat_kg: 150.5,
      karakteristik: "Sulit Didaur Ulang",
      bentuk_timbulan: "Menumpuk",
      status_laporan: "Menunggu",
      tanggal_lapor: "2026-03-08T08:30:00Z",
    },
    {
      id: "REP-2026-002",
      id_warga: "USR-0105",
      nama_pelapor: "Daniel",
      foto_bukti_urls: [
        "https://images.unsplash.com/photo-1594705597409-bb4c86ebdc55?auto=format&fit=crop&w=300&q=80",
      ],
      latitude: 1.487,
      longitude: 124.8315,
      alamat_lokasi:
        "Belakang Pasar Bersehati, Calaca, Kec. Wenang, Kota Manado",
      jenis_sampah: "Organik & Pasar",
      estimasi_berat_kg: 320.0,
      karakteristik: "Mudah Membusuk",
      bentuk_timbulan: "Tercecer",
      status_laporan: "Selesai",
      tanggal_lapor: "2026-03-07T14:15:00Z",
    },
    {
      id: "REP-2026-003",
      id_warga: "USR-0442",
      nama_pelapor: "Ibu Sarah",
      foto_bukti_urls: [
        "https://images.unsplash.com/photo-1588609536893-7814cc5d9eb3?auto=format&fit=crop&w=300&q=80",
      ],
      latitude: 1.305,
      longitude: 124.9125,
      alamat_lokasi:
        "Kawasan Hutan Lindung Gunung Tumpa, Kec. Bunaken, Kota Manado",
      jenis_sampah: "Tekstil & Pakaian Bekas",
      estimasi_berat_kg: 45.0,
      karakteristik: "Bisa Didaur Ulang",
      bentuk_timbulan: "Menumpuk (Dalam Karung)",
      status_laporan: "Selesai",
      tanggal_lapor: "2026-03-05T09:45:00Z",
    },
  ];

  // Logic Filter berdasarkan Status Laporan
  const filteredData =
    activeTab === "Semua"
      ? laporanList
      : laporanList.filter((item) => item.status_laporan === activeTab);

  return (
    <section className="relative z-10 mx-auto w-full max-w-[1190px] px-4 py-16 sm:px-6 lg:px-8">
      {/* Bagian Filter Modern (Segmented Control Style) */}
      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">
            Pusat Laporan Warga
          </h2>
          <p className="mt-1 text-sm font-medium text-gray-500">
            {activeTab === "Semua"
              ? "Menampilkan seluruh aduan tumpukan sampah."
              : `Menampilkan laporan dengan status "${activeTab}".`}
          </p>
        </div>

        {/* Tab Filters (Scrollable on Mobile) */}
        <div className="scrollbar-hide flex overflow-x-auto rounded-2xl bg-white p-1.5 shadow-sm ring-1 ring-gray-900/5">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-xl px-5 py-2.5 text-sm font-bold whitespace-nowrap transition-all duration-300 ${
                activeTab === tab
                  ? "bg-gray-900 text-white shadow-md"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Render List Data */}
      {filteredData.length > 0 ? (
        <div className="flex flex-col gap-4">
          {filteredData.map((laporan) => (
            <LaporanItem key={laporan.id} data={laporan} />
          ))}
        </div>
      ) : (
        /* Empty State jika filter kosong */
        <div className="flex flex-col items-center justify-center rounded-3xl bg-white py-20 shadow-sm ring-1 ring-gray-900/5">
          <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-gray-100 text-gray-400">
            <svg
              className="size-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-gray-900">
            Tidak ada laporan ditemukan
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Belum ada aduan dengan status {activeTab}.
          </p>
        </div>
      )}
    </section>
  );
};

export default DaftarLaporan;
