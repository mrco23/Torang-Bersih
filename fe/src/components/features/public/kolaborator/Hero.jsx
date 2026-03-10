import React from "react";
import Svg from "./Svg";
import FloatingIcons from "./FloatingIcons";
import { Link } from "react-router-dom";
function Hero() {
  return (
    <div className="z-0 flex h-115 w-full items-center bg-(--gray-shine) py-8 pt-24">
      <div className="mx-auto w-full max-w-6xl space-y-5 px-50">
        <h1 className="text-4xl font-semibold">
          Temukan Kolaborator untuk Aksi Lingkunganmu
        </h1>
        <p>
          Jaringan kolektif pemangku kebijakan dan komunitas yang bergerak
          serentak untuk menuntaskan isu persampahan secara berkelanjutan
        </p>
        <Link to="/kolaborator/daftar" className="flex items-center rounded bg-(--primary) px-4 py-2 font-bold text-white hover:bg-(--primary-dark) w-50">
          Tambah Kolaborator
        </Link>
      </div>

      <FloatingIcons />
    </div>
  );
}

export default Hero;
