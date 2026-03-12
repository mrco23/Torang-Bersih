import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { kolaboratorAPI } from "../../services/api/routes/kolaborator.route";

// Custom Marker Icon Leaflet
const customMarkerIcon = new L.divIcon({
  className: "bg-transparent",
  html: `
    <div class="relative flex items-center justify-center size-12">
      <div class="absolute size-full bg-(--primary) rounded-full animate-ping opacity-30"></div>
      <div class="relative size-7 bg-(--primary) border-[3px] border-white rounded-full shadow-lg z-10"></div>
    </div>
  `,
  iconSize: [48, 48],
  iconAnchor: [24, 24],
  popupAnchor: [0, -24],
});

const DetailKolaboratorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [kolaborator, setKolaborator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchKolaborator = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await kolaboratorAPI.getById(id);
        setKolaborator(res.data.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Gagal memuat detail kolaborator",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchKolaborator();
  }, [id]);

  // Fungsi Navigasi ke Halaman Peta
  const handleGoToMap = () => {
    if (!kolaborator) return;
    navigate("/peta", {
      state: {
        targetLocation: {
          lat: kolaborator.latitude,
          lng: kolaborator.longitude,
          name: kolaborator.nama_organisasi,
          type: "Kolaborator",
          status: kolaborator.jenis_kolaborator?.nama,
        },
      },
    });
  };

  // --- LOADING STATE ---
  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#F8FAFC] pt-34 pb-24">
        <div className="flex flex-col items-center gap-4">
          <div className="size-10 animate-spin rounded-full border-4 border-(--primary) border-t-transparent" />
          <p className="text-sm font-medium text-gray-500">
            Memuat detail kolaborator...
          </p>
        </div>
      </div>
    );
  }

  // --- ERROR STATE ---
  if (error || !kolaborator) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#F8FAFC] pt-34 pb-24">
        <div className="mx-auto max-w-md rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-gray-900/5">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-red-50">
            <svg
              className="size-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="mb-2 text-xl font-bold text-gray-900">
            Kolaborator Tidak Ditemukan
          </h2>
          <p className="mb-6 text-sm text-gray-500">
            {error || "Data kolaborator tidak tersedia."}
          </p>
          <button
            onClick={() => navigate("/kolaborator")}
            className="rounded-xl bg-(--primary) px-6 py-3 text-sm font-bold text-white transition hover:bg-(--primary-dark)"
          >
            Kembali ke Daftar
          </button>
        </div>
      </div>
    );
  }

  // --- HELPERS ---
  const isVerified = kolaborator.status_verifikasi === "terverifikasi";

  // Format kontak untuk WhatsApp link (hapus spasi, pastikan format nomor)
  const getWhatsAppLink = () => {
    if (!kolaborator.kontak) return null;
    const cleaned = kolaborator.kontak.replace(/[^0-9+]/g, "").replace("+", "");
    return `https://wa.me/${cleaned}`;
  };

  // Format sosmed untuk display dan link
  const getSosmedDisplay = () => {
    if (!kolaborator.sosmed) return null;
    // Jika sudah dalam bentuk URL, ambil handle-nya saja
    const handle = kolaborator.sosmed
      .replace(/^https?:\/\//, "")
      .replace("instagram.com/", "@")
      .replace("www.", "");
    return handle;
  };

  const getSosmedLink = () => {
    if (!kolaborator.sosmed) return null;
    if (kolaborator.sosmed.startsWith("http")) return kolaborator.sosmed;
    return `https://${kolaborator.sosmed}`;
  };

  const hasLocation = kolaborator.latitude && kolaborator.longitude;

  return (
    <div className="min-h-dvh bg-[#F8FAFC] pt-34 pb-24 selection:bg-(--gray-shine) selection:text-(--primary)">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* HERO / HEADER */}
        <div className="relative mb-10 md:mb-16">
          {/* Cover image / gradient fallback */}
          <div className="relative h-40 w-full overflow-hidden rounded-3xl bg-linear-to-br from-indigo-500 via-gray-900 to-blue-500 ring-1 ring-gray-900/5 sm:h-54">
            <div className="absolute inset-0 z-10 bg-linear-to-t from-black/40 via-transparent to-transparent"></div>
            <img
              src={kolaborator.logo_url}
              alt="Cover"
              className="size-full object-cover opacity-0"
            />
          </div>

          <div className="relative mx-auto -mt-16 flex max-w-[1080px] flex-col items-start gap-5 px-4 sm:-mt-20 sm:flex-row sm:items-end sm:px-8">
            {/* Logo */}
            <div className="relative size-32 shrink-0 overflow-hidden rounded-4xl bg-white p-1.5 shadow-xl ring-1 ring-gray-900/10 sm:size-40">
              {kolaborator.logo_url ? (
                <img
                  src={kolaborator.logo_url}
                  alt="Logo"
                  className="size-full rounded-3xl bg-gray-50 object-cover"
                />
              ) : (
                <div className="flex size-full items-center justify-center rounded-[1.6rem] bg-gray-100 text-4xl font-bold text-gray-400">
                  {kolaborator.nama_organisasi?.charAt(0)}
                </div>
              )}
            </div>

            <div className="mb-2 flex-1">
              <div className="mb-2 flex items-center gap-3">
                {isVerified && (
                  <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-600/20">
                    <svg
                      className="size-3.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Terverifikasi
                  </span>
                )}
                {kolaborator.jenis_kolaborator?.nama && (
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold tracking-widest text-gray-700 uppercase">
                    {kolaborator.jenis_kolaborator.nama}
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-balance text-gray-900 sm:text-4xl lg:text-[40px]">
                {kolaborator.nama_organisasi}
              </h1>
            </div>
          </div>
        </div>

        <div className="mx-auto grid max-w-[1080px] grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-10 lg:col-span-8">
            {/* Info Cards */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div className="flex flex-col justify-center rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-900/5">
                <span className="mb-1 text-xs font-bold tracking-wider text-gray-400 uppercase">
                  Pengelola / PIC
                </span>
                <span className="font-semibold text-gray-900">
                  {kolaborator.penanggung_jawab || "-"}
                </span>
              </div>
              <div className="flex flex-col justify-center rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-900/5">
                <span className="mb-1 text-xs font-bold tracking-wider text-gray-400 uppercase">
                  Wilayah Operasi
                </span>
                <span className="font-semibold text-gray-900">
                  {kolaborator.kabupaten_kota || "-"}
                </span>
              </div>
              <div className="col-span-2 flex flex-col justify-center rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-900/5 sm:col-span-1">
                <span className="mb-1 text-xs font-bold tracking-wider text-gray-400 uppercase">
                  Sosial Media
                </span>
                {kolaborator.sosmed ? (
                  <a
                    href={getSosmedLink()}
                    target="_blank"
                    rel="noreferrer"
                    className="truncate font-semibold text-(--primary) hover:underline"
                  >
                    {getSosmedDisplay()}
                  </a>
                ) : (
                  <span className="text-gray-500">-</span>
                )}
              </div>
            </div>

            {/* Email card (jika ada) */}
            {kolaborator.email && (
              <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-900/5">
                <span className="mb-1 block text-xs font-bold tracking-wider text-gray-400 uppercase">
                  Email
                </span>
                <a
                  href={`mailto:${kolaborator.email}`}
                  className="font-semibold text-(--primary) hover:underline"
                >
                  {kolaborator.email}
                </a>
              </div>
            )}

            {/* Deskripsi */}
            {kolaborator.deskripsi && (
              <div>
                <h2 className="mb-4 text-xl font-extrabold text-gray-900">
                  Tentang Kolaborator
                </h2>
                <div className="prose prose-gray max-w-none text-[15px] leading-relaxed text-pretty text-gray-600 sm:text-base">
                  {kolaborator.deskripsi.split("\n").map((paragraph, idx) =>
                    paragraph.trim() ? (
                      <p key={idx} className="mb-4">
                        {paragraph}
                      </p>
                    ) : null,
                  )}
                </div>
              </div>
            )}

            {/* Peta */}
            {hasLocation && (
              <div>
                <h2 className="mb-4 text-xl font-extrabold text-gray-900">
                  Titik Operasional
                </h2>

                <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-900/5">
                  <div className="relative z-0 h-[320px] bg-gray-100">
                    <MapContainer
                      center={[kolaborator.latitude, kolaborator.longitude]}
                      zoom={14}
                      scrollWheelZoom={false}
                      style={{ height: "100%", width: "100%", zIndex: 0 }}
                    >
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <Marker
                        position={[kolaborator.latitude, kolaborator.longitude]}
                        icon={customMarkerIcon}
                      >
                        <Popup className="rounded-xl border-none shadow-xl">
                          <strong className="text-gray-900">
                            {kolaborator.nama_organisasi}
                          </strong>
                        </Popup>
                      </Marker>
                    </MapContainer>
                  </div>
                  <div className="flex items-start gap-4 p-6">
                    <svg
                      className="mt-1 size-6 shrink-0 text-(--primary)"
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
                    <div>
                      <h4 className="font-bold text-gray-900">
                        {kolaborator.kabupaten_kota || "Lokasi"}
                      </h4>
                      {kolaborator.alamat_lengkap && (
                        <p className="mt-1 text-sm text-pretty text-gray-600">
                          {kolaborator.alamat_lengkap}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN (CTA SIDEBAR) */}
          <div className="relative z-10 lg:col-span-4">
            <div className="sticky top-28 overflow-hidden rounded-3xl bg-white p-6 shadow-xl ring-1 shadow-gray-200/40 ring-gray-900/5 sm:p-8">
              <h3 className="mb-2 text-lg font-extrabold text-gray-900">
                Mari Berkolaborasi
              </h3>
              <p className="mb-8 text-sm text-pretty text-gray-500">
                Hubungi pengelola komunitas ini untuk mendonasikan sampah,
                menjadi relawan, atau kerja sama program.
              </p>

              <div className="space-y-3">
                {/* WhatsApp button */}
                {getWhatsAppLink() ? (
                  <a
                    href={getWhatsAppLink()}
                    target="_blank"
                    rel="noreferrer"
                    className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-gray-900 py-4 text-sm font-bold text-white shadow-md shadow-gray-900/20 transition-all hover:bg-gray-800 active:scale-[0.98]"
                  >
                    <svg
                      className="size-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Chat via WhatsApp
                  </a>
                ) : (
                  <div className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-gray-100 py-4 text-sm font-medium text-gray-400">
                    Kontak belum tersedia
                  </div>
                )}

                {/* Lihat Lokasi di Peta */}
                {hasLocation && (
                  <button
                    onClick={handleGoToMap}
                    className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-white py-4 text-sm font-bold text-gray-700 ring-1 ring-gray-200 transition-all ring-inset hover:bg-gray-50 active:scale-[0.98]"
                  >
                    <svg
                      className="size-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Lihat Lokasi di Peta
                  </button>
                )}
              </div>

              <div className="mt-8 border-t border-gray-100 pt-6 text-center">
                <button className="text-xs font-semibold text-gray-400 transition-colors hover:text-red-500">
                  Laporkan profil ini
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailKolaboratorPage;
