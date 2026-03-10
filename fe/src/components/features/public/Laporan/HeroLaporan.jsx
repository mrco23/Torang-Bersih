import React from "react";
import FloatingIcons from "../kolaborator/FloatingIcons";
import { Link } from "react-router-dom";
const HeroLaporan = () => {
  return (
    <div className="z-0 flex h-115 w-full items-center bg-(--gray-shine) py-8 pt-24">
      <div className="mx-auto w-full max-w-6xl space-y-5 px-50">
        <h1 className="text-4xl font-semibold">
          Laporkan Tumpukan Sampah Ilegal di Sekitarmu
        </h1>
        <p>
          Jangan biarkan sampah menumpuk dan merusak lingkungan. Laporkan titik
          lokasi sampah tak terkelola, lacak progres penanganannya secara
          transparan, dan mari wujudkan lingkungan yang lebih bersih.
        </p>
        <Link to="/laporan/buat" className="flex items-center rounded w-55 bg-(--primary) px-4 py-2 font-bold text-white hover:bg-(--primary-dark)">
          Buat Laporan Sekarang
        </Link>
      </div>

      <FloatingIcons />
    </div>
  );
};

export default HeroLaporan;
