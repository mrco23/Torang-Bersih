import React from "react";
import FloatingIcons from "../kolaborator/FloatingIcons";
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
        <button className="flex items-center rounded bg-(--primary) px-4 py-2 font-bold text-white hover:bg-(--primary-dark)">
          Tambah Kolaborator
        </button>
      </div>

      <FloatingIcons />
    </div>
  );
};

export default HeroLaporan;
