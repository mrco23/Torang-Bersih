import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { kolaboratorAPI } from "../../services/api/routes/kolaborator.route";
import { referensiAPI } from "../../services/api/routes/referensi.route";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import toaster from "../../utils/toaster";

const markerIcon = new L.divIcon({
  className: "bg-transparent",
  html: `<div class="relative flex items-center justify-center size-8">
      <div class="absolute size-full bg-blue-600 rounded-full animate-ping opacity-30"></div>
      <div class="relative size-5 bg-blue-600 border-2 border-white rounded-full shadow-lg z-10"></div>
    </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

const StatusBadge = ({ status }) => {
  if (status === "terverifikasi")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-bold text-green-700 ring-1 ring-green-600/20">
        <span className="size-1.5 rounded-full bg-green-500" />
        Terverifikasi
      </span>
    );
  if (status === "ditolak")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-700 ring-1 ring-red-600/20">
        <span className="size-1.5 rounded-full bg-red-500" />
        Ditolak
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 ring-1 ring-amber-600/20">
      <span className="size-1.5 animate-pulse rounded-full bg-amber-500" />
      Menunggu Verifikasi
    </span>
  );
};

// ── Map interaction components ─────────────────────────────────────
function EditMapClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function EditMapCenterUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, 15, { duration: 1 });
  }, [center, map]);
  return null;
}

// ── Geocoding helpers ──────────────────────────────────────────────
const reverseGeocode = async (lat, lng) => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      { headers: { "Accept-Language": "id" } },
    );
    const data = await res.json();
    if (data?.address) {
      const a = data.address;
      return {
        kabupaten_kota:
          a.city ||
          a.county ||
          a.town ||
          a.municipality ||
          a.state_district ||
          "",
        alamat_lengkap: data.display_name || "",
      };
    }
    return null;
  } catch {
    return null;
  }
};

const forwardGeocode = async (query) => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&addressdetails=1`,
      { headers: { "Accept-Language": "id" } },
    );
    const data = await res.json();
    if (data?.length > 0) {
      const r = data[0];
      const a = r.address || {};
      return {
        latitude: parseFloat(r.lat),
        longitude: parseFloat(r.lon),
        kabupaten_kota:
          a.city ||
          a.county ||
          a.town ||
          a.municipality ||
          a.state_district ||
          "",
        alamat_lengkap: r.display_name || query,
      };
    }
    return null;
  } catch {
    return null;
  }
};

// ── Input helper ───────────────────────────────────────────────────
const inputCls =
  "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-(--primary) focus:ring-1 focus:ring-(--primary) focus:outline-none transition";
const labelCls =
  "block mb-1.5 text-xs font-bold text-gray-600 uppercase tracking-wider";

function UserKolaboratorPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  // Edit state
  const [editing, setEditing] = useState(null); // item being edited
  const [editForm, setEditForm] = useState({});
  const [editLogoFile, setEditLogoFile] = useState(null);
  const [editLogoPreview, setEditLogoPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [jenisOptions, setJenisOptions] = useState([]);
  const [editMapCenter, setEditMapCenter] = useState(null);
  const [editGeocoding, setEditGeocoding] = useState(false);
  const [editGpsLoading, setEditGpsLoading] = useState(false);
  const [editSearchQuery, setEditSearchQuery] = useState("");
  const logoInputRef = useRef(null);

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await kolaboratorAPI.getMy();
      setItems(res.data.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Gagal memuat data kolaborator Anda",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Fetch jenis options when edit modal opens
  useEffect(() => {
    if (editing && jenisOptions.length === 0) {
      referensiAPI
        .getAll("jenis-kolaborator")
        .then((res) => setJenisOptions(res.data.data || []))
        .catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editing]);

  const handleDelete = async (id) => {
    if (!confirm("Hapus kolaborator ini?")) return;
    try {
      await kolaboratorAPI.delete(id);
      toaster.success("Kolaborator berhasil dihapus");
      fetchItems();
      if (selected?.id === id) setSelected(null);
      if (editing?.id === id) setEditing(null);
    } catch (err) {
      toaster.error(
        err.response?.data?.message || "Gagal menghapus kolaborator",
      );
    }
  };

  // ── Open edit modal ──────────────────────────────────────────────
  const openEdit = (item) => {
    setSelected(null); // close detail modal
    setEditing(item);
    setEditForm({
      nama_organisasi: item.nama_organisasi || "",
      jenis_kolaborator_id: item.jenis_kolaborator_id || "",
      deskripsi: item.deskripsi || "",
      kabupaten_kota: item.kabupaten_kota || "",
      alamat_lengkap: item.alamat_lengkap || "",
      latitude: item.latitude || "",
      longitude: item.longitude || "",
      penanggung_jawab: item.penanggung_jawab || "",
      kontak: item.kontak || "",
      email: item.email || "",
      sosmed: item.sosmed || "",
    });
    setEditLogoFile(null);
    setEditLogoPreview(item.logo_url || null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditLogo = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
    if (!allowed.includes(file.type)) {
      toaster.error(
        "Format file tidak didukung. Gunakan JPG, PNG, WEBP, atau SVG.",
      );
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toaster.error("Ukuran file melebihi 2MB.");
      return;
    }
    setEditLogoFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setEditLogoPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleEditSubmit = async () => {
    if (!editForm.nama_organisasi || !editForm.jenis_kolaborator_id) {
      toaster.warning("Nama organisasi dan jenis kolaborator wajib diisi.");
      return;
    }
    setSubmitting(true);
    try {
      await kolaboratorAPI.update(editing.id, editForm, editLogoFile);
      toaster.success("Data kolaborator berhasil diperbarui!");
      setEditing(null);
      fetchItems();
    } catch (err) {
      const msg =
        err.response?.data?.message || "Gagal memperbarui data kolaborator";
      toaster.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Empty State ──────────────────────────────────────────────────
  if (!loading && !error && items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="mb-6 flex size-28 items-center justify-center rounded-full bg-linear-to-br from-blue-50 to-indigo-100">
          <svg
            className="size-14 text-(--primary)"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
            />
          </svg>
        </div>
        <h2 className="mb-2 text-xl font-bold text-gray-900">
          Belum Ada Kolaborator
        </h2>
        <p className="mb-8 max-w-sm text-sm text-gray-500">
          Anda belum mendaftarkan organisasi atau komunitas sebagai kolaborator.
          Daftarkan sekarang dan bergabung dalam gerakan perubahan!
        </p>
        <button
          onClick={() => navigate("/kolaborator/daftar")}
          className="flex items-center gap-2 rounded-xl bg-(--primary) px-8 py-3 text-sm font-bold text-white shadow-(--primary)/25 shadow-lg transition hover:bg-(--primary-dark) active:scale-95"
        >
          <svg
            className="size-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Daftar Kolaborator Baru
        </button>
      </div>
    );
  }

  return (
    <div className="relative space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Kolaborator Saya</h1>
          <p className="mt-1 text-sm text-gray-500">
            Daftar organisasi/komunitas yang Anda daftarkan sebagai kolaborator.
          </p>
        </div>
        <button
          onClick={() => navigate("/kolaborator/daftar")}
          className="flex shrink-0 items-center gap-2 rounded-xl bg-(--primary) px-5 py-2.5 text-sm font-bold text-white transition hover:bg-(--primary-dark) active:scale-95"
        >
          <svg
            className="size-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Daftar Baru
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="size-8 animate-spin rounded-full border-4 border-(--primary) border-t-transparent" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="group flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-start gap-3 p-5 pb-3">
                <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                  {item.logo_url ? (
                    <img
                      src={item.logo_url}
                      alt="Logo"
                      className="size-full object-cover"
                    />
                  ) : (
                    <span className="text-lg font-bold text-gray-400">
                      {item.nama_organisasi?.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3
                    className="truncate text-sm font-bold text-gray-900"
                    title={item.nama_organisasi}
                  >
                    {item.nama_organisasi}
                  </h3>
                  <p className="mt-0.5 truncate text-xs text-gray-500">
                    {item.jenis_kolaborator?.nama || "—"}
                  </p>
                </div>
              </div>
              <div className="flex-1 space-y-2.5 px-5 pb-4">
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <svg
                    className="size-3.5 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0115 0z"
                    />
                  </svg>
                  <span className="truncate">
                    {item.kabupaten_kota || "Lokasi belum diisi"}
                  </span>
                </div>
                <StatusBadge status={item.status_verifikasi} />
              </div>
              <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/50 px-5 py-3">
                <span className="text-[10px] text-gray-400">
                  {new Date(item.created_at).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(item)}
                    className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-(--primary) ring-1 ring-(--primary)/20 transition hover:bg-(--primary)/5"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setSelected(item)}
                    className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-gray-700 ring-1 ring-gray-200 transition hover:bg-gray-100"
                  >
                    Detail
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ═══ DETAIL MODAL ═════════════════════════════════════════════ */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-gray-900/60 p-4 backdrop-blur-sm sm:p-6">
          <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-gray-900">
                  Detail Kolaborator
                </h2>
                <StatusBadge status={selected.status_verifikasi} />
              </div>
              <button
                onClick={() => setSelected(null)}
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

            <div className="flex-1 space-y-6 overflow-y-auto bg-[#F8FAFC] p-6">
              <div className="flex flex-col items-start gap-5 sm:flex-row">
                <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-gray-100 bg-white p-1 shadow-sm">
                  {selected.logo_url ? (
                    <img
                      src={selected.logo_url}
                      alt="Logo"
                      className="size-full rounded-xl object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-gray-300">
                      {selected.nama_organisasi?.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <span className="mb-2 inline-block rounded bg-blue-50 px-2 py-1 text-xs font-bold tracking-wider text-blue-600 uppercase">
                    {selected.jenis_kolaborator?.nama || "—"}
                  </span>
                  <h3 className="mb-2 text-xl font-extrabold text-gray-900">
                    {selected.nama_organisasi}
                  </h3>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap text-gray-500">
                    {selected.deskripsi || "Tidak ada deskripsi."}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* Lokasi Card */}
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
                        {selected.kabupaten_kota || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
                        Alamat Lengkap
                      </p>
                      <p className="mt-0.5 text-sm font-medium text-gray-800">
                        {selected.alamat_lengkap || "-"}
                      </p>
                    </div>
                    <div className="relative z-0 mt-3 h-[160px] w-full overflow-hidden rounded-lg border border-gray-200">
                      {selected.latitude && selected.longitude ? (
                        <MapContainer
                          center={[selected.latitude, selected.longitude]}
                          zoom={15}
                          scrollWheelZoom={false}
                          dragging={false}
                          zoomControl={false}
                          style={{ height: "100%", width: "100%", zIndex: 0 }}
                        >
                          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                          <Marker
                            position={[selected.latitude, selected.longitude]}
                            icon={markerIcon}
                          >
                            <Popup>
                              <strong>{selected.nama_organisasi}</strong>
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
                    </div>
                  </div>
                </div>
                {/* Kontak Card */}
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
                          {selected.penanggung_jawab || "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
                          WhatsApp
                        </p>
                        <p className="mt-0.5 font-medium text-gray-800">
                          {selected.kontak || "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
                          Email
                        </p>
                        <p className="mt-0.5 font-medium text-gray-800">
                          {selected.email || "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] font-bold tracking-wider text-gray-400 uppercase">
                          Sosial Media
                        </p>
                        {selected.sosmed ? (
                          <a
                            href={
                              selected.sosmed.startsWith("http")
                                ? selected.sosmed
                                : `https://${selected.sosmed}`
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="mt-0.5 block truncate font-medium text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {selected.sosmed.replace(/^https?:\/\//, "")}
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
                      {new Date(selected.created_at).toLocaleDateString(
                        "id-ID",
                        { day: "numeric", month: "long", year: "numeric" },
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {selected.status_verifikasi === "ditolak" &&
                selected.catatan_verifikasi && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                    <p className="mb-1 text-xs font-bold text-red-700">
                      Catatan Penolakan:
                    </p>
                    <p className="text-sm text-red-600">
                      {selected.catatan_verifikasi}
                    </p>
                  </div>
                )}
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 bg-white px-6 py-4">
              <button
                onClick={() => handleDelete(selected.id)}
                className="flex items-center gap-1.5 text-sm font-bold text-red-500 transition hover:text-red-700"
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
                Hapus
              </button>
              <div className="flex gap-3">
                <button
                  onClick={() => openEdit(selected)}
                  className="rounded-xl bg-(--primary) px-6 py-2.5 text-sm font-bold text-white transition hover:bg-(--primary-dark)"
                >
                  Edit Data
                </button>
                <button
                  onClick={() => setSelected(null)}
                  className="rounded-xl bg-gray-100 px-6 py-2.5 text-sm font-bold text-gray-700 transition hover:bg-gray-200"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ EDIT MODAL ═══════════════════════════════════════════════ */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-gray-900/60 p-4 backdrop-blur-sm sm:p-6">
          <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* Edit Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <h2 className="text-lg font-bold text-gray-900">
                Edit Kolaborator
              </h2>
              <button
                onClick={() => setEditing(null)}
                disabled={submitting}
                className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
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

            {/* Edit Form Body */}
            <div className="flex-1 space-y-6 overflow-y-auto p-6">
              {/* Logo */}
              <div className="flex items-center gap-5">
                <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                  {editLogoPreview ? (
                    <img
                      src={editLogoPreview}
                      alt="Preview"
                      className="size-full object-cover"
                    />
                  ) : (
                    <span className="text-xl font-bold text-gray-300">
                      {editForm.nama_organisasi?.charAt(0)}
                    </span>
                  )}
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-bold text-gray-700 transition hover:bg-gray-50"
                  >
                    Ganti Logo
                  </button>
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/svg+xml"
                    onChange={handleEditLogo}
                    className="hidden"
                  />
                  <p className="mt-1 text-[10px] text-gray-400">
                    JPG, PNG, WEBP, SVG · Maks. 2MB
                  </p>
                </div>
              </div>

              {/* Profil */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelCls}>Nama Organisasi</label>
                  <input
                    name="nama_organisasi"
                    value={editForm.nama_organisasi}
                    onChange={handleEditChange}
                    maxLength={100}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Jenis Kolaborator</label>
                  <select
                    name="jenis_kolaborator_id"
                    value={editForm.jenis_kolaborator_id}
                    onChange={handleEditChange}
                    className={inputCls}
                  >
                    <option value="">-- Pilih --</option>
                    {jenisOptions.map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.nama}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className={labelCls}>Deskripsi</label>
                <textarea
                  name="deskripsi"
                  value={editForm.deskripsi}
                  onChange={handleEditChange}
                  rows={4}
                  className={`${inputCls} resize-none`}
                />
                <p className="mt-1 text-right text-[10px] text-gray-400">
                  {editForm.deskripsi.length} karakter
                </p>
              </div>

              {/* Lokasi — Interactive Map */}
              <div>
                <label className={labelCls}>Lokasi di Peta</label>
                {/* Search */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!editSearchQuery.trim()) return;
                    setEditGeocoding(true);
                    forwardGeocode(editSearchQuery).then((result) => {
                      if (result) {
                        setEditForm((prev) => ({ ...prev, ...result }));
                        setEditMapCenter([result.latitude, result.longitude]);
                      }
                      setEditGeocoding(false);
                    });
                  }}
                  className="mb-2 flex gap-2"
                >
                  <div className="relative flex-1">
                    <svg
                      className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-gray-400"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <input
                      type="text"
                      value={editSearchQuery}
                      onChange={(e) => setEditSearchQuery(e.target.value)}
                      placeholder="Cari alamat..."
                      className="w-full rounded-lg border border-gray-200 py-2 pr-3 pl-9 text-sm focus:border-(--primary) focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={editGeocoding}
                    className="shrink-0 rounded-lg bg-(--primary) px-4 py-2 text-sm font-bold text-white transition hover:bg-(--primary-dark) disabled:opacity-50"
                  >
                    {editGeocoding ? "..." : "Cari"}
                  </button>
                </form>

                {/* Map */}
                <div className="overflow-hidden rounded-xl border border-gray-200">
                  <div className="relative z-0 h-[220px] bg-gray-100">
                    <MapContainer
                      center={[
                        editForm.latitude || 1.4748,
                        editForm.longitude || 124.8421,
                      ]}
                      zoom={13}
                      scrollWheelZoom={true}
                      style={{ height: "100%", width: "100%", zIndex: 0 }}
                    >
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <EditMapClickHandler
                        onMapClick={async (lat, lng) => {
                          setEditForm((prev) => ({
                            ...prev,
                            latitude: lat,
                            longitude: lng,
                          }));
                          setEditGeocoding(true);
                          const result = await reverseGeocode(lat, lng);
                          if (result)
                            setEditForm((prev) => ({ ...prev, ...result }));
                          setEditGeocoding(false);
                        }}
                      />
                      {editMapCenter && (
                        <EditMapCenterUpdater center={editMapCenter} />
                      )}
                      {editForm.latitude && editForm.longitude && (
                        <Marker
                          position={[editForm.latitude, editForm.longitude]}
                          icon={markerIcon}
                        />
                      )}
                    </MapContainer>

                    {/* GPS Button */}
                    <button
                      type="button"
                      onClick={() => {
                        if (!navigator.geolocation) return;
                        setEditGpsLoading(true);
                        navigator.geolocation.getCurrentPosition(
                          async (pos) => {
                            const { latitude, longitude } = pos.coords;
                            setEditForm((prev) => ({
                              ...prev,
                              latitude,
                              longitude,
                            }));
                            setEditMapCenter([latitude, longitude]);
                            setEditGeocoding(true);
                            const result = await reverseGeocode(
                              latitude,
                              longitude,
                            );
                            if (result)
                              setEditForm((prev) => ({ ...prev, ...result }));
                            setEditGeocoding(false);
                            setEditGpsLoading(false);
                          },
                          () => setEditGpsLoading(false),
                          { enableHighAccuracy: true, timeout: 10000 },
                        );
                      }}
                      disabled={editGpsLoading}
                      className="absolute right-3 bottom-3 z-1000 flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-[12px] font-bold text-gray-700 shadow-md ring-1 ring-gray-900/10 transition hover:bg-gray-50 active:scale-95 disabled:opacity-50"
                    >
                      {editGpsLoading ? (
                        <div className="size-4 animate-spin rounded-full border-2 border-(--primary) border-t-transparent" />
                      ) : (
                        <svg
                          className="size-4 text-(--primary)"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 2a1 1 0 011 1v2.07A7.003 7.003 0 0118.93 11H21a1 1 0 110 2h-2.07A7.003 7.003 0 0113 18.93V21a1 1 0 11-2 0v-2.07A7.003 7.003 0 015.07 13H3a1 1 0 110-2h2.07A7.003 7.003 0 0111 5.07V3a1 1 0 011-1zm0 5a5 5 0 100 10 5 5 0 000-10z"
                          />
                        </svg>
                      )}
                      {editGpsLoading ? "Mendeteksi..." : "GPS"}
                    </button>
                  </div>

                  {/* Koordinat bar */}
                  <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-4 py-2">
                    <p className="text-[11px] text-gray-500">
                      {editForm.latitude && editForm.longitude ? (
                        <>
                          <span className="font-semibold text-gray-700">
                            Koordinat:
                          </span>{" "}
                          <span className="font-mono">
                            {Number(editForm.latitude).toFixed(6)},{" "}
                            {Number(editForm.longitude).toFixed(6)}
                          </span>
                        </>
                      ) : (
                        "Klik pada peta atau gunakan GPS"
                      )}
                    </p>
                    {editGeocoding && (
                      <span className="text-[11px] font-medium text-(--primary)">
                        Mengambil alamat...
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Kota & Alamat — auto-filled but editable */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelCls}>Kota / Kabupaten</label>
                  <input
                    name="kabupaten_kota"
                    value={editForm.kabupaten_kota}
                    onChange={handleEditChange}
                    placeholder="Terisi otomatis dari peta"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Alamat Lengkap</label>
                  <input
                    name="alamat_lengkap"
                    value={editForm.alamat_lengkap}
                    onChange={handleEditChange}
                    placeholder="Terisi otomatis dari peta"
                    className={inputCls}
                  />
                </div>
              </div>

              {/* Kontak */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelCls}>Penanggung Jawab</label>
                  <input
                    name="penanggung_jawab"
                    value={editForm.penanggung_jawab}
                    onChange={handleEditChange}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Kontak (WhatsApp)</label>
                  <input
                    name="kontak"
                    value={editForm.kontak}
                    onChange={handleEditChange}
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelCls}>Email</label>
                  <input
                    name="email"
                    type="email"
                    value={editForm.email}
                    onChange={handleEditChange}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Sosial Media</label>
                  <input
                    name="sosmed"
                    value={editForm.sosmed}
                    onChange={handleEditChange}
                    placeholder="https://instagram.com/..."
                    className={inputCls}
                  />
                </div>
              </div>
            </div>

            {/* Edit Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-gray-100 bg-white px-6 py-4">
              <button
                onClick={() => setEditing(null)}
                disabled={submitting}
                className="rounded-xl bg-gray-100 px-6 py-2.5 text-sm font-bold text-gray-700 transition hover:bg-gray-200 disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={handleEditSubmit}
                disabled={submitting}
                className="flex items-center gap-2 rounded-xl bg-(--primary) px-6 py-2.5 text-sm font-bold text-white transition hover:bg-(--primary-dark) disabled:opacity-70"
              >
                {submitting && (
                  <div className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                )}
                {submitting ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserKolaboratorPage;
