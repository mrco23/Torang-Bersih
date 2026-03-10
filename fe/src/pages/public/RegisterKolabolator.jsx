import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Vektor from "../../../public/images/DaftarKolabolatorVektor.png";
import toaster from "../../utils/toaster";
import { kolaboratorAPI } from "../../services/api/routes/kolaborator.route";
import { referensiAPI } from "../../services/api/routes/referensi.route";

import StepProfilOrganisasi from "../../components/features/public/kolaborator/RegisterKolabolator/StepProfilOrganisasi";
import StepLokasiOperasional from "../../components/features/public/kolaborator/RegisterKolabolator/StepLokasiOperasional";
import StepKontakVerifikasi from "../../components/features/public/kolaborator/RegisterKolabolator/StepKontakVerifikasi";

const RegisterKolaborator = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  const [jenisOptions, setJenisOptions] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Logo file (to be uploaded separately as formdata blob)
  const [logoFile, setLogoFile] = useState(null);

  const [formData, setFormData] = useState({
    nama_organisasi: "",
    jenis_kolaborator_id: "",
    deskripsi: "",
    kabupaten_kota: "",
    alamat_lengkap: "",
    latitude: 1.4748,
    longitude: 124.8421,
    penanggung_jawab: "",
    kontak: "",
    email: "",
    sosmed: "",
  });

  useEffect(() => {
    const fetchJenis = async () => {
      try {
        const res = await referensiAPI.getAll("jenis-kolaborator");
        setJenisOptions(res.data.data);
      } catch (err) {
        toaster.error(
          `${err.response.data.message || "Gagal memuat opsi kategori kolaborator"}`,
        );
      }
    };
    fetchJenis();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (
        !formData.nama_organisasi ||
        !formData.jenis_kolaborator_id ||
        !formData.deskripsi ||
        formData.deskripsi.length < 50
      ) {
        return toaster.warning(
          "Mohon lengkapi semua bidang wajib pada Profil Organisasi dan pastikan deskripsi minimal 50 karakter.",
        );
      }
    }
    if (currentStep === 2) {
      if (!formData.kabupaten_kota || !formData.alamat_lengkap) {
        return toaster.warning(
          "Mohon lengkapi Kota/Kabupaten dan Alamat Lengkap.",
        );
      }
    }
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const handlePrev = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!formData.penanggung_jawab || !formData.kontak || !formData.email) {
      toaster.warning(
        "Mohon lengkapi nama kontak, No WA, dan email kontak sebelum mendaftar.",
      );
      return;
    }

    setSubmitting(true);
    try {
      await kolaboratorAPI.create(formData, logoFile);
      toaster.success("Pendaftaran Berhasil! Silakan tunggu verifikasi admin.");
      navigate("/user/kolaborator");
    } catch (err) {
      const msg =
        err.response?.data?.message || "Terjadi kesalahan saat pendaftaran";
      toaster.error(msg);
      if (err.response?.status === 422) {
        console.error("Validation error:", err.response?.data?.errors);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const steps = [
    { num: 1, title: "Profil Organisasi" },
    { num: 2, title: "Lokasi & Operasional" },
    { num: 3, title: "Kontak & Verifikasi" },
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
        Batal Daftar
      </button>

      <div className="relative z-10 mt-10 flex h-[650px] w-full max-w-[1000px] flex-col overflow-hidden rounded-2xl bg-white shadow-lg md:mt-0 md:flex-row">
        {/* SIDEBAR KIRI */}
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

        {/* FORM KANAN */}
        <div className="relative flex w-full flex-col md:w-[65%]">
          <div className="flex-1 overflow-y-auto p-10 pb-6 md:px-16 md:pt-12">
            {currentStep === 1 && (
              <StepProfilOrganisasi
                formData={formData}
                handleChange={handleChange}
                jenisOptions={jenisOptions}
                onLogoFileChange={setLogoFile}
                logoFile={logoFile}
              />
            )}
            {currentStep === 2 && (
              <StepLokasiOperasional
                formData={formData}
                handleChange={handleChange}
                setFormData={setFormData}
              />
            )}
            {currentStep === 3 && (
              <StepKontakVerifikasi
                formData={formData}
                handleChange={handleChange}
              />
            )}
          </div>

          {/* FOOTER NAVIGASI */}
          <div className="flex shrink-0 items-center justify-between border-t border-gray-100 bg-white px-10 py-8 md:px-16">
            <button
              type="button"
              onClick={currentStep === 1 ? () => navigate(-1) : handlePrev}
              disabled={submitting}
              className="text-sm font-bold text-gray-900 hover:text-[#1e1f78] disabled:opacity-50"
            >
              Kembali
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={currentStep === 3 ? handleSubmit : handleNext}
              className="flex items-center gap-2 rounded bg-[#1e1f78] px-10 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#16175e] disabled:opacity-70"
            >
              {submitting && (
                <div className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              )}
              {currentStep === 3 ? "Daftar" : "Lanjut"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterKolaborator;
