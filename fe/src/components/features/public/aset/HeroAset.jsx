import React from 'react';
import FloatingIcons from '../kolaborator/FloatingIcons';

const HeroAset = () => {
  return (
    <div className="z-0 flex h-115 w-full items-center bg-(--gray-shine) py-8 pt-24">
      <div className="mx-auto w-full max-w-6xl space-y-5 px-50">
        <h1 className="text-4xl font-semibold">
          Eksplorasi Fasilitas Daur Ulang Terdekat
        </h1>
        <p>
          Jelajahi peta direktori lengkap Bank Sampah, TPST, dan fasilitas pengelolaan lingkungan untuk mendukung aksi daur ulang di daerahmu.
        </p>
        <button className="flex items-center rounded bg-(--primary) px-4 py-2 font-bold text-white hover:bg-(--primary-dark)">
          Daftarkan Fasilitas
        </button>
      </div>

      <FloatingIcons />
    </div>
  );
};

export default HeroAset;