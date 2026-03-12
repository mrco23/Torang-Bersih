import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { kolaboratorAPI } from "../../../../services/api/routes/kolaborator.route";
import { referensiAPI } from "../../../../services/api/routes/referensi.route";

function DaftarKolaborator() {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jenisOptions, setJenisOptions] = useState([]);

  const [query, setQuery] = useState({
    page: 1,
    per_page: 10,
    search: "",
    jenis_kolaborator_id: "",
    status_aktif: "true",
    status_verifikasi: "terverifikasi",
    sort_by: "created_at",
    sort_order: "desc",
  });

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = Object.fromEntries(
        // eslint-disable-next-line no-unused-vars
        Object.entries(query).filter(([_, v]) => v !== ""),
      );
      const res = await kolaboratorAPI.getAll(params);
      setItems(res.data.data);
      setMeta(res.data.meta?.pagination);
    } catch (err) {
      setError(
        err.response?.data?.message || "Gagal memuat daftar kolaborator",
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchJenis = async () => {
    try {
      const res = await referensiAPI.getAll("jenis-kolaborator");
      setJenisOptions(res.data.data || []);
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    fetchJenis();
  }, []);

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.page, query.jenis_kolaborator_id, query.sort_order]);

  const handleSearch = (e) => {
    e.preventDefault();
    setQuery((q) => ({ ...q, page: 1 }));
    fetchItems();
  };

  return (
    <div className="z-9999 w-full bg-white px-4 py-8 md:px-6">
      <div className="mx-auto w-full max-w-7xl space-y-8">
        {/* Header & Filter */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-3xl font-bold">Daftar Kolaborator</p>
            {meta && (
              <p className="mt-1 text-sm text-gray-500">
                {meta.total} kolaborator terverifikasi
              </p>
            )}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                placeholder="Cari organisasi..."
                value={query.search}
                onChange={(e) =>
                  setQuery((q) => ({ ...q, search: e.target.value }))
                }
                className="w-full rounded-l-full border border-gray-300 py-2 pr-4 pl-5 text-sm focus:border-(--primary) focus:ring-1 focus:ring-(--primary) focus:outline-none sm:w-64"
              />
              <button
                type="submit"
                className="rounded-r-full bg-(--primary) px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
              >
                Cari
              </button>
            </form>

            <div className="flex gap-2">
              <div className="relative">
                <select
                  value={query.jenis_kolaborator_id}
                  onChange={(e) =>
                    setQuery((q) => ({
                      ...q,
                      jenis_kolaborator_id: e.target.value,
                      page: 1,
                    }))
                  }
                  className="w-full appearance-none rounded-full border border-(--primary) bg-white py-2 pr-10 pl-5 font-medium text-(--primary) transition-colors hover:bg-indigo-50 focus:ring-1 focus:ring-(--primary) focus:outline-none"
                >
                  <option value="">Semua Kategori</option>
                  {jenisOptions.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.nama}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-(--primary)"
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
                  className="w-full appearance-none rounded-full border border-gray-300 bg-white py-2 pr-10 pl-5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:ring-1 focus:ring-(--primary) focus:outline-none"
                >
                  <option value="desc">Terbaru</option>
                  <option value="asc">Terlama</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-500"
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

        {/* Desktop Table Header */}
        <div className="hidden md:block">
          <div className="mb-4 grid grid-cols-12 gap-4 border-b-[3px] border-slate-200 pb-3 text-lg font-bold text-black">
            <div className="col-span-3 pl-8 text-center">Nama</div>
            <div className="col-span-2 text-center">Kategori</div>
            <div className="col-span-3 text-left">Lokasi</div>
            <div className="col-span-2 text-center">Penanggung Jawab</div>
            <div className="col-span-2 text-center">Kontak</div>
          </div>
        </div>

        {/* Items */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center p-10">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-(--primary) border-t-transparent" />
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">{error}</div>
          ) : items.length === 0 ? (
            <div className="p-8 text-center font-medium text-gray-400">
              Belum ada kolaborator yang ditemukan.
            </div>
          ) : (
            items.map((item) => <KolaboratorRow key={item.id} item={item} />)
          )}
        </div>

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
                            ? "bg-(--primary) text-white shadow-sm"
                            : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {p}
                      </button>
                    ),
                  )}
              </div>

              {/* Mobile page indicator */}
              <div className="flex items-center justify-center rounded-lg bg-(--primary) px-4 py-2 font-medium text-white shadow-sm sm:hidden">
                Hal {meta.page}
              </div>

              <button
                disabled={!meta.has_next}
                onClick={() => setQuery((q) => ({ ...q, page: q.page + 1 }))}
                className="rounded-lg border px-4 py-2 text-sm font-medium transition hover:bg-gray-50 disabled:opacity-40"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Desktop: Original row style ── */
/* ── Mobile:  Card layout ── */
function KolaboratorRow({ item }) {
  return (
    <>
      {/* Desktop Row */}
      <div className="hidden min-h-[84px] overflow-hidden rounded-md border border-gray-200 bg-white py-2 shadow-sm transition hover:shadow-md md:flex">
        <div className="w-[42px] shrink-0 bg-[#22247A]"></div>
        <div className="grid flex-1 grid-cols-12 items-center gap-4 pr-6 pl-5">
          <div className="col-span-3 flex items-center gap-4">
            {item.logo_url ? (
              <img
                src={item.logo_url}
                alt={item.nama_organisasi}
                className="size-[52px] shrink-0 rounded-full border border-gray-100 object-cover"
              />
            ) : (
              <div className="flex size-[52px] shrink-0 items-center justify-center rounded-full bg-[#1A3084] text-lg font-bold text-white">
                {item.nama_organisasi?.charAt(0)}
              </div>
            )}
            <span className="line-clamp-2 text-[14px] font-semibold text-[#20257B]">
              {item.nama_organisasi}
            </span>
          </div>
          <div className="col-span-2 text-center text-[13px] font-medium text-gray-800">
            {item.jenis_kolaborator?.nama || "-"}
          </div>
          <div className="col-span-3 text-left text-[13px] leading-tight font-medium text-gray-800">
            <p>{item.kabupaten_kota || "-"}</p>
            {item.alamat_lengkap && (
              <p className="mt-0.5 line-clamp-1 text-[11px] text-gray-400">
                {item.alamat_lengkap}
              </p>
            )}
          </div>
          <div className="col-span-2 text-center text-[13px] font-medium text-gray-800">
            <span className="line-clamp-2">{item.penanggung_jawab || "-"}</span>
          </div>
          <div className="col-span-2 flex items-center justify-between pl-2 text-[13px] font-medium text-gray-800">
            <div className="min-w-0 flex-1">
              {item.kontak && (
                <p className="truncate text-[12px] text-gray-600">
                  {item.kontak}
                </p>
              )}
              {item.email && (
                <p className="truncate text-[11px] text-gray-400">
                  {item.email}
                </p>
              )}
              {!item.kontak && !item.email && <span>-</span>}
            </div>
            <Link
              to={`/kolaborator/${item.id}`}
              className="ml-3 shrink-0 transition-transform hover:scale-110"
            >
              <svg
                className="h-[24px] w-[24px] sm:h-[30px] sm:w-[30px]"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.125 10C7.95924 10 7.80027 10.0658 7.68306 10.1831C7.56585 10.3003 7.5 10.4592 7.5 10.625V33.125C7.5 33.6223 7.30246 34.0992 6.95083 34.4508C6.59919 34.8025 6.12228 35 5.625 35H1.875C1.37772 35 0.900805 34.8025 0.549175 34.4508C0.197544 34.0992 0 33.6223 0 33.125C0 32.6277 0.197544 32.1508 0.549175 31.7992C0.900805 31.4475 1.37772 31.25 1.875 31.25H3.75V10.625C3.75 8.21 5.71 6.25 8.125 6.25H31.875C34.29 6.25 36.25 8.21 36.25 10.625V31.25H38.125C38.6223 31.25 39.0992 31.4475 39.4508 31.7992C39.8025 32.1508 40 32.6277 40 33.125C40 33.6223 39.8025 34.0992 39.4508 34.4508C39.0992 34.8025 38.6223 35 38.125 35H34.375C33.8777 35 33.4008 34.8025 33.0492 34.4508C32.6975 34.0992 32.5 33.6223 32.5 33.125V10.625C32.5 10.4592 32.4342 10.3003 32.3169 10.1831C32.1997 10.0658 32.0408 10 31.875 10H8.125Z"
                  fill="#1E1F78"
                />
                <path
                  d="M19.9249 19.925L13.0499 26.8C12.8657 26.9717 12.7179 27.1787 12.6154 27.4087C12.513 27.6387 12.4579 27.8869 12.4534 28.1387C12.449 28.3905 12.4953 28.6405 12.5896 28.874C12.6839 29.1075 12.8243 29.3195 13.0023 29.4976C13.1803 29.6756 13.3924 29.816 13.6259 29.9103C13.8594 30.0046 14.1094 30.0509 14.3612 30.0465C14.613 30.042 14.8612 29.9869 15.0912 29.8845C15.3212 29.782 15.5282 29.6342 15.6999 29.45L22.5749 22.575L26.4324 26.4325C26.5198 26.5201 26.6313 26.5798 26.7527 26.604C26.874 26.6283 26.9999 26.6159 27.1142 26.5685C27.2286 26.5211 27.3263 26.4408 27.3949 26.3378C27.4636 26.2348 27.5001 26.1138 27.4999 25.99V15.625C27.4999 15.4592 27.434 15.3003 27.3168 15.1831C27.1996 15.0658 27.0407 15 26.8749 15H16.5099C16.3861 14.9998 16.2651 15.0363 16.1621 15.105C16.0591 15.1736 15.9788 15.2713 15.9314 15.3857C15.884 15.5 15.8716 15.6259 15.8958 15.7472C15.9201 15.8686 15.9798 15.9801 16.0674 16.0675L19.9249 19.925Z"
                  fill="#1E1F78"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Card */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm md:hidden">
        <div className="flex gap-3 p-4">
          {item.logo_url ? (
            <img
              src={item.logo_url}
              alt={item.nama_organisasi}
              className="size-12 shrink-0 rounded-full border border-gray-100 object-cover"
            />
          ) : (
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#1A3084] font-bold text-white">
              {item.nama_organisasi?.charAt(0)}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="line-clamp-2 text-[14px] font-semibold text-[#20257B]">
              {item.nama_organisasi}
            </p>
            <span className="mt-1 inline-block rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700">
              {item.jenis_kolaborator?.nama || "-"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-2 border-t border-gray-100 bg-gray-50/50 px-4 py-3 text-[11px]">
          <div>
            <span className="block font-bold tracking-wider text-gray-400 uppercase">
              Lokasi
            </span>
            <span className="font-medium text-gray-700">
              {item.kabupaten_kota || "-"}
            </span>
          </div>
          <div>
            <span className="block font-bold tracking-wider text-gray-400 uppercase">
              PIC
            </span>
            <span className="font-medium text-gray-700">
              {item.penanggung_jawab || "-"}
            </span>
          </div>
          <div>
            <span className="block font-bold tracking-wider text-gray-400 uppercase">
              Kontak
            </span>
            <span className="font-medium text-gray-700">
              {item.kontak || "-"}
            </span>
          </div>
          <div>
            <span className="block font-bold tracking-wider text-gray-400 uppercase">
              Email
            </span>
            <span className="truncate font-medium text-gray-700">
              {item.email || "-"}
            </span>
          </div>
        </div>

        <div className="border-t border-gray-100 px-4 py-2.5">
          <Link
            to={`/kolaborator/${item.id}`}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#1A3084] py-2 text-xs font-bold text-white transition hover:bg-[#20257B]"
          >
            Lihat Detail
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
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </Link>
        </div>
      </div>
    </>
  );
}

export default DaftarKolaborator;
