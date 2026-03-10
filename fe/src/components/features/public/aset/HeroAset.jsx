import React from 'react';
import FloatingIcons from '../kolaborator/FloatingIcons';
import { Link } from 'react-router-dom';
const HeroAset = () => {
  return (
    <div className="z-0 flex h-115 w-full items-center bg-(--gray-shine) py-8 pt-24">
      <div className="mx-auto w-full max-w-6xl space-y-5 px-50">
        <h1 className="text-4xl font-semibold">
         Temukan Aset Daur Ulang di Sekitarmu
        </h1>
        <p>
          Jelajahi peta interaktif yang memuat lokasi Bank Sampah, TPST, TPA, dan sentra kompos di seluruh Sulawesi Utara. Salurkan sampahmu ke tempat yang tepat.
        </p>
        <Link to="/aset/daftar" className="flex items-center w-45 rounded bg-(--primary) px-4 py-2 font-bold text-white hover:bg-(--primary-dark)">
          Daftarkan Fasilitas
        </Link>
      </div>

      <FloatingIcons />
    </div>
  );
};

export default HeroAset;