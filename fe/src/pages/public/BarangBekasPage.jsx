import React, { useState } from "react";
import ProductCard from "../../components/features/public/barangbekas/ProdukCard";
import Hero from "../../components/features/public/barangbekas/Hero";

const BarangBekasPage = () => {
  const [activeCategory, setActiveCategory] = useState("Semua");

  const categories = [
    "Semua",
    "Plastik",
    "Kaca",
    "Logam",
    "Kertas",
    "Elektronik",
  ];

  const products = [
    {
      id: 1,
      nama_barang: "Botol Plastik PET Bersih (Siap Lebur)",
      kategori_barang: "Plastik",
      harga: 3500,
      berat_estimasi_kg: 5.5,
      kondisi: "Rongsokan",
      foto_barang_urls: [
        "https://images.unsplash.com/photo-1528323273322-d81458248d40?auto=format&fit=crop&w=600&q=80",
      ],
      status_ketersediaan: "Tersedia",
      penjual_nama: "Bank Sampah Melati",
      lokasi_cod: "Wanea, Manado",
    },
    {
      id: 2,
      nama_barang: "Monitor Tabung Bekas",
      kategori_barang: "Elektronik",
      harga: 0,
      berat_estimasi_kg: 8.0,
      kondisi: "Butuh Perbaikan",
      foto_barang_urls: [
        "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&w=600&q=80",
      ],
      status_ketersediaan: "Tersedia",
      penjual_nama: "Budi Santoso",
      lokasi_cod: "Malalayang, Manado",
    },
    {
      id: 3,
      nama_barang: "Kardus Pindahan Tebal",
      kategori_barang: "Kertas",
      harga: 15000,
      berat_estimasi_kg: 3.2,
      kondisi: "Layak Pakai",
      foto_barang_urls: [
        "https://images.unsplash.com/photo-1588609536893-7814cc5d9eb3?auto=format&fit=crop&w=600&q=80",
      ],
      status_ketersediaan: "Terjual",
      penjual_nama: "Keluarga Walandouw",
      lokasi_cod: "Tuminting, Manado",
    },
    {
      id: 3,
      nama_barang: "Kardus Pindahan Tebal",
      kategori_barang: "Kertas",
      harga: 15000,
      berat_estimasi_kg: 3.2,
      kondisi: "Layak Pakai",
      foto_barang_urls: [
        "https://images.unsplash.com/photo-1588609536893-7814cc5d9eb3?auto=format&fit=crop&w=600&q=80",
      ],
      status_ketersediaan: "Terjual",
      penjual_nama: "Keluarga Walandouw",
      lokasi_cod: "Tuminting, Manado",
    },
    {
      id: 3,
      nama_barang: "Kardus Pindahan Tebal",
      kategori_barang: "Kertas",
      harga: 15000,
      berat_estimasi_kg: 3.2,
      kondisi: "Layak Pakai",
      foto_barang_urls: [
        "https://images.unsplash.com/photo-1588609536893-7814cc5d9eb3?auto=format&fit=crop&w=600&q=80",
      ],
      status_ketersediaan: "Terjual",
      penjual_nama: "Keluarga Walandouw",
      lokasi_cod: "Tuminting, Manado",
    },
    {
      id: 3,
      nama_barang: "Kardus Pindahan Tebal",
      kategori_barang: "Kertas",
      harga: 15000,
      berat_estimasi_kg: 3.2,
      kondisi: "Layak Pakai",
      foto_barang_urls: [
        "https://images.unsplash.com/photo-1588609536893-7814cc5d9eb3?auto=format&fit=crop&w=600&q=80",
      ],
      status_ketersediaan: "Terjual",
      penjual_nama: "Keluarga Walandouw",
      lokasi_cod: "Tuminting, Manado",
    },
    {
      id: 3,
      nama_barang: "Kardus Pindahan Tebal",
      kategori_barang: "Kertas",
      harga: 15000,
      berat_estimasi_kg: 3.2,
      kondisi: "Layak Pakai",
      foto_barang_urls: [
        "https://images.unsplash.com/photo-1588609536893-7814cc5d9eb3?auto=format&fit=crop&w=600&q=80",
      ],
      status_ketersediaan: "Terjual",
      penjual_nama: "Keluarga Walandouw",
      lokasi_cod: "Tuminting, Manado",
    },
    {
      id: 3,
      nama_barang: "Kardus Pindahan Tebal",
      kategori_barang: "Kertas",
      harga: 15000,
      berat_estimasi_kg: 3.2,
      kondisi: "Layak Pakai",
      foto_barang_urls: [
        "https://images.unsplash.com/photo-1588609536893-7814cc5d9eb3?auto=format&fit=crop&w=600&q=80",
      ],
      status_ketersediaan: "Terjual",
      penjual_nama: "Keluarga Walandouw",
      lokasi_cod: "Tuminting, Manado",
    },
    {
      id: 3,
      nama_barang: "Kardus Pindahan Tebal",
      kategori_barang: "Kertas",
      harga: 15000,
      berat_estimasi_kg: 3.2,
      kondisi: "Layak Pakai",
      foto_barang_urls: [
        "https://images.unsplash.com/photo-1588609536893-7814cc5d9eb3?auto=format&fit=crop&w=600&q=80",
      ],
      status_ketersediaan: "Terjual",
      penjual_nama: "Keluarga Walandouw",
      lokasi_cod: "Tuminting, Manado",
    },
    {
      id: 3,
      nama_barang: "Kardus Pindahan Tebal",
      kategori_barang: "Kertas",
      harga: 15000,
      berat_estimasi_kg: 3.2,
      kondisi: "Layak Pakai",
      foto_barang_urls: [
        "https://images.unsplash.com/photo-1588609536893-7814cc5d9eb3?auto=format&fit=crop&w=600&q=80",
      ],
      status_ketersediaan: "Terjual",
      penjual_nama: "Keluarga Walandouw",
      lokasi_cod: "Tuminting, Manado",
    },
    {
      id: 3,
      nama_barang: "Kardus Pindahan Tebal",
      kategori_barang: "Kertas",
      harga: 15000,
      berat_estimasi_kg: 3.2,
      kondisi: "Layak Pakai",
      foto_barang_urls: [
        "https://images.unsplash.com/photo-1588609536893-7814cc5d9eb3?auto=format&fit=crop&w=600&q=80",
      ],
      status_ketersediaan: "Terjual",
      penjual_nama: "Keluarga Walandouw",
      lokasi_cod: "Tuminting, Manado",
    },
    {
      id: 3,
      nama_barang: "Kardus Pindahan Tebal",
      kategori_barang: "Kertas",
      harga: 15000,
      berat_estimasi_kg: 3.2,
      kondisi: "Layak Pakai",
      foto_barang_urls: [
        "https://images.unsplash.com/photo-1588609536893-7814cc5d9eb3?auto=format&fit=crop&w=600&q=80",
      ],
      status_ketersediaan: "Terjual",
      penjual_nama: "Keluarga Walandouw",
      lokasi_cod: "Tuminting, Manado",
    },
  ];

  const filteredProducts =
    activeCategory === "Semua"
      ? products
      : products.filter((p) => p.kategori_barang === activeCategory);

  return (
    <>
      {" "}
      <div className="relative z-0">
        <Hero />
      </div>
      <div className="min-h-screenselection:bg-[var(--gray-shine)] relative z-0 bg-white selection:text-[var(--primary)]">
        <div className="bg- z-20 mx-auto max-w-7xl px-4 py-8 pt-24 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-4 border-b border-gray-100 pb-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-[var(--dark)] md:text-3xl">
                Katalog Barang
              </h2>
              <p className="mt-1 text-sm text-[var(--gray)]">
                Temukan barang bekas dan rongsokan di sekitarmu.
              </p>
            </div>

            <div className="flex flex-1 items-center justify-end gap-4">
              {/* Search Input E-commerce Style */}
              <div className="group relative hidden w-full max-w-md sm:block">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg
                    className="h-5 w-5 text-gray-400 transition-colors group-focus-within:text-[var(--primary)]"
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
                  className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pr-4 pl-10 text-sm text-[var(--dark-text)] placeholder-[var(--gray-placeholder)] transition-all outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
                />
              </div>

              {/* Tombol Jual */}
              <button className="group flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[var(--primary-dark)]">
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
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
            <aside className="sticky top-24 hidden h-fit rounded-xl border border-gray-100 bg-white p-5 shadow-sm lg:col-span-3 lg:block">
              <h3 className="mb-4 text-sm font-bold tracking-wider text-[var(--dark)] uppercase">
                Kategori Barang
              </h3>
              <ul className="flex flex-col gap-1">
                {categories.map((cat) => (
                  <li key={cat}>
                    <button
                      onClick={() => setActiveCategory(cat)}
                      className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                        activeCategory === cat
                          ? "bg-[var(--gray-shine)] font-bold text-[var(--primary)]"
                          : "font-medium text-[var(--gray)] hover:bg-gray-50 hover:text-[var(--dark)]"
                      }`}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>

              <hr className="my-5 border-gray-100" />

              {/* Contoh Filter Tambahan (Kondisi) */}
              <h3 className="mb-4 text-sm font-bold tracking-wider text-[var(--dark)] uppercase">
                Kondisi
              </h3>
              <div className="flex flex-col gap-3">
                {["Layak Pakai", "Butuh Perbaikan", "Rongsokan"].map(
                  (kondisi) => (
                    <label
                      key={kondisi}
                      className="group flex cursor-pointer items-center gap-3"
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-[var(--primary)] focus:ring-[var(--primary)]"
                      />
                      <span className="text-sm text-[var(--gray)] transition-colors group-hover:text-[var(--dark)]">
                        {kondisi}
                      </span>
                    </label>
                  ),
                )}
              </div>

              <hr className="my-5 border-gray-100" />

              <button className="w-full rounded-lg border border-[var(--primary)] py-2 text-sm font-bold text-[var(--primary)] transition-colors hover:bg-[var(--gray-shine)]">
                Terapkan Filter
              </button>
            </aside>

            <div className="lg:col-span-9">
              <div className="scrollbar-hide mb-6 flex gap-2 overflow-x-auto lg:hidden">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`rounded-full px-4 py-2 text-xs font-bold whitespace-nowrap transition-colors ${
                      activeCategory === cat
                        ? "bg-[var(--primary)] text-white"
                        : "border border-gray-200 bg-white text-[var(--gray)] hover:bg-gray-50"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="mb-4 flex items-center justify-between text-sm text-[var(--gray)]">
                <p>
                  Menampilkan <strong>{filteredProducts.length}</strong> barang
                  untuk "{activeCategory}"
                </p>

                <div className="hidden items-center gap-2 sm:flex">
                  <span>Urutkan:</span>
                  <select className="rounded border border-gray-200 bg-white py-1 pr-6 pl-2 text-sm font-medium text-[var(--dark)] outline-none focus:border-[var(--primary)]">
                    <option>Terbaru</option>
                    <option>Harga Terendah</option>
                    <option>Harga Tertinggi</option>
                  </select>
                </div>
              </div>

              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:gap-5 xl:grid-cols-4">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="mt-4 flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 py-16 text-center shadow-sm">
                  <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--gray-shine)]">
                    <svg
                      className="h-6 w-6 text-[var(--gray-placeholder)]"
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
                  <h3 className="mb-1 font-bold text-[var(--dark)]">
                    Barang tidak ditemukan
                  </h3>
                  <p className="text-xs text-[var(--gray)]">
                    Coba hapus beberapa filter pencarian.
                  </p>
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
