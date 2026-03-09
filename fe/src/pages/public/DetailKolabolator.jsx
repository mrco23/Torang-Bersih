import React from "react";
import { useNavigate } from "react-router-dom"; // Tambahkan ini
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

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

const DetailKolaborator = () => {
  const navigate = useNavigate(); // Inisialisasi navigate

  // DATA DUMMY REALISTIS
  const kolaborator = {
    id: 1,
    nama_organisasi: "Trash Hero Manado",
    jenis_kolaborator: "Komunitas",
    deskripsi:
      "Trash Hero Manado adalah cabang dari pergerakan global Trash Hero yang berfokus pada aksi nyata membersihkan lingkungan pesisir dan laut dari polusi plastik.\n\nBerbasis di Kota Manado, kami rutin mengadakan kegiatan bersih-bersih (Beach Clean-up) setiap akhir pekan di sekitar Pantai Karangria, Malalayang, hingga kawasan Taman Nasional Bunaken. Selain aksi memungut sampah, kami juga aktif mengedukasi warga pesisir tentang bahaya mikroplastik dan pentingnya memilah sampah dari rumah.\n\nKami percaya bahwa setiap tindakan kecil membawa perubahan besar. Siapapun boleh bergabung, tanpa biaya, tanpa syarat. Kami menyediakan karung dan sarung tangan, Anda hanya perlu membawa semangat dan botol minum sendiri!",
    logo_url:
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=256&q=80",
    cover_url:
      "https://images.unsplash.com/photo-1618477461853-cf6ed80fbfc5?auto=format&fit=crop&w=1600&q=80",
    kabupaten_kota: "Kota Manado",
    alamat_lengkap:
      "Kawasan Megamas, Jl. Laksamana Piere Tendean, Boulevard, Kec. Wenang, Kota Manado, Sulawesi Utara 95111",
    latitude: 1.487,
    longitude: 124.8315,
    nama_pic: "Sarah Walandouw",
    no_whatsapp: "+6282199998888",
    website_ig: "instagram.com/trashheromanado",
    status_verifikasi: true,
  };

  // Fungsi Navigasi ke Halaman Peta
  const handleGoToMap = () => {
    navigate("/peta", {
      state: {
        targetLocation: {
          lat: kolaborator.latitude,
          lng: kolaborator.longitude,
          name: kolaborator.nama_organisasi,
          type: "Kolaborator",
          status: kolaborator.jenis_kolaborator,
        },
      },
    });
  };

  return (
    <div className="min-h-dvh bg-[#F8FAFC] pt-34 pb-24 selection:bg-(--gray-shine) selection:text-(--primary)">
      <div className="mx-auto max-w-[1160px] px-4 sm:px-6 lg:px-8">
        <div className="relative mb-10 md:mb-16">
          <div className="relative h-48 w-full overflow-hidden rounded-3xl bg-gray-200 ring-1 ring-gray-900/5 sm:h-64">
            <img
              src={kolaborator.cover_url}
              alt="Cover"
              className="size-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
          </div>

          <div className="relative mx-auto -mt-16 flex max-w-[1080px] flex-col items-start gap-5 px-4 sm:-mt-20 sm:flex-row sm:items-end sm:px-8">
            <div className="relative size-32 shrink-0 overflow-hidden rounded-[2rem] bg-white p-1.5 shadow-xl ring-1 ring-gray-900/10 sm:size-40">
              <img
                src={kolaborator.logo_url}
                alt="Logo"
                className="size-full rounded-[1.6rem] bg-gray-50 object-cover"
              />
            </div>

            <div className="mb-2 flex-1">
              <div className="mb-2 flex items-center gap-3">
                {kolaborator.status_verifikasi && (
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
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold tracking-widest text-gray-700 uppercase">
                  {kolaborator.jenis_kolaborator}
                </span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-balance text-gray-900 sm:text-4xl lg:text-[40px]">
                {kolaborator.nama_organisasi}
              </h1>
            </div>
          </div>
        </div>

        <div className="mx-auto grid max-w-[1080px] grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="flex flex-col gap-10 lg:col-span-8">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div className="flex flex-col justify-center rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-900/5">
                <span className="mb-1 text-xs font-bold tracking-wider text-gray-400 uppercase">
                  Pengelola / PIC
                </span>
                <span className="font-semibold text-gray-900">
                  {kolaborator.nama_pic}
                </span>
              </div>
              <div className="flex flex-col justify-center rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-900/5">
                <span className="mb-1 text-xs font-bold tracking-wider text-gray-400 uppercase">
                  Wilayah Operasi
                </span>
                <span className="font-semibold text-gray-900">
                  {kolaborator.kabupaten_kota}
                </span>
              </div>
              <div className="col-span-2 flex flex-col justify-center rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-900/5 sm:col-span-1">
                <span className="mb-1 text-xs font-bold tracking-wider text-gray-400 uppercase">
                  Sosial Media
                </span>
                {kolaborator.website_ig ? (
                  <a
                    href={`https://${kolaborator.website_ig}`}
                    target="_blank"
                    rel="noreferrer"
                    className="truncate font-semibold text-(--primary) hover:underline"
                  >
                    {kolaborator.website_ig.replace("instagram.com/", "@")}
                  </a>
                ) : (
                  <span className="text-gray-500">-</span>
                )}
              </div>
            </div>

            <div>
              <h2 className="mb-4 text-xl font-extrabold text-gray-900">
                Tentang Kolaborator
              </h2>
              <div className="prose prose-gray max-w-none text-[15px] leading-relaxed text-pretty text-gray-600 sm:text-base">
                {kolaborator.deskripsi.split("\n").map((paragraph, idx) => (
                  <p key={idx} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

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
                      {kolaborator.kabupaten_kota}
                    </h4>
                    <p className="mt-1 text-sm text-pretty text-gray-600">
                      {kolaborator.alamat_lengkap}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

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
                <a
                  href={`https://wa.me/${kolaborator.no_whatsapp.replace("+", "")}`}
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

                {/* TOMBOL LIHAT LOKASI DI PETA */}
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

export default DetailKolaborator;
