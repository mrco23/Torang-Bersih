import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toaster from "../../utils/toaster";
import { asetAPI } from "../../services/api/routes/aset.route";

import StepInfoAset from "../../components/features/public/aset/RegisterAset/StepInfoAset";
import StepLokasiAset from "../../components/features/public/aset/RegisterAset/StepLokasiAset";
import StepKontakFasilitas from "../../components/features/public/aset/RegisterAset/StepKontakFasilitas";
import StepFotoAset from "../../components/features/public/aset/RegisterAset/StepFotoAset";
import { referensiAPI } from "../../services/api/routes/referensi.route";

const RegisterAsetPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [kategoriAset, setKategoriAset] = useState([]);

  // Logo file (to be uploaded separately as formdata blob)
  const [fotoAsetFiles, setFotoAsetFiles] = useState([]);

  const [formData, setFormData] = useState({
    nama_aset: "",
    kategori_aset_id: "",
    deskripsi_aset: "",
    kabupaten_kota: "",
    alamat_lengkap: "",
    latitude: 1.4748,
    longitude: 124.8421,
    penanggung_jawab: "",
    kontak: "",
  });

  useEffect(() => {
    const fetchKategoriAset = async () => {
      try {
        const res = await referensiAPI.getAll("kategori-aset");
        setKategoriAset(res.data.data);
      } catch (err) {
        toaster.error(
          `${err.response.data.message || "Gagal memuat opsi kategori aset"}`,
        );
      }
    };
    fetchKategoriAset();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!formData.nama_aset.trim())
        return toaster.warning("Isi nama aset terlebih dahulu.");
      if (!formData.kategori_aset_id)
        return toaster.warning("Pilih kategori aset.");
      if (
        !formData.deskripsi_aset.trim() ||
        formData.deskripsi_aset.length < 50
      )
        return toaster.warning("Isi deskripsi aset minimal 50 karakter.");
    }
    if (currentStep === 2) {
      if (!formData.kabupaten_kota)
        return toaster.warning("Pilih Kota/Kabupaten.");
      if (!formData.alamat_lengkap.trim())
        return toaster.warning("Isi alamat lengkap.");
      if (!formData.latitude || !formData.longitude)
        return toaster.warning("Pilih lokasi pada peta.");
    }
    if (currentStep === 3) {
      if (!formData.penanggung_jawab.trim())
        return toaster.warning("Isi nama penanggung jawab.");
      if (!formData.kontak.trim())
        return toaster.warning("Isi nomor WhatsApp.");
    }
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const handlePrev = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!formData.penanggung_jawab || !formData.kontak) {
      toaster.warning(
        "Mohon lengkapi nama kontak dan No WA sebelum mendaftar.",
      );
      return;
    }

    try {
      setIsSubmitting(true);

      await asetAPI.create(formData, fotoAsetFiles);

      toaster.success("Aset berhasil didaftarkan! Menunggu verifikasi admin.");
      navigate("/user/aset");
    } catch (err) {
      const msg =
        err.response?.data?.message || "Terjadi kesalahan saat pendaftaran";
      toaster.error(msg);
      if (err.response?.status === 422) {
        console.error("Validation error:", err.response?.data?.errors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { num: 1, title: "Info Aset" },
    { num: 2, title: "Lokasi" },
    { num: 3, title: "Kontak" },
    { num: 4, title: "Foto" },
  ];

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
        <div className="relative flex w-full shrink-0 flex-col overflow-hidden bg-emerald-700 p-10 text-white md:w-[35%]">
          <div className="relative z-10 mt-6 flex flex-col gap-10">
            {steps.map((step) => (
              <div key={step.num} className="flex items-center gap-4">
                <div
                  className={`flex size-[42px] shrink-0 items-center justify-center rounded-full border border-white text-sm font-bold transition-all ${
                    currentStep === step.num
                      ? "bg-white text-emerald-700"
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
            src="/images/DaftarKolabolatorVektor.png"
            alt="Ornamen"
            className="pointer-events-none absolute bottom-0 left-0 w-full object-cover opacity-80"
          />
        </div>

        {/* FORM */}
        <div className="relative flex w-full flex-col md:w-[65%]">
          <div className="flex-1 overflow-y-auto p-10 pb-6 md:px-16 md:pt-12">
            {currentStep === 1 && (
              <StepInfoAset
                formData={formData}
                handleChange={handleChange}
                kategoriAset={kategoriAset}
              />
            )}
            {currentStep === 2 && (
              <StepLokasiAset
                formData={formData}
                handleChange={handleChange}
                setFormData={setFormData}
              />
            )}
            {currentStep === 3 && (
              <StepKontakFasilitas
                formData={formData}
                handleChange={handleChange}
                setFormData={setFormData}
              />
            )}
            {currentStep === 4 && (
              <StepFotoAset
                fotoAsetFiles={fotoAsetFiles}
                setFotoAsetFiles={setFotoAsetFiles}
              />
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
                      ? "h-2 w-6 bg-emerald-600"
                      : currentStep > s.num
                        ? "size-2 bg-emerald-400"
                        : "size-2 bg-gray-200"
                  }`}
                />
              ))}
            </div>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={currentStep === 1 ? () => navigate(-1) : handlePrev}
                className="text-sm font-bold text-gray-900 hover:text-emerald-700"
              >
                Kembali
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={currentStep === 4 ? handleSubmit : handleNext}
                className={`rounded bg-emerald-600 px-10 py-2.5 text-sm font-bold text-white transition-colors hover:bg-emerald-700 ${
                  isSubmitting ? "cursor-not-allowed opacity-70" : ""
                }`}
              >
                {isSubmitting
                  ? "Menyimpan..."
                  : currentStep === 4
                    ? "Daftarkan Aset"
                    : "Lanjut"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterAsetPage;
