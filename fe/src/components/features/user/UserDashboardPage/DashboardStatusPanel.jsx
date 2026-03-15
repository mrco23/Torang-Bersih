import React from "react";
import { useNavigate } from "react-router-dom";
import { RiFileTextLine, RiArticleLine, RiAddLine } from "react-icons/ri";

const LAPORAN_STATUS = [
  {
    key: "menunggu",
    label: "Menunggu",
    color: "#f59e0b",
    bg: "bg-amber-50",
    text: "text-amber-700",
  },
  {
    key: "diterima",
    label: "Diterima",
    color: "#3b82f6",
    bg: "bg-blue-50",
    text: "text-blue-700",
  },
  {
    key: "ditindak",
    label: "Ditindak",
    color: "#f97316",
    bg: "bg-orange-50",
    text: "text-orange-700",
  },
  {
    key: "selesai",
    label: "Selesai",
    color: "#22c55e",
    bg: "bg-green-50",
    text: "text-green-700",
  },
  {
    key: "ditolak",
    label: "Ditolak",
    color: "#ef4444",
    bg: "bg-red-50",
    text: "text-red-700",
  },
];

const ARTIKEL_STATUS = [
  {
    key: "published",
    label: "Tayang",
    color: "#22c55e",
    bg: "bg-green-50",
    text: "text-green-700",
  },
  {
    key: "draft",
    label: "Draft",
    color: "#94a3b8",
    bg: "bg-gray-100",
    text: "text-gray-600",
  },
  {
    key: "archived",
    label: "Arsip",
    color: "#f97316",
    bg: "bg-orange-50",
    text: "text-orange-700",
  },
];

function BarRow({ label, value, total, color, bg, text }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      {/* Badge */}
      <span
        className={`w-[72px] shrink-0 rounded-full px-2.5 py-1 text-center text-[10px] font-bold ${bg} ${text}`}
      >
        {label}
      </span>
      {/* Bar */}
      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      {/* Count */}
      <span className="w-5 text-right text-[13px] font-bold text-gray-700">
        {value}
      </span>
    </div>
  );
}

// eslint-disable-next-line no-unused-vars
function PanelCard({ title, sub, linkLabel, linkPath, Icon, children }) {
  const navigate = useNavigate();

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-[#f3f3fc]">
            <Icon size={17} className="text-[#1e1f78]" />
          </div>
          <div>
            <p className="text-[14px] font-bold text-gray-900">{title}</p>
            <p className="text-[11px] text-gray-400">{sub}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigate(linkPath)}
          className="shrink-0 text-[11px] font-semibold text-[#1e1f78] transition hover:underline"
        >
          {linkLabel} →
        </button>
      </div>
      {children}
    </div>
  );
}

export default function DashboardStatusPanel({ data }) {
  const navigate = useNavigate();

  const totalLaporan = data?.my_laporan ?? 0;
  const totalArtikel = data?.my_artikel ?? 0;
  const laporanStatus = data?.my_laporan_per_status ?? {};
  const artikelStatus = data?.my_artikel_per_status ?? {};

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {/* ── Status Laporan ── */}
      <PanelCard
        title="Status Laporan"
        sub={`${totalLaporan} laporan total`}
        linkLabel="Lihat semua"
        linkPath="/laporan"
        Icon={RiFileTextLine}
      >
        {totalLaporan === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
            <RiFileTextLine size={40} className="text-gray-200" />
            <p className="text-[13px] font-semibold text-gray-600">
              Belum ada laporan
            </p>
            <p className="text-[12px] text-gray-400">
              Temukan sampah? Laporkan sekarang.
            </p>
            <button
              type="button"
              onClick={() => navigate("/laporan/buat")}
              className="mt-1 flex items-center gap-1.5 rounded-lg bg-[#1e1f78] px-4 py-2 text-[12px] font-bold text-white transition hover:bg-[#1a1b65]"
            >
              <RiAddLine size={14} /> Buat Laporan
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {LAPORAN_STATUS.map((s) => (
              <BarRow
                key={s.key}
                label={s.label}
                value={laporanStatus[s.key] ?? 0}
                total={totalLaporan}
                color={s.color}
                bg={s.bg}
                text={s.text}
              />
            ))}
          </div>
        )}
      </PanelCard>

      {/* ── Status Artikel ── */}
      <PanelCard
        title="Status Artikel"
        sub={`${totalArtikel} artikel total`}
        linkLabel="Lihat semua"
        linkPath="/artikel"
        Icon={RiArticleLine}
      >
        {totalArtikel === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
            <RiArticleLine size={40} className="text-gray-200" />
            <p className="text-[13px] font-semibold text-gray-600">
              Belum ada artikel
            </p>
            <p className="text-[12px] text-gray-400">
              Bagikan pengetahuan seputar pengelolaan sampah.
            </p>
            <button
              type="button"
              onClick={() => navigate("/artikel/buat")}
              className="mt-1 flex items-center gap-1.5 rounded-lg border border-[#1e1f78] px-4 py-2 text-[12px] font-bold text-[#1e1f78] transition hover:bg-[#f3f3fc]"
            >
              <RiAddLine size={14} /> Tulis Artikel
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {ARTIKEL_STATUS.map((s) => (
              <BarRow
                key={s.key}
                label={s.label}
                value={artikelStatus[s.key] ?? 0}
                total={totalArtikel}
                color={s.color}
                bg={s.bg}
                text={s.text}
              />
            ))}
          </div>
        )}
      </PanelCard>
    </div>
  );
}
