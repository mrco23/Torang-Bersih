import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toaster from "../../utils/toaster";
import Vektor from "../../../public/images/DaftarKolabolatorVektor.png";

import StepInfoAset from "../../components/features/public/aset/DaftarAset/StepInfoAset";
import StepLokasiAset from "../../components/features/public/aset/DaftarAset/StepLokasiAset";
import StepKontakFasilitas from "../../components/features/public/aset/DaftarAset/StepKontakFasilitas";
import StepFotoAset from "../../components/features/public/aset/DaftarAset/StepFotoAset";

const steps = [
  { num: 1, title: "Info Aset" },
  { num: 2, title: "Lokasi" },
  { num: 3, title: "Kontak" },
  { num: 4, title: "Foto" },
];

const DaftarAset = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    nama_aset: "",
    kategori_aset: "",
    status_aktif: true,
    kabupaten_kota: "",
    kecamatan: "",
    alamat_lengkap: "",
    gmaps_url: "",
    latitude: null,
    longitude: null,
    nama_pic: "",
    no_whatsapp_pic: "",
    foto_aset_urls: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!formData.nama_aset.trim())
        return toaster.warning("Isi nama aset terlebih dahulu.");
      if (!formData.kategori_aset)
        return toaster.warning("Pilih kategori aset.");
    }
    if (currentStep === 2) {
      if (!formData.kabupaten_kota)
        return toaster.warning("Pilih Kota/Kabupaten.");
      if (!formData.kecamatan) return toaster.warning("Pilih Kecamatan.");
      if (!formData.alamat_lengkap.trim())
        return toaster.warning("Isi alamat lengkap.");
      if (!formData.gmaps_url.trim())
        return toaster.warning("Sertakan link Google Maps.");
    }
    if (currentStep === 3) {
      if (!formData.nama_pic.trim())
        return toaster.warning("Isi nama penanggung jawab.");
      if (!formData.no_whatsapp_pic.trim())
        return toaster.warning("Isi nomor WhatsApp.");
    }
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const handlePrev = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = () => {
    console.group("📦 DATA DAFTAR ASET");
    console.group("🏷️ Step 1 — Info Aset");
    console.log("nama_aset     :", formData.nama_aset);
    console.log("kategori_aset :", formData.kategori_aset);
    console.log("status_aktif  :", formData.status_aktif);
    console.groupEnd();
    console.group("📍 Step 2 — Lokasi");
    console.log("kabupaten_kota:", formData.kabupaten_kota);
    console.log("kecamatan     :", formData.kecamatan);
    console.log("alamat_lengkap:", formData.alamat_lengkap);
    console.log("gmaps_url     :", formData.gmaps_url);
    console.log("latitude      :", formData.latitude);
    console.log("longitude     :", formData.longitude);
    console.groupEnd();
    console.group("📞 Step 3 — Kontak");
    console.log("nama_pic        :", formData.nama_pic);
    console.log("no_whatsapp_pic :", formData.no_whatsapp_pic);
    console.groupEnd();
    console.group("📷 Step 4 — Foto");
    console.log("foto_aset_urls:", formData.foto_aset_urls);
    console.groupEnd();
    console.log("─────────────────────────────");
    console.log("📦 Full object:", formData);
    console.log("📦 JSON       :", JSON.stringify(formData, null, 2));
    console.groupEnd();

    toaster.success("Aset berhasil didaftarkan! Menunggu verifikasi admin.");
    navigate(-1);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#f4f6f9] p-4 font-sans sm:p-8">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900"
      >
        <svg
          className="size-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Batal
      </button>

      <div className="relative z-10 mt-10 flex h-[600px] w-full max-w-[1000px] flex-col overflow-hidden rounded-2xl bg-white shadow-lg md:mt-0 md:flex-row">
        {/* SIDEBAR */}
        <div className="relative flex w-full shrink-0 flex-col overflow-hidden bg-[#1e1f78] p-10 text-white md:w-[35%]">
          <div className="relative z-10 mt-6 flex flex-col gap-10">
            {steps.map((step) => (
              <div key={step.num} className="flex items-center gap-4">
                <div
                  className={`flex size-[42px] shrink-0 items-center justify-center rounded-full border border-white text-sm font-bold transition-all ${
                    currentStep === step.num
                      ? "bg-white text-[#1e1f78]"
                      : "bg-transparent text-white opacity-80"
                  }`}
                >
                  {step.num}
                </div>
                <div
                  className={`flex flex-col transition-opacity ${currentStep === step.num ? "opacity-100" : "opacity-80"}`}
                >
                  <span className="text-[13px] tracking-wide">
                    Step {step.num}
                  </span>
                  <span className="text-base font-semibold">{step.title}</span>
                </div>
              </div>
            ))}
          </div>
          <img
            src={Vektor}
            alt="Ornamen"
            className="pointer-events-none absolute bottom-0 left-0 w-full object-cover opacity-80"
          />
        </div>

        {/* FORM */}
        <div className="relative flex w-full flex-col md:w-[65%]">
          <div className="flex-1 overflow-y-auto p-10 pb-6 md:px-16 md:pt-12">
            {currentStep === 1 && (
              <StepInfoAset formData={formData} handleChange={handleChange} />
            )}
            {currentStep === 2 && (
              <StepLokasiAset formData={formData} handleChange={handleChange} />
            )}
            {currentStep === 3 && (
              <StepKontakFasilitas
                formData={formData}
                handleChange={handleChange}
              />
            )}
            {currentStep === 4 && (
              <StepFotoAset formData={formData} setFormData={setFormData} />
            )}
          </div>

          {/* Footer */}
          <div className="flex shrink-0 items-center justify-between border-t border-gray-100 bg-white px-10 py-6 md:px-16">
            <div className="flex items-center gap-1.5">
              {steps.map((s) => (
                <div
                  key={s.num}
                  className={`rounded-full transition-all duration-300 ${
                    currentStep === s.num
                      ? "h-2 w-6 bg-[#1e1f78]"
                      : currentStep > s.num
                        ? "size-2 bg-green-400"
                        : "size-2 bg-gray-200"
                  }`}
                />
              ))}
            </div>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={currentStep === 1 ? () => navigate(-1) : handlePrev}
                className="text-sm font-bold text-gray-900 hover:text-[#1e1f78]"
              >
                Kembali
              </button>
              <button
                type="button"
                onClick={currentStep === 4 ? handleSubmit : handleNext}
                className="rounded bg-[#1e1f78] px-10 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#16175e]"
              >
                {currentStep === 4 ? "Daftarkan Aset" : "Lanjut"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DaftarAset;
