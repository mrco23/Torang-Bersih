import React from "react";
import HeroLaporan from "../../components/features/public/Laporan/HeroLaporan";
import DaftarLaporan from "../../components/features/public/Laporan/DaftarLaporan";
const LaporanPage = () => {
  return (
      <div className="relative w-full overflow-hidden bg-[#FAFAFA]">
      <div className="relative z-0">
        <HeroLaporan />
      </div>

      <div className="relative z-20 bg-white">
        <DaftarLaporan   />
      </div>
    </div>
  )
};

export default LaporanPage;
