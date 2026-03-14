/**
 * DashboardGreeting.jsx
 * Hero section: sapaan, tanggal, CTA utama
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import { RiAddCircleLine, RiStore2Line, RiEditLine } from "react-icons/ri";

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 11) return "Selamat Pagi";
  if (h < 15) return "Selamat Siang";
  if (h < 18) return "Selamat Sore";
  return "Selamat Malam";
};

const formatTanggal = () =>
  new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

export default function DashboardGreeting({ namaUser }) {
  const navigate = useNavigate();

  const QUICK_ACTIONS = [
    {
      label: "Buat Laporan",
      desc: "Laporkan tumpukan sampah",
      Icon: RiAddCircleLine,
      path: "/laporan/buat",
      bg: "bg-[#1e1f78]",
      hover: "hover:bg-[#1a1b65]",
      text: "text-white",
    },
    {
      label: "Jual Barang",
      desc: "Marketplace barang bekas",
      Icon: RiStore2Line,
      path: "/barang-bekas/jual",
      bg: "bg-white",
      hover: "hover:bg-[#f3f3fc]",
      text: "text-[#1e1f78]",
      border: "border border-[#1e1f78]/20",
    },
    {
      label: "Tulis Artikel",
      desc: "Bagikan pengetahuan",
      Icon: RiEditLine,
      path: "/artikel/buat",
      bg: "bg-white",
      hover: "hover:bg-[#f3f3fc]",
      text: "text-[#5697ff]",
      border: "border border-[#5697ff]/20",
    },
  ];

  return (
    <div className="rounded-2xl bg-gradient-to-br from-[#1e1f78] to-[#034f99] p-6 text-white shadow-lg">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        {/* Text */}
        <div>
          <p className="text-[13px] font-medium text-white/60">
            {formatTanggal()}
          </p>
          <h1 className="mt-1 text-[22px] leading-tight font-black tracking-tight">
            {getGreeting()},{" "}
            <span className="text-[#12bae3]">{namaUser || "Pengguna"}</span>
          </h1>
          <p className="mt-1 text-[13px] text-white/70">
            Selamat datang kembali di TorangBersih. Yuk, buat kontribusi hari
            ini.
          </p>
        </div>

        {/* Quick actions */}
        <div className="flex flex-wrap gap-2 sm:flex-nowrap">
          {QUICK_ACTIONS.map((a) => (
            <button
              key={a.label}
              type="button"
              onClick={() => navigate(a.path)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-[12px] font-bold shadow-sm transition-all ${a.bg} ${a.hover} ${a.text} ${a.border || ""}`}
            >
              <a.Icon size={16} />
              {a.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
