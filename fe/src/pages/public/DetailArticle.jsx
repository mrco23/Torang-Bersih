import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Sidebar } from "../../components/features/public/artikel/Sidebar";
import { artikelAPI } from "../../services/api/routes/artikel.route";
import { useAuth } from "../../contexts/AuthContext";
import toaster from "../../utils/toaster";

const ArticleDetailPage = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();

  // ── Auth: cek token & Sidebar State ────────────────────────

  // ── Fetch artikel detail & daftar komentar ───────────────────────
  const [artikel, setArtikel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fetchedKomentar, setFetchedKomentar] = useState([]);

  const fetchDetail = async (silent = false) => {
    if (!silent) setLoading(true);
    setError("");
    try {
      const res = await artikelAPI.getById(id);
      const data = res.data.data;
      setArtikel(data);
      setIsLiked(data.is_liked || false);
      setLikesCount(data.jumlah_likes || 0);
      setCommentsCount(data.jumlah_komentar || 0);
    } catch (err) {
      if (!silent)
        setError(err.response?.data?.message || "Artikel tidak ditemukan.");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const fetchKomentar = async () => {
    try {
      const res = await artikelAPI.getKomentar(id);
      setFetchedKomentar(res.data.data || []);
    } catch (err) {
      console.error("Gagal memuat komentar:", err);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDetail();
      fetchKomentar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // ── Like state ───────────────────────────────────────────────────
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);
  const [likeLoading, setLikeLoading] = useState(false);

  // Redundant useEffect removed

  const handleLike = async () => {
    if (!isAuthenticated) {
      toaster.error("Anda harus login untuk menyukai artikel");
      return;
    }
    if (likeLoading) return;

    // Optimistic Update
    const prevLiked = isLiked;
    const prevCount = likesCount;

    setIsLiked(!prevLiked);
    setLikesCount(prevLiked ? prevCount - 1 : prevCount + 1);
    setLikeLoading(true);

    try {
      await artikelAPI.toggleLike(id);
      // Optional: you can sync with actual server count here if needed
      // setLikesCount(res.data.jumlah_like);
    } catch (err) {
      // Revert on Error
      setIsLiked(prevLiked);
      setLikesCount(prevCount);

      if (err.response?.status === 401)
        toaster.error("Anda harus login untuk menyukai artikel");
      else {
        toaster.error("Gagal menyukai artikel");
        console.error("[Like]", err.message);
      }
    } finally {
      setLikeLoading(false);
    }
  };

  // ── Komentar state ───────────────────────────────────────────────
  const [komentarTeks, setKomentarTeks] = useState("");
  const [komentarList, setKomentarList] = useState([]);
  const [komentarLoading, setKomentarLoading] = useState(false);
  const [komentarError, setKomentarError] = useState("");
  const [replyTo, setReplyTo] = useState(null); // { id: string, name: string }

  // Sinkronisasi data komentar dari fetch API ke state lokal
  useEffect(() => {
    if (fetchedKomentar) {
      setKomentarList(fetchedKomentar);
    }
  }, [fetchedKomentar]);

  const handleKomentar = async () => {
    if (!isAuthenticated) {
      toaster.error("Anda harus login untuk berkomentar");
      return;
    }
    if (!komentarTeks.trim()) return;
    setKomentarLoading(true);
    setKomentarError("");
    try {
      await artikelAPI.createKomentar(id, {
        isi_komentar: komentarTeks.trim(),
        parent_id: replyTo?.id || null,
      });
      setKomentarTeks("");
      setReplyTo(null);
      if (replyTo) {
        toaster.success("Balasan berhasil ditambahkan");
      } else {
        toaster.success("Komentar berhasil ditambahkan");
      }
      fetchDetail(true); // Sync real count from backend
      fetchKomentar();
    } catch (err) {
      if (err.response?.status === 401)
        toaster.error("Anda harus login untuk berkomentar");
      else
        setKomentarError(
          err.response?.data?.message || "Gagal mengirim komentar.",
        );
      console.log(err.response?.data?.errors);
    } finally {
      setKomentarLoading(false);
    }
  };

  const handleDeleteKomentar = async (komentarId) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus komentar ini?"))
      return;

    setKomentarLoading(true);
    try {
      await artikelAPI.deleteKomentar(id, komentarId);
      toaster.success("Komentar berhasil dihapus");
      fetchDetail(true); // Sync real count from backend
      fetchKomentar();
    } catch (err) {
      toaster.error(err.response?.data?.message || "Gagal menghapus komentar.");
    } finally {
      setKomentarLoading(false);
    }
  };

  // ── Loading ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="relative bg-white pt-20 pb-20 text-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
            <div className="hidden lg:col-span-2 lg:block" />
            <main className="animate-pulse space-y-4 pt-2 lg:col-span-7">
              <div className="h-10 w-3/4 rounded-lg bg-gray-100" />
              <div className="h-10 w-1/2 rounded-lg bg-gray-100" />
              <div className="mt-4 flex items-center gap-3">
                <div className="size-10 rounded-full bg-gray-100" />
                <div className="space-y-2">
                  <div className="h-3 w-32 rounded bg-gray-100" />
                  <div className="h-3 w-24 rounded bg-gray-100" />
                </div>
              </div>
              <div className="h-72 w-full rounded-2xl bg-gray-100" />
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-3 w-full rounded bg-gray-100" />
              ))}
            </main>
          </div>
        </div>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 pt-20 text-center">
        <p className="text-lg font-bold text-gray-900">
          Artikel tidak ditemukan
        </p>
        <p className="text-sm text-gray-500">{error}</p>
      </div>
    );
  }

  if (!artikel) return null;

  // ── Normalisasi data dari API ────────────────────────────────────
  const penulisNama =
    artikel.penulis?.full_name ?? artikel.penulis?.username ?? "Anonim";
  const penulisAvatar =
    artikel.penulis?.avatar_url ??
    `https://ui-avatars.com/api/?name=${encodeURIComponent(penulisNama)}&background=1e1f78&color=fff`;

  const tanggal = artikel.waktu_publish
    ? new Date(artikel.waktu_publish).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "-";

  const wordCount = (artikel.konten_teks ?? "")
    .replace(/<[^>]+>/g, "")
    .split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  // commentsCount now uses state initialized in fetchDetail

  // ── Render ───────────────────────────────────────────────────────
  return (
    <div className="relative bg-white pt-20 pb-20 text-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Kolom tengah */}
          <main className="pt-2 lg:col-span-8">
            <header className="mb-8">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                {artikel.kategori && (
                  <span
                    className={`inline-block rounded-full bg-blue-500 px-3 py-1 text-xs font-semibold text-white`}
                  >
                    {artikel.kategori.nama}
                  </span>
                )}
                {(artikel.tags || []).map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <h1 className="mb-6 text-3xl leading-tight font-extrabold text-gray-900 sm:text-4xl md:text-5xl">
                {artikel.judul_artikel}
              </h1>
              <div className="flex items-center gap-4">
                <img
                  src={penulisAvatar}
                  alt={penulisNama}
                  className="h-10 w-10 rounded-full border border-gray-100"
                />
                <div className="text-sm">
                  <p className="font-bold text-gray-900">{penulisNama}</p>
                  <p className="text-gray-500">
                    {readTime} menit baca · {tanggal}
                  </p>
                </div>
              </div>
            </header>

            {/* Like & Comment Buttons Section */}
            <div className="mb-8 flex items-center gap-6 border-y border-gray-100 py-3">
              {/* Tombol Like */}
              <button
                onClick={handleLike}
                disabled={likeLoading}
                className={`flex items-center gap-2 transition-all disabled:opacity-60 ${
                  isLiked ? "text-red-600" : "text-gray-500 hover:text-gray-900"
                }`}
              >
                <svg
                  className={`h-6 w-6 ${isLiked ? "fill-current" : "fill-none"}`}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                  />
                </svg>
                <span className="text-sm font-medium">{likesCount}</span>
              </button>

              {/* Tombol Komentar Baru (Buka Drawer) */}
              <div className="flex items-center gap-2 text-gray-500 transition-all">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <span className="text-sm font-medium">{commentsCount}</span>
              </div>
            </div>

            {/* Konten artikel */}
            <article className="prose prose-lg max-w-none leading-relaxed text-gray-800">
              {artikel.foto_cover_url && (
                <img
                  src={artikel.foto_cover_url}
                  className="mb-10 w-full rounded-2xl shadow-lg"
                  alt={artikel.judul_artikel}
                />
              )}
              <div
                dangerouslySetInnerHTML={{ __html: artikel.konten_teks ?? "" }}
              />
            </article>
          </main>

          {/* Sidebar kanan — Menyuplai state dan props drawer */}
          <div className="sticky top-30 h-fit lg:col-span-4">
            <Sidebar
              comments={komentarList}
              commentsCount={commentsCount}
              komentarTeks={komentarTeks}
              onKomentarChange={(e) => setKomentarTeks(e.target.value)}
              onKomentarSubmit={handleKomentar}
              komentarLoading={komentarLoading}
              komentarError={komentarError}
              replyTo={replyTo}
              onReplyClick={(id, name) => setReplyTo({ id, name })}
              onCancelReply={() => setReplyTo(null)}
              onKomentarDelete={handleDeleteKomentar}
              isDetail={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetailPage;
