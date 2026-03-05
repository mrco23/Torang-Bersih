import React from "react";
import Svg from "./Svg";
import FloatingIcons from "./FloatingIcons";
function Hero() {
  return (
    <div className="flex z-0 h-115 w-full items-center bg-(--gray-shine) py-8 pt-24">
      <div className="mx-auto w-full max-w-6xl space-y-5 px-50">
        <h1 className="text-4xl font-semibold">
          Temukan Kolaborator untuk Aksi Lingkunganmu
        </h1>
        <p>
          Jaringan kolektif pemangku kebijakan dan komunitas yang bergerak
          serentak untuk menuntaskan isu persampahan secara berkelanjutan
        </p>
        <button className="flex items-center rounded bg-(--primary) px-4 py-2 font-bold text-white hover:bg-(--primary-dark)">
          Tambah Kolaborator
        </button>
      </div>

    <FloatingIcons/>
    </div>
  );
}

export default Hero;
