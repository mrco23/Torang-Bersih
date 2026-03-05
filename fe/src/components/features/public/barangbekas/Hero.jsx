import React from "react";
import Svg from "../kolaborator/Svg"; // Pastikan path import Svg sudah benar
import FloatingIcons from "../kolaborator/FloatingIcons";

const Hero = () => {
  return (
    <div className="flex h-115 w-full items-center bg-(--gray-shine) py-8 pt-24">
      <div className="mx-auto w-full max-w-6xl space-y-5 px-50">
        <h1 className="text-4xl font-semibold">
            Temukan Barang Bekas Berkualitas untuk Daur Ulangmu
        </h1>
        <p>
            Jelajahi katalog barang bekas yang siap didaur ulang, temukan bahan berkualitas untuk proyek kreatifmu, dan dukung gerakan daur ulang yang berkelanjutan.
        </p>
        <button className="flex items-center rounded bg-(--primary) px-4 py-2 font-bold text-white hover:bg-(--primary-dark)">
          Masukan Barang Bekas
        </button>
      </div>

     <FloatingIcons/>
     
    </div>
  );
};

export default Hero;