import React from "react";
import { Link } from "react-router-dom";
import { KONDISI_LABELS, formatHarga } from "./InputBarang/Constant";

const ProductCard = ({ product }) => {
  const kondisi = KONDISI_LABELS[product.kondisi] || {};

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-lg">
      {/* Overlay Terjual */}
      {product.status_ketersediaan === "terjual" && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-[2px]">
          <span className="-rotate-12 transform rounded-lg bg-gray-900 px-4 py-2 font-bold text-white shadow-lg">
            SUDAH TERJUAL
          </span>
        </div>
      )}

      <Link
        to={`/barang-bekas/${product.id}`}
        className="relative block aspect-square overflow-hidden bg-gray-100"
      >
        <img
          src={product.foto_barang_urls?.[0] || "/placeholder.jpg"}
          alt={product.nama_barang}
          className={`h-full w-full object-cover transition-transform duration-500 ${
            product.status_ketersediaan === "terjual"
              ? "grayscale"
              : "group-hover:scale-105"
          }`}
        />
        <div
          className={`absolute top-3 left-3 rounded border px-2 py-1 text-[10px] font-bold tracking-wide uppercase ${kondisi.bg || "bg-gray-100"} ${kondisi.color || "text-gray-700"}`}
        >
          {kondisi.text || product.kondisi}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link to={`/barang-bekas/${product.id}`}>
          <h3 className="mb-1 line-clamp-2 cursor-pointer text-sm leading-snug font-bold text-gray-900 transition-colors group-hover:text-blue-600">
            {product.nama_barang}
          </h3>
        </Link>

        <div className="mt-1 flex items-end gap-1 text-lg font-extrabold text-gray-900">
          {product.harga === 0 ? (
            <span className="font-bold text-green-600">Gratis (Donasi)</span>
          ) : (
            formatHarga(product.harga)
          )}
          {product.berat_estimasi_kg && (
            <span className="mb-1 ml-1 text-xs font-medium text-gray-400">
              ~ {product.berat_estimasi_kg} kg
            </span>
          )}
        </div>

        <div className="mt-auto space-y-1.5 pt-4">
          <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="truncate">
              {product.penjual?.full_name || product.penjual?.username || "Anonim"}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
            <svg
              className="h-3.5 w-3.5 text-red-400"
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
            <span className="truncate">
              {product.kabupaten_kota || "Lokasi belum ditentukan"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
