import React, { useState, useEffect, useCallback } from "react";
import ProductCard from "../../components/features/public/barangbekas/ProdukCard";
import FiturHero from "../../components/shared/FiturHero";
import { Link } from "react-router-dom";
import { marketplaceAPI } from "../../services/api/routes/marketplace.route";
import { referensiAPI } from "../../services/api/routes/referensi.route";
import {
  KONDISI,
  KONDISI_LABELS,
} from "../../components/features/public/barangbekas/InputBarang/Constant";

const BarangBekasPage = () => {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [kategoriOptions, setKategoriOptions] = useState([]);
  const [activeCategory, setActiveCategory] = useState("");
  const [activeKondisi, setActiveKondisi] = useState([]);

  const [query, setQuery] = useState({
    page: 1,
    per_page: 12,
    search: "",
    status_ketersediaan: "tersedia",
    sort_by: "created_at",
    sort_order: "desc",
  });

  // Fetch kategori dari API referensi
  useEffect(() => {
    const fetchKategori = async () => {
      try {
        const res = await referensiAPI.getAll("kategori-barang");
        setKategoriOptions(res.data.data || []);
      } catch {
        /* ignore */
      }
    };
    fetchKategori();
  }, []);

  // Fetch items
  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: query.page,
        per_page: query.per_page,
        sort_by: query.sort_by,
        sort_order: query.sort_order,
        status_ketersediaan: query.status_ketersediaan,
      };
      if (query.search) params.search = query.search;
      if (activeCategory) params.kategori_barang_id = activeCategory;
      if (activeKondisi.length === 1) params.kondisi = activeKondisi[0];

      const res = await marketplaceAPI.getAll(params);
      setItems(res.data.data || []);
      setMeta(res.data.meta?.pagination || null);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memuat data barang");
    } finally {
      setLoading(false);
    }
  }, [query, activeCategory, activeKondisi]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleSearch = (e) => {
    e.preventDefault();
    setQuery((q) => ({ ...q, page: 1 }));
  };

  const toggleKondisi = (val) => {
    setActiveKondisi((prev) =>
      prev.includes(val) ? prev.filter((k) => k !== val) : [...prev, val],
    );
    setQuery((q) => ({ ...q, page: 1 }));
  };

  const handleCategoryChange = (catId) => {
    setActiveCategory(catId);
    setQuery((q) => ({ ...q, page: 1 }));
  };

  const handleSortChange = (e) => {
    const val = e.target.value;
    if (val === "harga_asc") {
      setQuery((q) => ({ ...q, sort_by: "harga", sort_order: "asc", page: 1 }));
    } else if (val === "harga_desc") {
      setQuery((q) => ({
        ...q,
        sort_by: "harga",
        sort_order: "desc",
        page: 1,
      }));
    } else {
      setQuery((q) => ({
        ...q,
        sort_by: "created_at",
        sort_order: "desc",
        page: 1,
      }));
    }
  };

  const currentSortValue =
    query.sort_by === "harga"
      ? query.sort_order === "asc"
        ? "harga_asc"
        : "harga_desc"
      : "terbaru";

  const activeKategoriNama = activeCategory
    ? kategoriOptions.find((k) => k.id === activeCategory)?.nama || "Kategori"
    : "Semua";

  return (
    <>
      <div className="relative z-0">
        <FiturHero
          title="Temukan Barang Bekas Berkualitas untuk Daur Ulangmu"
          description="Jelajahi katalog barang bekas yang siap didaur ulang, temukan bahan berkualitas untuk proyek kreatifmu, dan dukung gerakan daur ulang yang berkelanjutan."
          buttonText="Temukan Barang Daur Ulang"
          buttonLink="/peta"
        />
      </div>
      <div className="relative z-0 min-h-dvh bg-white px-4 py-8 selection:bg-(--gray-shine) selection:text-(--primary) sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-4 border-b border-gray-100 pb-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-(--dark) md:text-3xl">
                Katalog Barang
              </h2>
              <p className="mt-1 text-sm text-(--gray)">
                Temukan barang bekas dan rongsokan di sekitarmu.
              </p>
            </div>

            <div className="flex flex-1 items-center justify-end gap-4">
              {/* Search Input */}
              <form
                onSubmit={handleSearch}
                className="group relative hidden w-full max-w-md sm:block"
              >
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg
                    className="h-5 w-5 text-gray-400 transition-colors group-focus-within:text-(--primary)"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Cari barang..."
                  value={query.search}
                  onChange={(e) =>
                    setQuery((q) => ({ ...q, search: e.target.value }))
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pr-4 pl-10 text-sm text-(--dark-text) placeholder-(--gray-placeholder) transition-all outline-none focus:border-(--primary) focus:ring-1 focus:ring-(--primary)"
                />
              </form>

              {/* Tombol Jual */}
              <Link
                to="/barang-bekas/jual"
                className="group flex shrink-0 items-center justify-center gap-2 rounded-lg bg-(--primary) px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-(--primary-dark)"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M12 4v16m8-8H4"
                  ></path>
                </svg>
                Jual Barang
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
            {/* Sidebar Filter */}
            <aside className="sticky top-24 hidden h-fit rounded-xl border border-gray-100 bg-white p-5 shadow-sm lg:col-span-3 lg:block">
              <h3 className="mb-4 text-sm font-bold tracking-wider text-(--dark) uppercase">
                Kategori Barang
              </h3>
              <ul className="flex flex-col gap-1">
                <li>
                  <button
                    onClick={() => handleCategoryChange("")}
                    className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                      !activeCategory
                        ? "bg-(--gray-shine) font-bold text-(--primary)"
                        : "font-medium text-(--gray) hover:bg-gray-50 hover:text-(--dark)"
                    }`}
                  >
                    Semua
                  </button>
                </li>
                {kategoriOptions.map((cat) => (
                  <li key={cat.id}>
                    <button
                      onClick={() => handleCategoryChange(cat.id)}
                      className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                        activeCategory === cat.id
                          ? "bg-(--gray-shine) font-bold text-(--primary)"
                          : "font-medium text-(--gray) hover:bg-gray-50 hover:text-(--dark)"
                      }`}
                    >
                      {cat.nama}
                    </button>
                  </li>
                ))}
              </ul>

              <hr className="my-5 border-gray-100" />

              <h3 className="mb-4 text-sm font-bold tracking-wider text-(--dark) uppercase">
                Kondisi
              </h3>
              <div className="flex flex-col gap-3">
                {KONDISI.map((k) => (
                  <label
                    key={k.value}
                    className="group flex cursor-pointer items-center gap-3"
                  >
                    <input
                      type="checkbox"
                      checked={activeKondisi.includes(k.value)}
                      onChange={() => toggleKondisi(k.value)}
                      className="h-4 w-4 rounded border-gray-300 text-(--primary) focus:ring-(--primary)"
                    />
                    <span className="text-sm text-(--gray) transition-colors group-hover:text-(--dark)">
                      {k.label}
                    </span>
                  </label>
                ))}
              </div>

              <hr className="my-5 border-gray-100" />

              <button
                onClick={() => {
                  setActiveCategory("");
                  setActiveKondisi([]);
                  setQuery((q) => ({
                    ...q,
                    page: 1,
                    search: "",
                    sort_by: "created_at",
                    sort_order: "desc",
                  }));
                }}
                className="w-full rounded-lg border border-(--primary) py-2 text-sm font-bold text-(--primary) transition-colors hover:bg-(--gray-shine)"
              >
                Reset Filter
              </button>
            </aside>

            <div className="lg:col-span-9">
              {/* Mobile filter tabs */}
              <div className="scrollbar-hide mb-6 flex gap-2 overflow-x-auto lg:hidden">
                <button
                  onClick={() => handleCategoryChange("")}
                  className={`rounded-full px-4 py-2 text-xs font-bold whitespace-nowrap transition-colors ${
                    !activeCategory
                      ? "bg-(--primary) text-white"
                      : "border border-gray-200 bg-white text-(--gray) hover:bg-gray-50"
                  }`}
                >
                  Semua
                </button>
                {kategoriOptions.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`rounded-full px-4 py-2 text-xs font-bold whitespace-nowrap transition-colors ${
                      activeCategory === cat.id
                        ? "bg-(--primary) text-white"
                        : "border border-gray-200 bg-white text-(--gray) hover:bg-gray-50"
                    }`}
                  >
                    {cat.nama}
                  </button>
                ))}
              </div>

              <div className="mb-4 flex items-center justify-between text-sm text-(--gray)">
                <p>
                  {loading ? (
                    "Memuat..."
                  ) : (
                    <>
                      Menampilkan <strong>{items.length}</strong>
                      {meta && <> dari {meta.total}</>} barang
                      {activeCategory && (
                        <> untuk &quot;{activeKategoriNama}&quot;</>
                      )}
                    </>
                  )}
                </p>

                <div className="hidden items-center gap-2 sm:flex">
                  <span>Urutkan:</span>
                  <select
                    value={currentSortValue}
                    onChange={handleSortChange}
                    className="rounded border border-gray-200 bg-white py-1 pr-6 pl-2 text-sm font-medium text-(--dark) outline-none focus:border-(--primary)"
                  >
                    <option value="terbaru">Terbaru</option>
                    <option value="harga_asc">Harga Terendah</option>
                    <option value="harga_desc">Harga Tertinggi</option>
                  </select>
                </div>
              </div>

              {/* Error state */}
              {error && (
                <div className="mb-4 rounded-xl bg-red-50 p-4 text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* Loading state */}
              {loading ? (
                <div className="flex justify-center py-20">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-(--primary) border-t-transparent" />
                </div>
              ) : items.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:gap-5 xl:grid-cols-4">
                  {items.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="mt-4 flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 py-16 text-center shadow-sm">
                  <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-(--gray-shine)">
                    <svg
                      className="h-6 w-6 text-(--gray-placeholder)"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                      />
                    </svg>
                  </div>
                  <h3 className="mb-1 font-bold text-(--dark)">
                    Barang tidak ditemukan
                  </h3>
                  <p className="text-xs text-(--gray)">
                    Coba hapus beberapa filter pencarian.
                  </p>
                </div>
              )}

              {/* Pagination */}
              {meta && meta.total_pages > 1 && (
                <div className="mt-8 flex flex-col items-center justify-between gap-3 sm:flex-row">
                  <span className="text-sm text-gray-500">
                    Halaman {meta.page} dari {meta.total_pages}
                  </span>
                  <div className="flex gap-2">
                    <button
                      disabled={!meta.has_prev}
                      onClick={() =>
                        setQuery((q) => ({ ...q, page: q.page - 1 }))
                      }
                      className="rounded-lg border px-4 py-2 text-sm transition hover:bg-gray-50 disabled:opacity-40"
                    >
                      ← Sebelumnya
                    </button>
                    <button
                      disabled={!meta.has_next}
                      onClick={() =>
                        setQuery((q) => ({ ...q, page: q.page + 1 }))
                      }
                      className="rounded-lg border px-4 py-2 text-sm transition hover:bg-gray-50 disabled:opacity-40"
                    >
                      Selanjutnya →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BarangBekasPage;
