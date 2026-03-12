import {
  RiRecycleLine,
  RiCamera2Line,
  RiStoreLine,
  RiPriceTag3Line,
  RiMapPinLine,
} from "react-icons/ri";

// Kondisi barang — values sesuai enum backend: layak_pakai, butuh_perbaikan, rongsokan
export const KONDISI = [
  {
    value: "layak_pakai",
    label: "Layak Pakai",
    desc: "Siap digunakan",
    dot: "bg-emerald-500",
    active: "border-emerald-400 bg-emerald-50 text-emerald-800",
  },
  {
    value: "butuh_perbaikan",
    label: "Butuh Perbaikan",
    desc: "Perlu diperbaiki",
    dot: "bg-amber-500",
    active: "border-amber-400 bg-amber-50 text-amber-800",
  },
  {
    value: "rongsokan",
    label: "Rongsokan",
    desc: "Untuk material daur ulang",
    dot: "bg-red-400",
    active: "border-red-400 bg-red-50 text-red-800",
  },
];

// Label mapping untuk display
export const KONDISI_LABELS = {
  layak_pakai: { text: "Layak Pakai", bg: "bg-green-50", color: "text-green-700" },
  butuh_perbaikan: { text: "Butuh Perbaikan", bg: "bg-yellow-50", color: "text-yellow-700" },
  rongsokan: { text: "Rongsokan", bg: "bg-red-50", color: "text-red-700" },
};

export const STATUS_LABELS = {
  tersedia: { text: "Tersedia", bg: "bg-green-50", color: "text-green-700" },
  dipesan: { text: "Dipesan", bg: "bg-blue-50", color: "text-blue-700" },
  terjual: { text: "Terjual", bg: "bg-gray-100", color: "text-gray-600" },
};

export const MAX_FOTO = 8;

export const STEPS = [
  { id: 1, label: "Foto", icon: RiCamera2Line },
  { id: 2, label: "Detail", icon: RiStoreLine },
  { id: 3, label: "Harga", icon: RiPriceTag3Line },
  { id: 4, label: "Lokasi & Kontak", icon: RiMapPinLine },
];

export const inputCls =
  "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-[13px] text-gray-800 placeholder:text-gray-400 transition-all focus:border-[#1e1f78] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1e1f78]/10";

export const formatHarga = (harga) => {
  if (!harga || harga === 0) return "Gratis";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(harga);
};
