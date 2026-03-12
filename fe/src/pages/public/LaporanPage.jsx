import React from "react";
import FiturHero from "../../components/shared/FiturHero";
import DaftarLaporan from "../../components/features/public/Laporan/DaftarLaporan";
const LaporanPage = () => {
  return (
    <div className="relative w-full overflow-hidden bg-(--gray-shine)">
      <div className="relative z-0">
        <FiturHero
          title="Laporkan Permasalahan Sampah di Sekitarmu"
          description="Jangan biarkan sampah menumpuk dan merusak lingkungan. Laporkan titik lokasi sampah tak terkelola, lacak progres penanganannya secara transparan, dan mari wujudkan lingkungan yang lebih bersih."
          buttonText="Buat Laporan Sekarang"
          buttonLink="/laporan/buat"
        />
      </div>

      <div className="relative z-20 bg-white px-4 py-8 md:px-10">
        <DaftarLaporan />
      </div>
    </div>
  );
};

export default LaporanPage;
