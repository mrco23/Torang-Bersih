import React from "react";
import HeroAset from "../../components/features/public/aset/HeroAset";
import DaftarAset from "../../components/features/public/aset/DaftarAset";

const AsetPage = () => {
  return (
    <div className="relative w-full min-h-dvh bg-[#FAFAFA] selection:bg-(--gray-shine) selection:text-(--primary) ">
     <div className="relative z-0">
      <HeroAset />
      </div>
     
      <div className="relative z-20">
      <DaftarAset />
      </div>
    </div>
  );
};

export default AsetPage;