import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { asetAPI } from "../../../../services/api/routes/aset.route";
import { referensiAPI } from "../../../../services/api/routes/referensi.route";
import toaster from "../../../../utils/toaster";

function DaftarAset() {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [kategoriOptions, setKategoriOptions] = useState([]);

  const [query, setQuery] = useState({
    page: 1,
    per_page: 9,
    search: "",
    kategori_aset_id: "",
    status_aktif: "true",
    status_verifikasi: "terverifikasi",
    sort_by: "created_at",
    sort_order: "desc",
  });

  const fetchAset = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = Object.fromEntries(
        // eslint-disable-next-line no-unused-vars
        Object.entries(query).filter(([_, v]) => v !== ""),
      );
      const res = await asetAPI.getAll(params);
      setItems(res.data.data || []);
      setMeta(res.data.meta?.pagination);
    } catch (err) {
      setError("Gagal memuat data aset.");
      toaster.error(err.message || "Gagal memuat data aset.");
    } finally {
      setLoading(false);
    }
  };

  const fetchKategori = async () => {
    try {
      const res = await referensiAPI.getAll("kategori-aset");
      setKategoriOptions(res.data.data || []);
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    fetchKategori();
  }, []);

  useEffect(() => {
    fetchAset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.page, query.kategori_aset_id, query.sort_order]);

  const handleSearch = (e) => {
    e.preventDefault();
    setQuery((q) => ({ ...q, page: 1 }));
    fetchAset();
  };

  return (
    <div className="relative z-20 w-full bg-white px-4 py-8 md:px-6">
      <div className="mx-auto w-full max-w-7xl space-y-8">
        {/* Header & Filter */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-bold">Jejaring Aset</h2>
            <p className="mt-1 text-sm text-gray-500">
              {meta ? `${meta.total} fasilitas terdaftar` : ""}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                placeholder="Cari fasilitas..."
                value={query.search}
                onChange={(e) =>
                  setQuery((q) => ({ ...q, search: e.target.value }))
                }
                className="w-full rounded-l-full border border-gray-300 py-2 pr-4 pl-5 text-sm focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none sm:w-64"
              />
              <button
                type="submit"
                className="rounded-r-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
              >
                Cari
              </button>
            </form>

            <div className="flex gap-2">
              <div className="relative">
                <select
                  value={query.kategori_aset_id}
                  onChange={(e) =>
                    setQuery((q) => ({
                      ...q,
                      kategori_aset_id: e.target.value,
                      page: 1,
                    }))
                  }
                  className="w-full appearance-none rounded-full border border-emerald-600 bg-white py-2 pr-10 pl-5 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-50 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                >
                  <option value="">Semua Kategori</option>
                  {kategoriOptions.map((k) => (
                    <option key={k.id} value={k.id}>
                      {k.nama}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-4 text-emerald-600"
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

              <div className="relative">
                <select
                  value={query.sort_order}
                  onChange={(e) =>
                    setQuery((q) => ({
                      ...q,
                      sort_order: e.target.value,
                      page: 1,
                    }))
                  }
                  className="w-full appearance-none rounded-full border border-gray-300 bg-white py-2 pr-10 pl-5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                >
                  <option value="desc">Terbaru</option>
                  <option value="asc">Terlama</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-4 text-gray-500"
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

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="size-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 text-center text-red-500">
            <p>{error}</p>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500">
            <p>Belum ada aset terdaftar.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
            {items.map((item) => (
              <AsetItem key={item.id} data={item} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && meta && meta.total_pages > 1 && (
          <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-6 sm:flex-row">
            <span className="text-sm font-medium text-gray-500">
              Menampilkan {items.length} dari {meta.total} · Halaman {meta.page}{" "}
              / {meta.total_pages}
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={!meta.has_prev}
                onClick={() => setQuery((q) => ({ ...q, page: q.page - 1 }))}
                className="rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-gray-50 disabled:opacity-40"
              >
                Kembali
              </button>

              {/* Page Numbers — desktop only */}
              <div className="hidden gap-1 sm:flex">
                {Array.from({ length: meta.total_pages }, (_, i) => i + 1)
                  .filter((p) => {
                    if (meta.total_pages <= 5) return true;
                    if (p === 1 || p === meta.total_pages) return true;
                    return Math.abs(p - meta.page) <= 1;
                  })
                  .reduce((acc, p, i, arr) => {
                    if (i > 0 && p - arr[i - 1] > 1) acc.push("...");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i) =>
                    p === "..." ? (
                      <span
                        key={`dots-${i}`}
                        className="flex items-center px-1 text-gray-400"
                      >
                        ···
                      </span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setQuery((q) => ({ ...q, page: p }))}
                        className={`size-9 rounded-lg text-sm font-medium transition ${
                          p === meta.page
                            ? "bg-emerald-600 text-white shadow-sm"
                            : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {p}
                      </button>
                    ),
                  )}
              </div>

              <button
                disabled={!meta.has_next}
                onClick={() => setQuery((q) => ({ ...q, page: q.page + 1 }))}
                className="rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-gray-50 disabled:opacity-40"
              >
                Lanjut
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AsetItem({ data }) {
  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/10">
      {/* Image Container */}
      <div className="relative aspect-4/3 max-h-64 w-full overflow-hidden bg-gray-100">
        {data.pictures_urls && data.pictures_urls.length > 0 ? (
          <img
            src={data.pictures_urls[0]}
            alt={data.nama_aset}
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center font-bold text-gray-400">
            {data.nama_aset?.charAt(0)}
          </div>
        )}
        {/* Category Badge overlay */}
        <div className="absolute top-3 left-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold tracking-wider text-emerald-700 uppercase shadow-sm backdrop-blur-sm">
          {data.kategori_aset?.nama || "Aset"}
        </div>
        {/* Status indicator inline */}
        {data.status_aktif ? (
          <span className="absolute top-3 right-3 flex size-3">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex size-3 rounded-full bg-emerald-500 shadow-sm"></span>
          </span>
        ) : (
          <span className="absolute top-3 right-3 flex size-3">
            <span className="relative inline-flex size-3 rounded-full border border-white bg-red-500 shadow-sm"></span>
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <h3
          className="mb-1 line-clamp-1 text-lg font-bold text-gray-900 transition-colors group-hover:text-emerald-700"
          title={data.nama_aset}
        >
          {data.nama_aset}
        </h3>

        <div className="mt-2 mb-4 flex items-center gap-1.5 text-sm text-gray-500">
          <svg
            className="size-4 shrink-0 text-emerald-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0115 0z"
            />
          </svg>
          <span className="truncate">
            {data.kabupaten_kota || "Lokasi tidak diketahui"}
          </span>
        </div>

        {/* Footer / PIC */}
        <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-xs font-bold text-emerald-700">
              {data.penanggung_jawab?.charAt(0) || "U"}
            </div>
            <span className="truncate text-xs font-medium text-gray-600">
              {data.penanggung_jawab || "-"}
            </span>
          </div>
          <Link
            to={`/aset/${data.id}`}
            className="flex shrink-0 items-center justify-center rounded-full bg-emerald-50 p-2 text-emerald-600 transition-colors hover:bg-emerald-600 hover:text-white"
            title="Lihat Detail"
          >
            <svg
              className="size-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default DaftarAset;
