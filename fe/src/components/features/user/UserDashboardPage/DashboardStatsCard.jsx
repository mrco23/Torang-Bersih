import React from "react";
import { useNavigate } from "react-router-dom";
import {
  RiFileTextLine,
  RiArticleLine,
  RiBuildingLine,
  RiUserHeartLine,
  RiStore2Line,
  RiChat3Line,
  RiHeartLine,
  RiToolsLine,
  RiArrowRightSLine,
} from "react-icons/ri";

// ─── Big stat card ────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
function BigStatCard({ icon: Icon, label, value, sub, accent, path }) {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      onClick={() => navigate(path)}
      className="group flex w-full items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      {/* Icon bubble */}
      <div
        className="flex size-12 shrink-0 items-center justify-center rounded-2xl transition-transform group-hover:scale-110"
        style={{ background: `${accent}18`, color: accent }}
      >
        <Icon size={22} />
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <p className="text-[12px] font-medium text-gray-500">{label}</p>
        <p
          className="mt-0.5 text-[28px] leading-none font-black"
          style={{ color: accent }}
        >
          {value ?? 0}
        </p>
        {sub && <p className="mt-1 text-[11px] text-gray-400">{sub}</p>}
      </div>

      {/* Arrow */}
      <RiArrowRightSLine
        size={18}
        className="shrink-0 text-gray-300 transition group-hover:translate-x-0.5 group-hover:text-gray-400"
      />
    </button>
  );
}

// ─── Mini activity cell ───────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
function MiniCell({ icon: Icon, label, value, accent }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1.5 rounded-2xl border border-gray-100 bg-white p-4 text-center shadow-sm">
      <div
        className="flex size-9 items-center justify-center rounded-xl"
        style={{ background: `${accent}15`, color: accent }}
      >
        <Icon size={17} />
      </div>
      <p
        className="text-[20px] leading-none font-black"
        style={{ color: accent }}
      >
        {value ?? 0}
      </p>
      <p className="text-[10px] leading-tight text-gray-400">{label}</p>
    </div>
  );
}

// ─── Main export ─────────────────────────────────────────────────
export default function DashboardStatCards({ data }) {
  const laporanStatus = data?.my_laporan_per_status ?? {};
  const artikelStatus = data?.my_artikel_per_status ?? {};

  const MAIN = [
    {
      icon: RiFileTextLine,
      label: "Total Laporan Saya",
      value: data?.my_laporan,
      sub: `${laporanStatus.menunggu ?? 0} menunggu verifikasi`,
      accent: "#1e1f78",
      path: "/laporan",
    },
    {
      icon: RiArticleLine,
      label: "Artikel Saya",
      value: data?.my_artikel,
      sub: `${artikelStatus.published ?? 0} tayang · ${artikelStatus.draft ?? 0} draft`,
      accent: "#5697ff",
      path: "/artikel",
    },
    {
      icon: RiBuildingLine,
      label: "Aset Terdaftar",
      value: data?.my_aset,
      sub: "Fasilitas pengelolaan sampah",
      accent: "#12bae3",
      path: "/aset",
    },
  ];

  const MINI = [
    {
      icon: RiUserHeartLine,
      label: "Kolaborator",
      value: data?.my_kolaborator,
      accent: "#12bae3",
    },
    {
      icon: RiStore2Line,
      label: "Marketplace",
      value: data?.my_marketplace,
      accent: "#034f99",
    },
    {
      icon: RiChat3Line,
      label: "Komentar",
      value: data?.my_komentar,
      accent: "#696969",
    },
    {
      icon: RiHeartLine,
      label: "Likes",
      value: data?.my_likes_diberikan,
      accent: "#e11d48",
    },
    {
      icon: RiToolsLine,
      label: "Tindak Lanjut",
      value: data?.my_tindak_lanjut,
      accent: "#f59e0b",
    },
  ];

  return (
    <div className="space-y-4">
      git
      {/* Big cards — 3 col */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {MAIN.map((c) => (
          <BigStatCard key={c.label} {...c} />
        ))}
      </div>
      {/* Activity mini grid — 6 col */}
      <div>
        <p className="mb-2.5 text-[12px] font-bold tracking-widest text-gray-400 uppercase">
          Aktivitas Lainnya
        </p>
        <div className="grid grid-cols-3 gap-5 sm:grid-cols-5">
          {MINI.map((m) => (
            <MiniCell key={m.label} {...m} />
          ))}
        </div>
      </div>
    </div>
  );
}
