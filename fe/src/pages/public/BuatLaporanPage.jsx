import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LaporanVektor from "../../../public/images/DaftarKolabolatorVektor.png";
import toaster from "../../utils/toaster";
import { laporanAPI } from "../../services/api/routes/laporan.route";

import StepFotoBukti from "../../components/features/public/Laporan/BuatLaporan/StepFotoBukti";
import StepLokasiLaporan from "../../components/features/public/Laporan/BuatLaporan/StepLokasiLaporan";
import StepDetailLaporan from "../../components/features/public/Laporan/BuatLaporan/StepDetailLaporan";
import { referensiAPI } from "../../services/api/routes/referensi.route";

const steps = [
  { num: 1, title: "Foto Bukti" },
  { num: 2, title: "Titik Lokasi" },
  { num: 3, title: "Detail Laporan" },
];

const BuatLaporanPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const [jenisSampahOptions, setJenisSampahOptions] = useState([]);

  const [formData, setFormData] = useState({
    foto_bukti_urls: [],
    latitude: null,
    longitude: null,
    kabupaten_kota: "",
    alamat_lokasi: "",
    jenis_sampah_id: "",
    estimasi_berat_kg: null,
    karakteristik: "",
    bentuk_timbulan: "",
    deskripsi_laporan: "",
  });

  useEffect(() => {
    const fetchJenisSampah = async () => {
      try {
        const response = await referensiAPI.getAll("jenis-sampah");
        setJenisSampahOptions(response.data.data);
      } catch (error) {
        toaster.error(
          `${error.response.data.message || "Gagal memuat opsi jenis sampah"}`,
        );
      }
    };
    fetchJenisSampah();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!formData.foto_bukti_urls.length)
        return toaster.warning(
          "Tambahkan minimal 1 foto bukti terlebih dahulu.",
        );
    }
    if (currentStep === 2) {
      if (!formData.latitude)
        return toaster.warning("Ambil koordinat GPS terlebih dahulu.");
      if (!formData.alamat_lokasi.trim())
        return toaster.warning("Isi patokan lokasi terlebih dahulu.");
    }
    setCurrentStep((p) => Math.min(p + 1, 3));
  };

  const handlePrev = () => setCurrentStep((p) => Math.max(p - 1, 1));

  const handleSubmit = async () => {
    if (!formData.jenis_sampah_id)
      return toaster.warning("Pilih jenis sampah terlebih dahulu.");

    setSubmitting(true);
    try {
      const payload = { ...formData };
      delete payload.foto_bukti_urls;

      await laporanAPI.create(payload, {
        foto_bukti_urls: formData.foto_bukti_urls,
      });

      toaster.success("Laporan berhasil dikirim! Terima kasih telah melapor.");
      navigate("/:user/laporan");
    } catch (error) {
      console.error("Failed to make laporan:", error.response.data.errors);
      toaster.error(
        error.response.data.message ||
          "Gagal mengirim laporan. Silakan coba lagi.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#f4f6f9] p-4 font-sans sm:p-8">
      {/* Tombol batal */}
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

      {/* Card utama */}
      <div className="relative z-10 mt-10 flex h-auto min-h-[600px] w-full max-w-[1000px] flex-col overflow-hidden rounded-2xl bg-white shadow-lg md:mt-0 md:h-[640px] md:flex-row">
        {/* ── SIDEBAR KIRI ── */}
        <div className="relative flex w-full shrink-0 flex-col overflow-hidden bg-[#1e1f78] p-8 text-white md:w-[35%] md:p-10">
          {/* Label halaman */}
          <div className="relative z-10 mb-8">
            <p className="text-[11px] font-semibold tracking-widest text-white/50 uppercase">
              Warga Peduli
            </p>
            <h1 className="mt-1 text-xl leading-tight font-bold">
              Buat Laporan
              <br />
              Sampah Ilegal
            </h1>
          </div>

          {/* Steps */}
          <div className="relative z-10 flex flex-col gap-8">
            {steps.map((step) => {
              const isDone = currentStep > step.num;
              const isActive = currentStep === step.num;
              return (
                <div key={step.num} className="flex items-center gap-4">
                  <div
                    className={`flex size-[42px] shrink-0 items-center justify-center rounded-full border border-white text-sm font-bold transition-all ${
                      isActive
                        ? "bg-white text-[#1e1f78]"
                        : isDone
                          ? "bg-white/20 text-white"
                          : "bg-transparent text-white opacity-60"
                    }`}
                  >
                    {isDone ? (
                      <svg
                        className="size-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <span>{step.num}</span>
                    )}
                  </div>
                  <div
                    className={`flex flex-col transition-opacity ${isActive ? "opacity-100" : "opacity-70"}`}
                  >
                    <span className="text-[12px] tracking-wide">
                      Step {step.num}
                    </span>
                    <span className="text-[15px] font-semibold">
                      {step.title}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Vektor dekorasi — sama seperti RegisterKolaborator */}
          <img
            src={LaporanVektor}
            alt=""
            className="pointer-events-none absolute bottom-0 left-0 w-full object-cover opacity-80"
          />
        </div>

        {/* ── FORM KANAN ── */}
        <div className="relative flex w-full flex-col md:w-[65%]">
          {/* Scrollable form area */}
          <div className="flex-1 overflow-y-auto px-8 pt-10 pb-6 md:px-14 md:pt-12">
            {currentStep === 1 && (
              <StepFotoBukti formData={formData} setFormData={setFormData} />
            )}
            {currentStep === 2 && (
              <StepLokasiLaporan
                formData={formData}
                setFormData={setFormData}
                handleChange={handleChange}
              />
            )}
            {currentStep === 3 && (
              <StepDetailLaporan
                formData={formData}
                setFormData={setFormData}
                handleChange={handleChange}
                jenisSampahOptions={jenisSampahOptions}
              />
            )}
          </div>

          {/* Footer navigasi — sama persis RegisterKolaborator */}
          <div className="flex shrink-0 items-center justify-between border-t border-gray-100 bg-white px-8 py-6 md:px-14">
            <button
              type="button"
              onClick={currentStep === 1 ? () => navigate(-1) : handlePrev}
              className="text-sm font-bold text-gray-900 transition-colors hover:text-[#1e1f78]"
            >
              Kembali
            </button>
            <button
              type="button"
              onClick={currentStep === 3 ? handleSubmit : handleNext}
              disabled={submitting}
              className="flex items-center gap-2 rounded bg-[#1e1f78] px-10 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#16175e] disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <span className="size-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  <span>Mengirim...</span>
                </>
              ) : (
                <span>{currentStep === 3 ? "Kirim Laporan" : "Lanjut"}</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuatLaporanPage;
