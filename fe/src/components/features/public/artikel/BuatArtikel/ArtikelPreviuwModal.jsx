import React from "react";
import {
  RiCloseLine,
  RiSendPlaneLine,
  RiEyeLine,
  RiTimeLine,
  RiFileTextLine,
  RiThumbUpLine,
  RiChat1Line,
  RiBookmarkLine,
  RiShareForwardLine,
  RiAlertLine,
  RiHeartLine,
} from "react-icons/ri";
import { getKatStylePreview } from "./constant";

const ArtikelPreviewModal = ({
  isOpen,
  onClose,
  form,
  // wordCount = 0,
  readTime = 1,
  canPublish = false,
  kategoriList = [],
  fotoPreview,
}) => {
  if (!isOpen) return null;

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user_profile") ?? "{}");
    } catch {
      return {};
    }
  })();
  const namaUser = user?.full_name ?? user?.username ?? "Penulis";
  const avatarUrl =
    user?.avatar_url ??
    `https://ui-avatars.com/api/?name=${encodeURIComponent(namaUser)}&background=1e1f78&color=fff&size=80`;
  const tanggalHari = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const kategoriIndex = kategoriList.findIndex(
    (k) => k.id === form.kategori_id,
  );
  const kategoriObj = kategoriIndex > -1 ? kategoriList[kategoriIndex] : null;
  const style =
    kategoriIndex > -1
      ? getKatStylePreview(kategoriIndex)
      : { color: "bg-gray-100 text-gray-700" };

  return (
    <>
      <div
        className="fixed inset-0 z-9990 bg-gray-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-9995 flex items-center justify-center p-4 sm:p-6">
        <div
          className="relative flex w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
          style={{ maxHeight: "calc(100vh - 2rem)" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex shrink-0 items-center justify-between border-b border-gray-100 bg-gray-50 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-amber-900 shadow-sm">
                <RiEyeLine className="h-4 w-4" /> MODE PREVIEW
              </div>
              <p className="hidden text-xs text-gray-500 sm:block">
                Inilah tampilan artikelmu bagi pembaca.
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-700"
              title="Tutup Preview"
            >
              <RiCloseLine className="h-6 w-6" />
            </button>
          </div>

          {!canPublish && (
            <div className="shrink-0 border-b border-red-100 bg-red-50 px-6 py-2.5">
              <p className="flex items-center gap-2 text-xs font-medium text-red-600">
                <RiAlertLine className="h-4 w-4" /> Artikel ini belum bisa
                diterbitkan. Pastikan judul dan topik sudah diisi.
              </p>
            </div>
          )}

          <div className="flex-1 overflow-y-auto px-6 py-8 sm:px-10">
            <div className="mx-auto grid max-w-4xl grid-cols-1 gap-10 md:grid-cols-12">
              <main className="md:col-span-8">
                <header className="mb-8">
                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    {kategoriObj && (
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${style.color}`}
                      >
                        {kategoriObj.nama}
                      </span>
                    )}
                    {(form.tags || []).map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <h1
                    className="mb-6 text-3xl leading-tight font-extrabold text-gray-900 sm:text-4xl"
                    style={{ fontFamily: "'Georgia', serif" }}
                  >
                    {form.judul_artikel || (
                      <span className="text-gray-300 italic">
                        Judul belum diisi...
                      </span>
                    )}
                  </h1>
                  <div className="flex items-center gap-4">
                    <img
                      src={avatarUrl}
                      alt={namaUser}
                      className="h-10 w-10 rounded-full border border-gray-100 object-cover shadow-sm"
                    />
                    <div className="text-sm">
                      <p className="font-bold text-gray-900">{namaUser}</p>
                      <p className="text-gray-500">
                        {readTime} menit baca · {tanggalHari}
                      </p>
                    </div>
                  </div>
                </header>

                <div className="mb-8 flex items-center justify-between border-y border-gray-100 py-3">
                  <div className="flex items-center gap-5 text-gray-400">
                    <span className="flex cursor-not-allowed items-center gap-1.5 text-sm hover:text-gray-500">
                      <RiHeartLine className="h-5 w-5" /> <span>0</span>
                    </span>
                    <span className="flex cursor-not-allowed items-center gap-1.5 text-sm hover:text-gray-500">
                      <RiChat1Line className="h-5 w-5" /> <span>0</span>
                    </span>
                  </div>
                </div>

                <article
                  className="prose prose-lg max-w-none leading-relaxed text-gray-800"
                  style={{ fontFamily: "'Georgia', serif" }}
                >
                  {fotoPreview && (
                    <img
                      src={fotoPreview}
                      className="mb-10 w-full rounded-2xl shadow-md"
                      alt={form.judul_artikel}
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  )}
                  {form.konten_teks ? (
                    <div
                      dangerouslySetInnerHTML={{ __html: form.konten_teks }}
                    />
                  ) : (
                    <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 py-20 text-center">
                      <p className="text-gray-400 italic">
                        Isi artikel belum ditulis...
                      </p>
                    </div>
                  )}
                </article>
              </main>

              <aside className="hidden md:col-span-4 md:block">
                <div className="sticky top-0 space-y-6">
                  <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                    <p className="mb-4 text-xs font-bold tracking-wider text-gray-400 uppercase">
                      Input Komentar
                    </p>
                    <div className="space-y-3 text-transparent!">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-gray-500"></span>
                        <span className="font-bold text-gray-900"></span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-gray-500"></span>
                        <span className="font-bold text-gray-900"></span>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                    <p className="mb-3 text-xs font-bold tracking-wider text-gray-400 uppercase">
                      Komentar Pembaca
                    </p>
                    <div className="flex flex-col items-center gap-2 py-6 text-center">
                      <RiChat1Line className="h-8 w-8 text-gray-300" />
                      <p className="text-xs leading-relaxed text-gray-400">
                        Belum ada komentar.
                        <br />
                        Fitur ini aktif setelah artikel diterbitkan.
                      </p>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>

          <div className="flex shrink-0 items-center justify-end gap-3 border-t border-gray-100 bg-white px-6 py-4">
            <button
              onClick={onClose}
              className="rounded-xl px-5 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-100"
            >
              Kembali Edit
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ArtikelPreviewModal;
