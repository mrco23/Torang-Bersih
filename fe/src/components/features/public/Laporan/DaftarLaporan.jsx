import React, { useState, useEffect, useCallback } from "react";
import LaporanItem from "./LaporanItem";
import { laporanAPI } from "../../../../services/api/routes/laporan.route";
import { referensiAPI } from "../../../../services/api/routes/referensi.route";

const DaftarLaporan = () => {
  const [activeTab, setActiveTab] = useState("Semua");
  const tabs = ["Semua", "Diterima", "Ditindak", "Selesai"];

  const [laporanList, setLaporanList] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [jenisOptions, setJenisOptions] = useState([]);
  const [query, setQuery] = useState({
    page: 1,
    search: "",
    jenis_sampah_id: "",
  });

  const fetchJenis = async () => {
    try {
      const res = await referensiAPI.getAll("jenis-sampah");
      setJenisOptions(res.data.data || []);
    } catch {
      /* ignore */
    }
  };

  const fetchLaporan = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: query.page,
        per_page: 10, // Default items per page
      };

      if (query.search) params.search = query.search;
      if (query.jenis_sampah_id) params.jenis_sampah_id = query.jenis_sampah_id;

      if (activeTab !== "Semua") {
        params.status_laporan = activeTab.toLowerCase();
      } else {
        params.status_laporan = "diterima,ditindak,selesai";
      }

      const response = await laporanAPI.getAll(params);
      setLaporanList(response.data.data.items || response.data.data || []);
      setMeta(response.data.meta?.pagination || null);
    } catch (err) {
      console.error("Failed to fetch laporan", err.response?.data);
      setError("Gagal memuat data laporan.");
    } finally {
      setLoading(false);
    }
  }, [activeTab, query.page, query.search, query.jenis_sampah_id]);

  useEffect(() => {
    fetchJenis();
  }, []);

  useEffect(() => {
    fetchLaporan();
  }, [fetchLaporan]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setQuery((q) => ({ ...q, page: 1 }));
    // fetchLaporan will be triggered by useEffect
  };

  return (
    <section className="relative z-10 mx-auto w-full max-w-7xl">
      {/* Header & Filter */}
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
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

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <form onSubmit={handleSearchSubmit} className="flex">
            <input
              type="text"
              placeholder="Cari laporan..."
              value={query.search}
              onChange={(e) => setQuery((q) => ({ ...q, search: e.target.value }))}
              className="w-full rounded-l-full border border-gray-300 py-2 pr-4 pl-5 text-sm focus:border-gray-900 focus:ring-1 focus:ring-gray-900 focus:outline-none sm:w-64"
            />
            <button
              type="submit"
              className="rounded-r-full bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              Cari
            </button>
          </form>

          <div className="flex gap-2">
            <div className="relative">
              <select
                value={query.jenis_sampah_id}
                onChange={(e) =>
                  setQuery((q) => ({
                    ...q,
                    jenis_sampah_id: e.target.value,
                    page: 1,
                  }))
                }
                className="w-full appearance-none rounded-full border border-gray-900 bg-white py-2 pr-10 pl-5 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50 focus:ring-1 focus:ring-gray-900 focus:outline-none"
              >
                <option value="">Semua Jenis</option>
                {jenisOptions.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.nama}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-4 text-gray-900"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Filter */}
      <div className="mb-8">
        <div className="scrollbar-hide flex overflow-x-auto rounded-full bg-white p-1.5 shadow-sm ring-1 ring-gray-900/5 sm:w-fit border border-gray-100">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setQuery((q) => ({ ...q, page: 1 }));
              }}
              className={`rounded-full px-5 py-2 text-sm font-bold whitespace-nowrap transition-all duration-300 ${
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

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="size-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#1e1f78]"></div>
        </div>
      ) : error ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-3xl bg-red-50 text-red-600 ring-1 ring-red-100">
          <p className="font-semibold">{error}</p>
          <button
            onClick={fetchLaporan}
            className="mt-4 text-sm underline hover:text-red-800"
          >
            Coba Lagi
          </button>
        </div>
      ) : laporanList.length > 0 ? (
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            {laporanList.map((laporan) => (
              <LaporanItem key={laporan.id} data={laporan} />
            ))}
          </div>

          {/* Pagination */}
          {meta && meta.total_pages > 1 && (
            <div className="mt-4 flex flex-col items-center justify-between gap-4 rounded-3xl bg-white px-6 py-4 shadow-sm ring-1 ring-gray-900/5 sm:flex-row">
              <span className="text-sm font-medium text-gray-500">
                Menampilkan{" "}
                <strong className="text-gray-900">{laporanList.length}</strong>{" "}
                dari <strong className="text-gray-900">{meta.total}</strong>{" "}
                laporan
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={!meta.has_prev}
                  onClick={() => setQuery((q) => ({ ...q, page: q.page - 1 }))}
                  className="flex items-center justify-center rounded-xl bg-gray-50 px-4 py-2 text-sm font-bold text-gray-700 ring-1 ring-gray-200 transition ring-inset hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  ← Seb.
                </button>
                <div className="flex items-center justify-center rounded-xl bg-gray-900 px-4 py-2 text-sm font-bold text-white shadow-md">
                  {meta.page} / {meta.total_pages}
                </div>
                <button
                  disabled={!meta.has_next}
                  onClick={() => setQuery((q) => ({ ...q, page: q.page + 1 }))}
                  className="flex items-center justify-center rounded-xl bg-gray-50 px-4 py-2 text-sm font-bold text-gray-700 ring-1 ring-gray-200 transition ring-inset hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Selan. →
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Empty State */
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
            Belum ada aduan yang sesuai dengan kriteria filter {activeTab}.
          </p>
        </div>
      )}
    </section>
  );
};

export default DaftarLaporan;
