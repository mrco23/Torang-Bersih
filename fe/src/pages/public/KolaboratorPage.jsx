import React from "react";
import FiturHero from "../../components/shared/FiturHero";
import DaftarKolaborator from "../../components/features/public/kolaborator/DaftarKolaborator";

function KolaboratorPage() {
  return (
    <div className="relative w-full overflow-hidden bg-[#FAFAFA]">
      <div className="relative z-0">
        <FiturHero
          title="Temukan Kolaborator untuk Aksi Lingkunganmu"
          description="Jaringan kolektif pemangku kebijakan dan komunitas yang bergerak serentak untuk menuntaskan isu persampahan secara berkelanjutan"
          buttonText="Tambah Kolaborator"
          buttonLink="/kolaborator/daftar"
        />
      </div>

      <div className="relative z-20">
        <DaftarKolaborator />
      </div>
    </div>
  );
}

export default KolaboratorPage;
