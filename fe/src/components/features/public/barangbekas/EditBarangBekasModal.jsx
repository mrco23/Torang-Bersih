import React, { useState, useEffect } from "react";
import {
  RiStoreLine,
  RiCheckLine,
  RiCloseLine,
  RiArrowLeftLine,
  RiArrowRightLine,
  RiCheckboxCircleLine,
} from "react-icons/ri";

import { STEPS } from "./InputBarang/Constant";
import { StepFoto } from "./InputBarang/StepFoto";
import { StepDetail } from "./InputBarang/StepDetail";
import { StepHarga } from "./InputBarang/StepHarga";
import { StepLokasi } from "./InputBarang/StepLokasi";
import { marketplaceAPI } from "../../../../services/api/routes/marketplace.route";
import toaster from "../../../../utils/toaster";

const EditBarangBekasModal = ({ item, onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [submitError, setSubmitError] = useState(null);
  const [fotos, setFotos] = useState([]);

  const [form, setForm] = useState({
    nama_barang: "",
    kategori_barang_id: "",
    deskripsi_barang: "",
    harga: "",
    isDonasi: false,
    berat_estimasi_kg: "",
    kondisi: "",
    alamat_lengkap: "",
    kabupaten_kota: "",
    latitude: null,
    longitude: null,
    kontak: "",
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Fetch full data using getById to ensure we have all fields
  useEffect(() => {
    const fetchData = async () => {
      setFetchLoading(true);
      try {
        const res = await marketplaceAPI.getById(item.id);
        const data = res.data.data;

        setForm({
          nama_barang: data.nama_barang || "",
          kategori_barang_id:
            data.kategori_barang?.id || data.kategori_barang_id || "",
          deskripsi_barang: data.deskripsi_barang || "",
          harga: data.harga === 0 ? "" : data.harga.toString(),
          isDonasi: data.harga === 0,
          berat_estimasi_kg: data.berat_estimasi_kg
            ? data.berat_estimasi_kg.toString()
            : "",
          kondisi: data.kondisi || "",
          alamat_lengkap: data.alamat_lengkap || "",
          kabupaten_kota: data.kabupaten_kota || "",
          latitude: data.latitude || null,
          longitude: data.longitude || null,
          kontak: data.kontak || "",
        });

        if (data.foto_barang_urls && data.foto_barang_urls.length > 0) {
          setFotos(
            data.foto_barang_urls.map((url, idx) => ({
              url: url,
              id: `existing-${idx}`,
              is_existing: true,
            })),
          );
        }
      } catch (err) {
        setSubmitError(
          "Gagal memuat data barang. " + (err.response?.data?.message || ""),
        );
      } finally {
        setFetchLoading(false);
      }
    };

    if (item && item.id) {
      fetchData();
    }
  }, [item]);

  const canNext = {
    1: fotos.length > 0,
    2: form.nama_barang.trim() && form.kategori_barang_id && form.kondisi,
    3: form.isDonasi || form.harga !== "",
    4:
      form.kontak.length >= 9 &&
      form.alamat_lengkap.trim().length > 0 &&
      form.latitude &&
      form.longitude,
  };

  const handleSubmit = async () => {
    if (!canNext[4]) return;
    setLoading(true);
    setSubmitError(null);

    try {
      const data = {
        nama_barang: form.nama_barang,
        kategori_barang_id: form.kategori_barang_id,
        deskripsi_barang: form.deskripsi_barang,
        harga: form.isDonasi ? 0 : parseInt(form.harga) || 0,
        berat_estimasi_kg: form.berat_estimasi_kg
          ? parseFloat(form.berat_estimasi_kg)
          : undefined,
        kondisi: form.kondisi,
        kontak: form.kontak,
        alamat_lengkap: form.alamat_lengkap,
        kabupaten_kota: form.kabupaten_kota,
        latitude: form.latitude,
        longitude: form.longitude,
      };

      // Split fotos into existing strings and new files
      const existingPictures = fotos
        .filter((f) => f.is_existing)
        .map((f) => f.url);
      const newFiles = fotos.filter((f) => !f.is_existing).map((f) => f.file);

      data.existing_pictures = existingPictures;

      const fotoFiles =
        newFiles.length > 0 ? { foto_barang_urls: newFiles } : null;

      await marketplaceAPI.update(item.id, data, fotoFiles);
      toaster.success("Data barang berhasil diperbarui!");

      onSuccess();
      onClose();
    } catch (err) {
      setSubmitError(
        err.response?.data?.message || "Gagal memperbarui barang. Coba lagi.",
      );
      setLoading(false);
    }
  };

  const stepLabels = {
    1: "Foto",
    2: "Detail",
    3: "Harga",
    4: "Lokasi & Kontak",
  };

  if (fetchLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
        <div className="flex h-40 w-full max-w-sm flex-col items-center justify-center gap-4 rounded-3xl bg-white shadow-2xl">
          <div className="size-8 animate-spin rounded-full border-4 border-[#1e1f78] border-t-transparent" />
          <p className="text-sm font-medium text-gray-500">
            Memuat data barang...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="flex w-full max-w-[820px] flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
        style={{ height: "min(620px, 92vh)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="flex shrink-0 items-center justify-between border-b border-gray-100 bg-white px-7 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-[#eef0ff]">
              <RiStoreLine size={18} className="text-[#1e1f78]" />
            </div>
            <div>
              <p className="text-[15px] font-black text-gray-900">
                Edit Barang Bekas
              </p>
              <p className="text-[11px] text-gray-400">
                Langkah {step} dari 4 — {stepLabels[step]}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {STEPS.map((s, i) => (
              <React.Fragment key={s.id}>
                <div
                  className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold transition-all ${
                    step > s.id
                      ? "bg-emerald-100 text-emerald-700"
                      : step === s.id
                        ? "bg-[#1e1f78] text-white shadow-sm"
                        : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {step > s.id ? (
                    <RiCheckLine size={12} />
                  ) : (
                    <s.icon size={12} />
                  )}
                  <span className="hidden sm:inline">{s.label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={`h-px w-2 sm:w-4 ${step > s.id ? "bg-emerald-300" : "bg-gray-200"}`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          <button
            onClick={onClose}
            className="flex size-9 items-center justify-center rounded-xl border border-gray-200 transition-colors hover:bg-gray-50"
          >
            <RiCloseLine size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-7 py-6">
          {submitError && (
            <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-[13px] font-medium text-red-600">
              {submitError}
            </div>
          )}
          {step === 1 && <StepFoto fotos={fotos} setFotos={setFotos} />}
          {step === 2 && <StepDetail form={form} setForm={setForm} />}
          {step === 3 && <StepHarga form={form} setForm={setForm} />}
          {step === 4 && <StepLokasi form={form} setForm={setForm} />}
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center justify-between gap-4 border-t border-gray-100 bg-gray-50/80 px-7 py-4">
          <div className="flex items-center gap-1.5">
            {STEPS.map((s) => (
              <div
                key={s.id}
                className={`h-1.5 rounded-full transition-all ${step === s.id ? "w-6 bg-[#1e1f78]" : step > s.id ? "w-3 bg-emerald-400" : "w-3 bg-gray-200"}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {step > 1 && (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-[13px] font-bold text-gray-600 hover:bg-gray-50"
              >
                <RiArrowLeftLine size={15} /> Kembali
              </button>
            )}
            {step < 4 ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                disabled={!canNext[step]}
                className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-[13px] font-bold text-gray-600 hover:bg-gray-50"
              >
                Lanjut <RiArrowRightLine size={15} />
              </button>
            ) : null}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-[#1e1f78] px-6 py-2.5 text-[13px] font-bold text-white shadow-sm hover:bg-[#16175e] disabled:opacity-40"
            >
              {loading ? (
                <>
                  <div className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />{" "}
                  Menyimpan...
                </>
              ) : (
                <>
                  <RiCheckboxCircleLine size={16} /> Simpan Perubahan
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBarangBekasModal;
