import React from "react";
import Hero from "../../components/features/public/kolaborator/Hero";
import DaftarKolaborator from "../../components/features/public/kolaborator/DaftarKolaborator";

function KolaboratorPage() {
  return (
    
    <div className="relative w-full overflow-hidden bg-[#FAFAFA]">
      
 
      <div className="relative z-0">
        <Hero />
      </div>

    
      <div className="relative z-20 ">
        <DaftarKolaborator />
      </div>
      
    </div>
  );
}

export default KolaboratorPage;