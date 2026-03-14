import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ArtikelNavbar from "../../components/features/public/artikel/BuatArtikel/ArtikelNavbar";
import ArtikelEditor from "../../components/features/public/artikel/BuatArtikel/ArtikelEditor";
import ArtikelSidebar from "../../components/features/public/artikel/BuatArtikel/ArtikelSidebar";
import ArtikelPublishModal from "../../components/features/public/artikel/BuatArtikel/ArtikelPublishModal";
import ArtikelPreviewModal from "../../components/features/public/artikel/BuatArtikel/ArtikelPreviuwModal";
import toaster from "../../utils/toaster";
import { artikelAPI } from "../../services/api/routes/artikel.route";
import { referensiAPI } from "../../services/api/routes/referensi.route";
import { useAuth } from "../../contexts/AuthContext";

const DRAFT_LOCAL_KEY = "torangbersih_draft_artikel";

const BuatArtikelPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState(() => {
    const savedDraft = localStorage.getItem(DRAFT_LOCAL_KEY);
    if (savedDraft) {
      try {
        return JSON.parse(savedDraft);
      } catch (err) {
        console.error("Gagal memuat draf dari localStorage:", err);
      }
    }
    return {
      judul_artikel: "",
      konten_teks: "",
      kategori_id: "",
      foto_cover_url: "",
      status_publikasi: "draft",
      tags: [],
    };
  });

  const [fotoFile, setFotoFile] = useState(null);

  const [saveStatus, setSaveStatus] = useState("");
  const [isDirty, setIsDirty] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showPublish, setShowPublish] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState("");

  const [kategoriList, setKategoriList] = useState([]);
  const [loadingKategori, setLoadingKategori] = useState(true);

  useEffect(() => {
    const fetchKategori = async () => {
      try {
        const res = await referensiAPI.getAll("kategori-artikel");
        setKategoriList(res.data.data || []);
      } catch (err) {
        toaster.error(
          err.response?.data?.message ||
            err.message ||
            "Gagal memuat daftar kategori artikel",
        );
      } finally {
        setLoadingKategori(false);
      }
    };
    fetchKategori();
  }, []);

  // Simpan draf ke localStorage (kecuali fotoFile — tidak bisa di-serialize)
  useEffect(() => {
    localStorage.setItem(DRAFT_LOCAL_KEY, JSON.stringify(form));
  }, [form]);

  const wordCount = useMemo(() => {
    const text = (form.konten_teks ?? "").replace(/<[^>]+>/g, " ").trim();
    if (!text) return 0;
    return text.split(/\s+/).filter(Boolean).length;
  }, [form.konten_teks]);

  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  const fotoPreview = useMemo(() => {
    if (fotoFile) return URL.createObjectURL(fotoFile);
    return form.foto_cover_url || "";
  }, [fotoFile, form.foto_cover_url]);

  const handleFormChange = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
    setSaveStatus("");
  }, []);

  const handleResetDraft = () => {
    if (
      window.confirm(
        "Apakah Anda yakin ingin menghapus semua tulisan ini dan mulai dari awal?",
      )
    ) {
      localStorage.removeItem(DRAFT_LOCAL_KEY);
      setForm({
        judul_artikel: "",
        konten_teks: "",
        kategori_id: "",
        foto_cover_url: "",
        status_publikasi: "draft",
        tags: [],
      });
      setFotoFile(null);
      setIsDirty(false);
      setSaveStatus("");
      toaster.success("Draf berhasil dibersihkan.");
    }
  };

  // Helper: build payload and call API (supports file upload)
  const submitArtikel = async (overrideStatus) => {
    const payload = {
      judul_artikel: form.judul_artikel,
      konten_teks: form.konten_teks,
      kategori_id: form.kategori_id,
      status_publikasi: overrideStatus ?? form.status_publikasi,
      tags: form.tags || [],
    };

    // Only include foto_cover_url if no file is selected (URL fallback)
    if (!fotoFile && form.foto_cover_url) {
      payload.foto_cover_url = form.foto_cover_url;
    }

    const res = await artikelAPI.create(payload, fotoFile || null);
    return res;
  };

  // Simpan Draf ke Backend
  const handleSaveDraft = async () => {
    if (!form.judul_artikel.trim()) {
      toaster.warning("Isi judul dulu sebelum menyimpan draf.");
      return;
    }
    setSaveStatus("saving");
    try {
      await submitArtikel("draft");
      setSaveStatus("saved");
      setIsDirty(false);
      localStorage.removeItem(DRAFT_LOCAL_KEY);
      setForm({
        judul_artikel: "",
        konten_teks: "",
        kategori_id: "",
        foto_cover_url: "",
        status_publikasi: "draft",
        tags: [],
      });
      setFotoFile(null);
      setSaveStatus("");
      toaster.success("Draf berhasil disimpan!");
      if (user) {
        navigate(`/${user.username}/artikel`);
      }
    } catch (err) {
      setSaveStatus("");
      const msg =
        err.response?.data?.message || err.message || "Gagal menyimpan draf.";
      toaster.error(msg);
    }
  };

  // Terbitkan Artikel ke Backend
  const handlePublish = async () => {
    setIsPublishing(true);
    setError("");
    try {
      await submitArtikel("published");
      localStorage.removeItem(DRAFT_LOCAL_KEY);
      setForm({
        judul_artikel: "",
        konten_teks: "",
        kategori_id: "",
        foto_cover_url: "",
        status_publikasi: "draft",
        tags: [],
      });
      setFotoFile(null);
      setSaveStatus("");
      toaster.success("Artikel berhasil diterbitkan!");
      setShowPublish(false);
      setShowPreview(false);

      navigate("/artikel");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Gagal menerbitkan artikel.";
      setError(msg);
      toaster.error(msg);
    } finally {
      setIsPublishing(false);
    }
  };

  const canPublish =
    form.judul_artikel.trim().length > 0 &&
    wordCount >= 50 &&
    !!form.kategori_id;

  return (
    <div className="min-h-screen bg-[#f3f3fc]">
      {saveStatus === "saving" && (
        <div className="bg-opacity-30 fixed inset-0 z-50 flex flex-col items-center justify-center gap-5 bg-transparent p-4 backdrop-blur-sm">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-black"></div>
          <p className="text-sm text-gray-500">Menyimpan draf...</p>
        </div>
      )}
      <div className="mx-auto max-w-7xl space-y-5 px-4 pt-5 pb-20 sm:px-6 lg:px-8">
        <ArtikelNavbar
          saveStatus={saveStatus}
          isDirty={isDirty}
          canPublish={canPublish}
          onBack={() => navigate(-1)}
          onSaveDraft={handleSaveDraft}
          onPreview={() => setShowPreview(true)}
          onPublish={() => setShowPublish(true)}
          onReset={handleResetDraft}
        />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
              <ArtikelEditor
                judul={form.judul_artikel}
                konten={form.konten_teks}
                onJudulChange={(v) => handleFormChange("judul_artikel", v)}
                onKontenChange={(v) => handleFormChange("konten_teks", v)}
              />
            </div>
            {error && (
              <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
          </div>

          <div className="lg:col-span-4">
            <div className="sticky top-[88px]">
              <ArtikelSidebar
                form={form}
                wordCount={wordCount}
                readTime={readTime}
                onFormChange={handleFormChange}
                fotoFile={fotoFile}
                onFotoFileChange={setFotoFile}
                kategoriList={kategoriList}
                loadingKategori={loadingKategori}
                fotoPreview={fotoPreview}
              />
            </div>
          </div>
        </div>
      </div>

      <ArtikelPreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        onPublish={() => {
          setShowPreview(false);
          setShowPublish(true);
        }}
        form={form}
        wordCount={wordCount}
        readTime={readTime}
        canPublish={canPublish}
        kategoriList={kategoriList}
        fotoPreview={fotoPreview}
      />

      <ArtikelPublishModal
        isOpen={showPublish}
        onClose={() => setShowPublish(false)}
        onPublish={handlePublish}
        form={form}
        wordCount={wordCount}
        readTime={readTime}
        isPublishing={isPublishing}
        kategoriList={kategoriList}
        fotoPreview={fotoPreview}
      />
    </div>
  );
};

export default BuatArtikelPage;
