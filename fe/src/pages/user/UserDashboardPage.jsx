import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../utils/storage";

const token = getToken();

const formatDate = (iso) => {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const STATUS_LAPORAN = {
  menunggu: {
    label: "Menunggu",
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    dot: "bg-yellow-400",
  },
  diterima: {
    label: "Diterima",
    bg: "bg-blue-50",
    text: "text-blue-700",
    dot: "bg-blue-400",
  },
  ditindak: {
    label: "Ditindak",
    bg: "bg-orange-50",
    text: "text-orange-700",
    dot: "bg-orange-400",
  },
  ditolak: {
    label: "Ditolak",
    bg: "bg-red-50",
    text: "text-red-700",
    dot: "bg-red-400",
  },
  selesai: {
    label: "Selesai",
    bg: "bg-green-50",
    text: "text-green-700",
    dot: "bg-green-500",
  },
};

const STATUS_ARTIKEL = {
  published: { label: "Tayang", bg: "bg-green-50", text: "text-green-700" },
  draft: { label: "Draft", bg: "bg-gray-100", text: "text-gray-600" },
  archived: { label: "Arsip", bg: "bg-orange-50", text: "text-orange-700" },
};

// ─── SVG Icons ────────────────────────────────────────────────────
// Ikon khusus untuk menggantikan emoji
const Icons = {
  Laporan: (
    <svg
      className="size-6 text-current"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
      />
    </svg>
  ),
  Artikel: (
    <svg
      className="size-6 text-current"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z"
      />
    </svg>
  ),
  Aset: (
    <svg
      className="size-6 text-current"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"
      />
    </svg>
  ),
  Kolaborator: (
    <svg
      className="size-6 text-current"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
      />
    </svg>
  ),
  Marketplace: (
    <svg
      className="size-6 text-current"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.999 2.999 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.999 2.999 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z"
      />
    </svg>
  ),
  Komentar: (
    <svg
      className="size-6 text-current"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
      />
    </svg>
  ),
  Likes: (
    <svg
      className="size-6 text-current"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
      />
    </svg>
  ),
  TindakLanjut: (
    <svg
      className="size-6 text-current"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z"
      />
    </svg>
  ),
  DaurUlang: (
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
        d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3"
      />
    </svg>
  ),
  Residu: (
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
        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
      />
    </svg>
  ),
  EmptyBox: (
    <svg
      className="size-16 text-gray-300"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
      />
    </svg>
  ),
};

// ─── Sub-components ────────────────────────────────────────────────

const StatCard = ({ icon, label, value, sub, accent = "#1e1f78", onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex w-full items-center gap-4 rounded-xl border border-gray-100 bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
  >
    <div
      className="flex size-11 shrink-0 items-center justify-center rounded-xl"
      style={{ background: `${accent}15`, color: accent }}
    >
      {icon}
    </div>
    <div className="min-w-0 flex-1">
      <p className="truncate text-[12px] font-medium text-gray-500">{label}</p>
      <p
        className="text-[26px] leading-tight font-black"
        style={{ color: accent }}
      >
        {value}
      </p>
      {sub && <p className="mt-0.5 text-[11px] text-gray-400">{sub}</p>}
    </div>
    <svg
      className="size-4 shrink-0 text-gray-300"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  </button>
);

const StatusBar = ({ label, value, total, color }) => {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <p className="w-20 shrink-0 text-[12px] text-gray-600">{label}</p>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <p className="w-6 text-right text-[12px] font-bold text-gray-700">
        {value}
      </p>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const s = STATUS_LAPORAN[status] || STATUS_LAPORAN.menunggu;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${s.bg} ${s.text}`}
    >
      <span className={`size-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
};

const LaporanCard = ({ laporan, onLihat }) => (
  <div
    className="flex cursor-pointer gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm hover:border-gray-200"
    onClick={onLihat}
  >
    {/* Foto */}
    <div className="size-16 shrink-0 overflow-hidden rounded-lg bg-gray-100">
      {laporan.foto_bukti_urls?.[0] ? (
        <img
          src={laporan.foto_bukti_urls[0]}
          alt="bukti"
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full items-center justify-center text-gray-300">
          <svg
            className="size-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5"
            />
          </svg>
        </div>
      )}
    </div>

    {/* Info */}
    <div className="min-w-0 flex-1">
      <div className="flex items-start justify-between gap-2">
        <p className="truncate text-[13px] leading-tight font-bold text-gray-900">
          {laporan.jenis_sampah?.nama ||
            laporan.jenis_sampah ||
            "Tidak diketahui"}
          {laporan.estimasi_berat_kg && (
            <span className="ml-1 text-[11px] font-normal text-gray-400">
              · {laporan.estimasi_berat_kg} kg
            </span>
          )}
        </p>
        <StatusBadge status={laporan.status_laporan} />
      </div>

      <p className="mt-1 line-clamp-1 text-[12px] text-gray-500">
        <span className="mr-1 font-bold text-gray-400">Lokasi:</span>
        {laporan.alamat_lokasi || "-"}
      </p>

      <div className="mt-2 flex items-center justify-between">
        <p className="text-[11px] text-gray-400">
          {formatDate(laporan.created_at)}
        </p>
        <div className="flex items-center gap-2">
          {laporan.karakteristik && (
            <span className="flex items-center gap-1 rounded-full bg-[#f0f1ff] px-2 py-0.5 text-[10px] font-semibold text-[#1e1f78]">
              {laporan.karakteristik === "bisa_didaur_ulang"
                ? Icons.DaurUlang
                : Icons.Residu}
              {laporan.karakteristik === "bisa_didaur_ulang"
                ? "Daur ulang"
                : "Residu"}
            </span>
          )}
          {laporan.bentuk_timbulan && (
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-600 capitalize">
              {laporan.bentuk_timbulan}
            </span>
          )}
        </div>
      </div>
    </div>
  </div>
);

const AktivitasGrid = ({ data }) => {
  const items = [
    {
      icon: Icons.Aset,
      label: "Aset Terdaftar",
      val: data.my_aset,
      accent: "#5697ff",
    },
    {
      icon: Icons.Kolaborator,
      label: "Kolaborator",
      val: data.my_kolaborator,
      accent: "#12bae3",
    },
    {
      icon: Icons.Marketplace,
      label: "Marketplace",
      val: data.my_marketplace,
      accent: "#034f99",
    },
    {
      icon: Icons.Komentar,
      label: "Komentar",
      val: data.my_komentar,
      accent: "#696969",
    },
    {
      icon: Icons.Likes,
      label: "Likes Diberikan",
      val: data.my_likes_diberikan,
      accent: "#e11d48",
    },
    {
      icon: Icons.TindakLanjut,
      label: "Tindak Lanjut",
      val: data.my_tindak_lanjut,
      accent: "#f59e0b",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-gray-100 bg-white p-3 text-center shadow-sm"
        >
          <span style={{ color: item.accent }}>{item.icon}</span>
          <p
            className="text-[22px] leading-none font-black"
            style={{ color: item.accent }}
          >
            {item.val}
          </p>
          <p className="text-[10px] leading-tight text-gray-400">
            {item.label}
          </p>
        </div>
      ))}
    </div>
  );
};

const UserDashboardPage = () => {
  const navigate = useNavigate();

  // State untuk menyimpan data dari API
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Fungsi Fetch Data Backend
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        console.log("Isi Token di Frontend:", token);

        const response = await fetch(
          "http://127.0.0.1:5000/api/dashboard/user",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const result = await response.json();

        if (response.ok && result.success) {
          setData(result.data);
        } else {
          setErrorMsg(result.message || "Gagal memuat data dashboard");
        }
      } catch (error) {
        console(error)
        setErrorMsg("Terjadi kesalahan koneksi ke server.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  // Tampilan saat Loading
  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <div className="size-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#1e1f78]"></div>
        <p className="text-sm font-semibold text-gray-500">
          Memuat statistik...
        </p>
      </div>
    );
  }

  // Tampilan saat Error
  if (errorMsg) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
        <svg
          className="mb-4 size-16 text-red-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <p className="text-lg font-bold text-gray-900">Gagal Memuat Data</p>
        <p className="mt-1 mb-4 text-sm text-gray-500">{errorMsg}</p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-lg bg-[#1e1f78] px-5 py-2 text-[13px] font-bold text-white hover:bg-[#16175e]"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  // Aman, data tersedia
  const totalLaporan = data.my_laporan;
  const laporanStatus = data.my_laporan_per_status;
  const artikelStatus = data.my_artikel_per_status;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* ── Greeting ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-black tracking-tight text-[#0f0f0f]">
            Dashboard Saya
          </h1>
          <p className="mt-0.5 text-[13px] text-gray-500">
            Pantau semua aktivitas dan kontribusi Anda.
          </p>
        </div>
        <button
          onClick={() => navigate("/laporan/buat")}
          className="flex items-center gap-2 rounded-lg bg-[#1e1f78] px-5 py-2.5 text-[13px] font-bold text-white shadow transition-colors hover:bg-[#16175e]"
        >
          <svg
            className="size-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Buat Laporan
        </button>
      </div>

      {/* ── Stat Cards Utama ── */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          icon={Icons.Laporan}
          label="Total Laporan Saya"
          value={data.my_laporan}
          sub={`${laporanStatus.menunggu} menunggu verifikasi`}
          accent="#1e1f78"
          onClick={() => navigate("/laporan")}
        />
        <StatCard
          icon={Icons.Artikel}
          label="Artikel Saya"
          value={data.my_artikel}
          sub={`${artikelStatus.published} tayang · ${artikelStatus.draft} draft`}
          accent="#5697ff"
          onClick={() => navigate("/artikel")}
        />
        <StatCard
          icon={Icons.Aset}
          label="Aset Terdaftar"
          value={data.my_aset}
          sub="Fasilitas pengelolaan sampah"
          accent="#12bae3"
          onClick={() => navigate("/aset")}
        />
      </div>

      {/* ── Dua Kolom: Laporan Status + Artikel Status ── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Status Laporan */}
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-[14px] font-bold text-gray-900">
                Status Laporan
              </p>
              <p className="text-[11px] text-gray-400">
                {totalLaporan} laporan total
              </p>
            </div>
            <button
              onClick={() => navigate("/laporan")}
              className="text-[12px] font-semibold text-[#1e1f78] hover:underline"
            >
              Lihat semua →
            </button>
          </div>
          <div className="space-y-3">
            <StatusBar
              label="Menunggu"
              value={laporanStatus.menunggu}
              total={totalLaporan}
              color="#f59e0b"
            />
            <StatusBar
              label="Diterima"
              value={laporanStatus.diterima}
              total={totalLaporan}
              color="#3b82f6"
            />
            <StatusBar
              label="Ditindak"
              value={laporanStatus.ditindak}
              total={totalLaporan}
              color="#f97316"
            />
            <StatusBar
              label="Selesai"
              value={laporanStatus.selesai}
              total={totalLaporan}
              color="#22c55e"
            />
            <StatusBar
              label="Ditolak"
              value={laporanStatus.ditolak}
              total={totalLaporan}
              color="#ef4444"
            />
          </div>
        </div>

        {/* Status Artikel */}
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-[14px] font-bold text-gray-900">
                Status Artikel
              </p>
              <p className="text-[11px] text-gray-400">
                {data.my_artikel} artikel total
              </p>
            </div>
            <button
              onClick={() => navigate("/artikel")}
              className="text-[12px] font-semibold text-[#1e1f78] hover:underline"
            >
              Lihat semua →
            </button>
          </div>

          {data.my_artikel === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
              <div className="text-gray-300">{Icons.Artikel}</div>
              <p className="mt-2 text-[13px] font-semibold text-gray-600">
                Belum ada artikel
              </p>
              <p className="text-[12px] text-gray-400">
                Bagikan pengetahuan Anda seputar pengelolaan sampah.
              </p>
              <button
                onClick={() => navigate("/artikel/buat")}
                className="mt-2 rounded-lg border border-[#1e1f78] px-4 py-1.5 text-[12px] font-bold text-[#1e1f78] transition-colors hover:bg-[#f0f1ff]"
              >
                Tulis Artikel
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <StatusBar
                label="Tayang"
                value={artikelStatus.published}
                total={data.my_artikel}
                color="#22c55e"
              />
              <StatusBar
                label="Draft"
                value={artikelStatus.draft}
                total={data.my_artikel}
                color="#94a3b8"
              />
              <StatusBar
                label="Arsip"
                value={artikelStatus.archived}
                total={data.my_artikel}
                color="#f97316"
              />
            </div>
          )}
        </div>
      </div>

      {/* ── Aktivitas Lainnya ── */}
      <div>
        <p className="mb-3 text-[14px] font-bold text-gray-900">
          Aktivitas Lainnya
        </p>
        <AktivitasGrid data={data} />
      </div>

      {/* ── Laporan Terbaru ── */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[14px] font-bold text-gray-900">Laporan Terbaru</p>
          {data.recent_laporan.length > 0 && (
            <button
              onClick={() => navigate("/laporan")}
              className="text-[12px] font-semibold text-[#1e1f78] hover:underline"
            >
              Lihat semua →
            </button>
          )}
        </div>

        {data.recent_laporan.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-gray-200 bg-white py-12 text-center">
            {Icons.EmptyBox}
            <div>
              <p className="text-[14px] font-bold text-gray-700">
                Belum ada laporan
              </p>
              <p className="mt-1 text-[12px] text-gray-400">
                Temukan tumpukan sampah ilegal? Laporkan sekarang.
              </p>
            </div>
            <button
              onClick={() => navigate("/laporan/buat")}
              className="rounded-lg bg-[#1e1f78] px-5 py-2 text-[13px] font-bold text-white transition-colors hover:bg-[#16175e]"
            >
              Buat Laporan Pertama
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {data.recent_laporan.map((laporan) => (
              <LaporanCard
                key={laporan.id}
                laporan={laporan}
                onLihat={() => navigate(`/laporan/${laporan.id}`)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Artikel Terbaru ── */}
      {data.recent_artikel.length > 0 && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[14px] font-bold text-gray-900">
              Artikel Terbaru
            </p>
            <button
              onClick={() => navigate("/artikel")}
              className="text-[12px] font-semibold text-[#1e1f78] hover:underline"
            >
              Lihat semua →
            </button>
          </div>
          <div className="space-y-3">
            {data.recent_artikel.map((artikel) => (
              <div
                key={artikel.id}
                className="flex cursor-pointer items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm hover:border-gray-200"
                onClick={() => navigate(`/artikel/${artikel.id}`)}
              >
                <div className="size-14 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  {artikel.cover_url ? (
                    <img
                      src={artikel.cover_url}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-400">
                      {Icons.Artikel}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-bold text-gray-900">
                    {artikel.judul}
                  </p>
                  <p className="mt-0.5 text-[11px] text-gray-400">
                    {formatDate(artikel.created_at)}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${STATUS_ARTIKEL[artikel.status]?.bg} ${STATUS_ARTIKEL[artikel.status]?.text}`}
                >
                  {STATUS_ARTIKEL[artikel.status]?.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboardPage;
