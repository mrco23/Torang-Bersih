import { useState, useEffect } from "react";
import { kolaboratorAPI } from "../../services/api/routes/kolaborator.route";
import { referensiAPI } from "../../services/api/routes/referensi.route";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import toaster from "../../utils/toaster";

const DEFAULT_LAT = 1.4748;
const DEFAULT_LNG = 124.8421;

const customMarkerIcon = new L.divIcon({
  className: "bg-transparent",
  html: `
    <div class="relative flex items-center justify-center size-8">
      <div class="absolute size-full bg-blue-600 rounded-full animate-ping opacity-30"></div>
      <div class="relative size-5 bg-blue-600 border-2 border-white rounded-full shadow-lg z-10"></div>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

function AdminKolaboratorPage() {
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
    status_verifikasi: "",
    sort_by: "created_at",
    sort_order: "desc",
  });

  const [selectedKolaborator, setSelectedKolaborator] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

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
      setError(err.response?.data?.message || "Gagal memuat data kolaborator");
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
  }, [
    query.page,
    query.jenis_kolaborator_id,
    query.status_verifikasi,
    query.sort_order,
  ]);

  const handleSearch = (e) => {
    e.preventDefault();
    setQuery((q) => ({ ...q, page: 1 }));
    fetchItems();
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus kolaborator ini?")) return;
    setActionLoading(true);
    try {
      await kolaboratorAPI.delete(id);
      toaster.success("Kolaborator berhasil dihapus");
      fetchItems();
      if (selectedKolaborator?.id === id) setSelectedKolaborator(null);
    } catch (err) {
      toaster.error(
        err.response?.data?.message || "Gagal menghapus kolaborator",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleVerify = async (id, status) => {
    let actionText = status === "terverifikasi" ? "menyetujui" : "menolak";
    if (!confirm(`Apakah Anda yakin ingin ${actionText} kolaborator ini?`))
      return;

    setActionLoading(true);
    try {
      await kolaboratorAPI.verify(id, { status_verifikasi: status });
      toaster.success(
        `Kolaborator berhasil di-${status === "terverifikasi" ? "verifikasi" : "tolak"}`,
      );
      fetchItems();
      // Update selected modal data if it's open
      if (selectedKolaborator?.id === id) {
        setSelectedKolaborator((prev) => ({
          ...prev,
          status_verifikasi: status,
        }));
      }
    } catch (err) {
      toaster.error(err.response?.data?.message || "Gagal memperbarui status");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="relative space-y-4 md:space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">
        Manajemen Kolaborator
      </h1>

      {/* Filter & Search */}
      <div className="space-y-3 rounded-xl border border-gray-100 bg-white p-3 shadow-sm md:p-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Cari nama organisasi..."
            value={query.search}
            onChange={(e) =>
              setQuery((q) => ({ ...q, search: e.target.value }))
            }
            className="flex-1 rounded-lg border px-3 py-2 text-sm focus:ring-1 focus:ring-(--primary) focus:outline-none md:px-4"
          />
          <button
            type="submit"
            className="cursor-pointer rounded-lg bg-(--primary) px-3 py-2 text-sm text-white transition hover:bg-(--primary-dark) md:px-4"
          >
            Cari
          </button>
        </form>
        <div className="flex flex-wrap gap-2 md:gap-3">
          <select
            value={query.jenis_kolaborator_id}
            onChange={(e) =>
              setQuery((q) => ({
                ...q,
                jenis_kolaborator_id: e.target.value,
                page: 1,
              }))
            }
            className="rounded-lg border px-2 py-2 text-sm focus:ring-1 focus:ring-(--primary) focus:outline-none md:px-3"
          >
            <option value="">Semua Jenis</option>
            {jenisOptions.map((j) => (
              <option key={j.id} value={j.id}>
                {j.nama}
              </option>
            ))}
          </select>
          <select
            value={query.status_verifikasi}
            onChange={(e) =>
              setQuery((q) => ({
                ...q,
                status_verifikasi: e.target.value,
                page: 1,
              }))
            }
            className="rounded-lg border px-2 py-2 text-sm focus:ring-1 focus:ring-(--primary) focus:outline-none md:px-3"
          >
            <option value="">Semua Status</option>
            <option value="menunggu verifikasi">Menunggu Verifikasi</option>
            <option value="terverifikasi">Terverifikasi</option>
            <option value="ditolak">Ditolak</option>
          </select>
          <select
            value={query.sort_order}
            onChange={(e) =>
              setQuery((q) => ({ ...q, sort_order: e.target.value, page: 1 }))
            }
            className="rounded-lg border px-2 py-2 text-sm focus:ring-1 focus:ring-(--primary) focus:outline-none md:px-3"
          >
            <option value="desc">Terbaru</option>
            <option value="asc">Terlama</option>
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        {error && (
          <div className="bg-red-50 p-4 text-sm text-red-600">{error}</div>
        )}
        {loading ? (
          <div className="flex justify-center p-10">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-(--primary) border-t-transparent" />
          </div>
        ) : items.length === 0 ? (
          <div className="p-10 text-center text-sm text-gray-400">
            Tidak ada kolaborator ditemukan
          </div>
        ) : (
          <>
            {/* Desktop: Table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-100 bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">
                      Organisasi
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">
                      Jenis & Wilayah
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">
                      Kontak PIC
                    </th>
                    <th className="px-4 py-3 text-center font-medium text-gray-600">
                      Status
                    </th>
                    <th className="px-4 py-3 text-center font-medium text-gray-600">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {items.map((item) => (
                    <tr key={item.id} className="transition hover:bg-gray-50">
                      <td className="max-w-[200px] px-4 py-3">
                        <div className="flex items-center gap-3">
                          {item.logo_url ? (
                            <img
                              src={item.logo_url}
                              alt="Logo"
                              className="size-10 rounded-lg bg-gray-100 object-cover"
                            />
                          ) : (
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 font-bold text-gray-500">
                              {item.nama_organisasi.charAt(0)}
                            </div>
                          )}
                          <div className="truncate">
                            <p
                              className="truncate font-medium text-gray-800"
                              title={item.nama_organisasi}
                            >
                              {item.nama_organisasi}
                            </p>
                            {item.email && (
                              <p
                                className="truncate text-xs text-gray-400"
                                title={item.email}
                              >
                                {item.email}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-medium whitespace-nowrap text-blue-700">
                          {item.jenis_kolaborator?.nama}
                        </span>
                        <p className="mt-1.5 text-xs text-gray-500">
                          {item.kabupaten_kota || "-"}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        <p className="text-xs font-medium text-gray-800">
                          {item.penanggung_jawab || "-"}
                        </p>
                        <p className="mt-0.5 text-xs">{item.kontak || "-"}</p>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {item.status_verifikasi === "terverifikasi" ? (
                          <span className="rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20">
                            Terverifikasi
                          </span>
                        ) : item.status_verifikasi === "ditolak" ? (
                          <span className="rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-red-600/20">
                            Ditolak
                          </span>
                        ) : (
                          <span className="rounded-full bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700 ring-1 ring-amber-600/20">
                            Menunggu
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setSelectedKolaborator(item)}
                            className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 transition hover:bg-gray-200"
                          >
                            Detail
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile: Card view */}
            <div className="divide-y divide-gray-100 md:hidden">
              {items.map((item) => (
                <div key={item.id} className="space-y-3 p-4">
                  <div className="flex items-start gap-3">
                    {item.logo_url ? (
                      <img
                        src={item.logo_url}
                        alt="Logo"
                        className="size-10 shrink-0 rounded-lg bg-gray-100 object-cover"
                      />
                    ) : (
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 font-bold text-gray-500">
                        {item.nama_organisasi.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-gray-800">
                        {item.nama_organisasi}
                      </p>
                      {item.email && (
                        <p className="truncate text-[11px] text-gray-400">
                          {item.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-blue-50 px-2 py-1 text-[10px] font-medium text-blue-700">
                      {item.jenis_kolaborator?.nama}
                    </span>
                    {item.status_verifikasi === "terverifikasi" ? (
                      <span className="rounded-full bg-green-50 px-2 py-1 text-[10px] font-medium text-green-700">
                        Terverifikasi
                      </span>
                    ) : item.status_verifikasi === "ditolak" ? (
                      <span className="rounded-full bg-red-50 px-2 py-1 text-[10px] font-medium text-red-700">
                        Ditolak
                      </span>
                    ) : (
                      <span className="rounded-full bg-amber-50 px-2 py-1 text-[10px] font-medium text-amber-700">
                        Menunggu
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 rounded-lg bg-gray-50 p-2 text-[11px] text-gray-500">
                    <div>
                      <span className="mb-0.5 block text-gray-400">PIC</span>
                      <span className="font-medium text-gray-700">
                        {item.penanggung_jawab || "-"}
                      </span>
                    </div>
                    <div>
                      <span className="mb-0.5 block text-gray-400">Kontak</span>
                      <span className="font-medium text-gray-700">
                        {item.kontak || "-"}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedKolaborator(item)}
                      className="flex-1 rounded-lg bg-gray-100 py-1.5 text-[11px] font-bold text-gray-700 transition hover:bg-gray-200"
                    >
                      Lihat Detail
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Pagination */}
        {meta && (
          <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-100 px-4 py-3 text-sm text-gray-500 sm:flex-row">
            <span>
              Menampilkan {items.length} dari {meta.total} kolaborator
            </span>
            <div className="flex gap-2">
              <button
                disabled={!meta.has_prev}
                onClick={() => setQuery((q) => ({ ...q, page: q.page - 1 }))}
                className="rounded-lg border px-3 py-1.5 font-medium transition hover:bg-gray-50 disabled:opacity-40"
              >
                ← Prev
              </button>
              <span className="flex items-center rounded-lg bg-gray-50 px-3 py-1.5 font-medium">
                Halaman {meta.page} / {meta.total_pages}
              </span>
              <button
                disabled={!meta.has_next}
                onClick={() => setQuery((q) => ({ ...q, page: q.page + 1 }))}
                className="rounded-lg border px-3 py-1.5 font-medium transition hover:bg-gray-50 disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* DETAIL MODAL */}
      {selectedKolaborator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-gray-900/60 p-4 backdrop-blur-sm sm:p-6">
          <div className="animate-in fade-in zoom-in-95 flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-gray-900">
                  Detail Kolaborator
                </h2>
                {selectedKolaborator.status_verifikasi === "terverifikasi" ? (
                  <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-bold text-green-700 ring-1 ring-green-600/20">
                    Terverifikasi
                  </span>
                ) : selectedKolaborator.status_verifikasi === "ditolak" ? (
                  <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-700 ring-1 ring-red-600/20">
                    Ditolak
                  </span>
                ) : (
                  <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 ring-1 ring-amber-600/20">
                    Menunggu Verifikasi
                  </span>
                )}
              </div>
              <button
                onClick={() => setSelectedKolaborator(null)}
                className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <svg
                  className="size-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 space-y-8 overflow-y-auto bg-[#F8FAFC] p-6">
              {/* Profil Header */}
              <div className="flex flex-col items-start gap-6 sm:flex-row">
                <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-gray-100 bg-white p-1 shadow-sm">
                  {selectedKolaborator.logo_url ? (
                    <img
                      src={selectedKolaborator.logo_url}
                      alt="Logo"
                      className="h-full w-full rounded-xl object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-bold text-gray-300">
                      {selectedKolaborator.nama_organisasi.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <span className="mb-2 inline-block rounded bg-blue-50 px-2 py-1 text-xs font-bold tracking-wider text-blue-600 uppercase">
                    {selectedKolaborator.jenis_kolaborator?.nama ||
                      "Jenis Tidak Diketahui"}
                  </span>
                  <h3 className="mb-2 text-2xl font-extrabold text-gray-900">
                    {selectedKolaborator.nama_organisasi}
                  </h3>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap text-gray-500">
                    {selectedKolaborator.deskripsi || "Tidak ada deskripsi."}
                  </p>
                </div>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Section Lokasi */}
                <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                  <h4 className="mb-4 flex items-center gap-2 text-sm font-bold text-gray-900">
                    <svg
                      className="size-4 text-(--primary)"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Lokasi & Operasional
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
                        Kota / Kabupaten
                      </p>
                      <p className="mt-0.5 text-sm font-medium text-gray-800">
                        {selectedKolaborator.kabupaten_kota || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
                        Alamat Lengkap
                      </p>
                      <p className="mt-0.5 text-sm font-medium text-gray-800">
                        {selectedKolaborator.alamat_lengkap || "-"}
                      </p>
                    </div>
                    {/* Leaflet Map Preview */}
                    <div className="relative z-0 mt-3 h-[180px] w-full overflow-hidden rounded-lg border border-gray-200">
                      {selectedKolaborator.latitude &&
                      selectedKolaborator.longitude ? (
                        <MapContainer
                          center={[
                            selectedKolaborator.latitude,
                            selectedKolaborator.longitude,
                          ]}
                          zoom={15}
                          scrollWheelZoom={false}
                          style={{ height: "100%", width: "100%", zIndex: 0 }}
                          dragging={false}
                          zoomControl={false}
                        >
                          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                          <Marker
                            position={[
                              selectedKolaborator.latitude,
                              selectedKolaborator.longitude,
                            ]}
                            icon={customMarkerIcon}
                          >
                            <Popup className="rounded-xl border-none shadow-xl">
                              <strong className="text-gray-900">
                                {selectedKolaborator.nama_organisasi}
                              </strong>
                            </Popup>
                          </Marker>
                        </MapContainer>
                      ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center bg-gray-50 text-gray-400">
                          <svg
                            className="mb-2 size-8 opacity-50"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
                            />
                          </svg>
                          <span className="text-xs font-medium">
                            Lokasi Peta Belum Tersedia
                          </span>
                        </div>
                      )}
                      {selectedKolaborator.latitude &&
                        selectedKolaborator.longitude && (
                          <div className="pointer-events-none absolute right-2 bottom-2 z-1000 rounded bg-white/90 px-2 py-1 font-mono text-[10px] font-bold text-gray-600 shadow-sm backdrop-blur-sm">
                            {selectedKolaborator.latitude.toFixed(6)},{" "}
                            {selectedKolaborator.longitude.toFixed(6)}
                          </div>
                        )}
                    </div>
                  </div>
                </div>

                {/* Section Kontak */}
                <div className="flex flex-col justify-between rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
                  <div>
                    <h4 className="mb-4 flex items-center gap-2 text-sm font-bold text-gray-900">
                      <svg
                        className="size-4 text-(--primary)"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      Kontak PIC
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <p className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
                          Penanggung Jawab
                        </p>
                        <p className="mt-0.5 text-sm font-medium text-gray-800">
                          {selectedKolaborator.penanggung_jawab || "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
                          Kontak / WhatsApp
                        </p>
                        <p className="mt-0.5 text-sm font-medium text-gray-800">
                          {selectedKolaborator.kontak || "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
                          Email
                        </p>
                        <p className="mt-0.5 text-sm font-medium text-gray-800">
                          {selectedKolaborator.email || "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
                          Sosial Media
                        </p>
                        {selectedKolaborator.sosmed ? (
                          <a
                            href={
                              selectedKolaborator.sosmed.startsWith("http")
                                ? selectedKolaborator.sosmed
                                : `https://${selectedKolaborator.sosmed}`
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="mt-0.5 block truncate text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {selectedKolaborator.sosmed.replace(
                              /^https?:\/\//,
                              "",
                            )}
                          </a>
                        ) : (
                          <p className="mt-0.5 text-sm font-medium text-gray-800">
                            -
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-between border-t border-gray-100 pt-4 text-xs text-gray-500">
                    <span>Didaftarkan:</span>
                    <span className="font-medium text-gray-700">
                      {new Date(
                        selectedKolaborator.created_at,
                      ).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer / Actions */}
            <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-100 bg-white p-4 sm:flex-row sm:px-6">
              <button
                onClick={() => handleDelete(selectedKolaborator.id)}
                disabled={actionLoading}
                className="flex w-full items-center justify-center gap-2 px-4 py-2 text-sm font-bold text-red-500 transition-colors hover:text-red-700 disabled:opacity-50 sm:w-auto"
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
                    strokeWidth="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Hapus Data
              </button>

              <div className="flex w-full gap-3 sm:w-auto">
                {selectedKolaborator.status_verifikasi === "menunggu" && (
                  <>
                    <button
                      onClick={() =>
                        handleVerify(selectedKolaborator.id, "ditolak")
                      }
                      disabled={actionLoading}
                      className="flex-1 rounded-xl border border-red-200 bg-red-50 px-6 py-2.5 text-sm font-bold text-red-700 transition hover:bg-red-100 disabled:opacity-50 sm:flex-none"
                    >
                      Tolak
                    </button>
                    <button
                      onClick={() =>
                        handleVerify(selectedKolaborator.id, "terverifikasi")
                      }
                      disabled={actionLoading}
                      className="flex-1 rounded-xl bg-(--primary) px-6 py-2.5 text-sm font-bold text-white transition hover:bg-(--primary-dark) disabled:opacity-50 sm:flex-none"
                    >
                      Verifikasi Data
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default AdminKolaboratorPage;
