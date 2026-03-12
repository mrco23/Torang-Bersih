import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import StatusBadge from "./StatusBadge";
import { markerIcon } from "./mapUtils";

/**
 * Shared read-only detail modal for kolaborator data.
 *
 * Props:
 *  - data: kolaborator object
 *  - onClose: () => void
 *  - footerActions: ReactNode (buttons for the footer — verify, edit, delete, etc.)
 */
function KolaboratorDetailModal({ data, onClose, footerActions }) {
  if (!data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-gray-900/60 p-4 backdrop-blur-sm sm:p-6">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-gray-900">
              Detail Kolaborator
            </h2>
            <StatusBadge status={data.status_verifikasi} />
          </div>
          <button
            onClick={onClose}
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

        {/* Body */}
        <div className="flex-1 space-y-6 overflow-y-auto bg-[#F8FAFC] p-6">
          {/* Profil */}
          <div className="flex flex-col items-start gap-5 sm:flex-row">
            <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-gray-100 bg-white p-1 shadow-sm">
              {data.logo_url ? (
                <img
                  src={data.logo_url}
                  alt="Logo"
                  className="size-full rounded-xl object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-gray-300">
                  {data.nama_organisasi?.charAt(0)}
                </span>
              )}
            </div>
            <div className="flex-1">
              <span className="mb-2 inline-block rounded bg-blue-50 px-2 py-1 text-xs font-bold tracking-wider text-blue-600 uppercase">
                {data.jenis_kolaborator?.nama || "—"}
              </span>
              <h3 className="mb-2 text-xl font-extrabold text-gray-900">
                {data.nama_organisasi}
              </h3>
              <p className="text-sm leading-relaxed whitespace-pre-wrap text-gray-500">
                {data.deskripsi || "Tidak ada deskripsi."}
              </p>
            </div>
          </div>

          {/* Grid: Lokasi + Kontak */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Lokasi */}
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
                Lokasi
              </h4>
              <div className="space-y-3">
                <div>
                  <p className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
                    Kota / Kabupaten
                  </p>
                  <p className="mt-0.5 text-sm font-medium text-gray-800">
                    {data.kabupaten_kota || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
                    Alamat Lengkap
                  </p>
                  <p className="mt-0.5 text-sm font-medium text-gray-800">
                    {data.alamat_lengkap || "-"}
                  </p>
                </div>
                {/* Map Preview */}
                <div className="relative z-0 mt-3 h-[160px] w-full overflow-hidden rounded-lg border border-gray-200">
                  {data.latitude && data.longitude ? (
                    <MapContainer
                      center={[data.latitude, data.longitude]}
                      zoom={15}
                      scrollWheelZoom={false}
                      dragging={false}
                      zoomControl={false}
                      style={{ height: "100%", width: "100%", zIndex: 0 }}
                    >
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <Marker
                        position={[data.latitude, data.longitude]}
                        icon={markerIcon}
                      >
                        <Popup>
                          <strong>{data.nama_organisasi}</strong>
                        </Popup>
                      </Marker>
                    </MapContainer>
                  ) : (
                    <div className="flex size-full flex-col items-center justify-center bg-gray-50 text-gray-400">
                      <svg
                        className="mb-1 size-6 opacity-50"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                        />
                      </svg>
                      <span className="text-xs font-medium">
                        Peta Tidak Tersedia
                      </span>
                    </div>
                  )}
                  {data.latitude && data.longitude && (
                    <div className="pointer-events-none absolute right-2 bottom-2 z-1000 rounded bg-white/90 px-2 py-1 font-mono text-[10px] font-bold text-gray-600 shadow-sm backdrop-blur-sm">
                      {data.latitude.toFixed(6)}, {data.longitude.toFixed(6)}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Kontak */}
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
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
                      Penanggung Jawab
                    </p>
                    <p className="mt-0.5 font-medium text-gray-800">
                      {data.penanggung_jawab || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
                      WhatsApp
                    </p>
                    <p className="mt-0.5 font-medium text-gray-800">
                      {data.kontak || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
                      Email
                    </p>
                    <p className="mt-0.5 font-medium text-gray-800">
                      {data.email || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
                      Sosial Media
                    </p>
                    {data.sosmed ? (
                      <a
                        href={
                          data.sosmed.startsWith("http")
                            ? data.sosmed
                            : `https://${data.sosmed}`
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="mt-0.5 block truncate font-medium text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {data.sosmed.replace(/^https?:\/\//, "")}
                      </a>
                    ) : (
                      <p className="mt-0.5 font-medium text-gray-800">-</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-between border-t border-gray-100 pt-3 text-xs text-gray-500">
                <span>Didaftarkan:</span>
                <span className="font-medium text-gray-700">
                  {new Date(data.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Catatan penolakan */}
          {data.status_verifikasi === "ditolak" && data.catatan_verifikasi && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="mb-1 text-xs font-bold text-red-700">
                Catatan Penolakan:
              </p>
              <p className="text-sm text-red-600">{data.catatan_verifikasi}</p>
            </div>
          )}
        </div>

        {/* Footer — custom actions from parent */}
        {footerActions && (
          <div className="flex items-center justify-between border-t border-gray-100 bg-white px-6 py-4">
            {footerActions}
          </div>
        )}
      </div>
    </div>
  );
}

export default KolaboratorDetailModal;
