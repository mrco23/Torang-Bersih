import React, { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RiPencilLine, RiSearchLine } from "react-icons/ri";
import { useAuth } from "../../../../contexts/AuthContext";
// import toaster from "../../../../utils/toaster";

/**
 * Sidebar.jsx
 *
 * Perubahan:
 *  - Tambah tombol "Tulis Artikel" di atas sidebar normal
 *    → jika login: tombol langsung ke /artikel/buat
 *    → jika belum login: card ajakan dengan tombol "Masuk untuk Menulis"
 *
 * z-index drawer:
 *  - Overlay : z-[9998]
 *  - Panel   : z-[9999]
 */
export const Sidebar = ({
  popularArticles,
  topics,
  comments = [],
  commentsCount = 0,
  komentarTeks = "",
  onKomentarChange = () => {},
  onKomentarSubmit = () => {},
  komentarLoading = false,
  // komentarError = "",
  isDetail = false,
  replyTo = null,
  onReplyClick = () => {},
  onCancelReply = () => {},
  onKomentarDelete = () => {},
  searchQuery = "",
  onSearchChange = () => {},
  onSearchSubmit = () => {},
  onTagClick = () => {},
}) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const komentarInputRef = useRef(null);

  // if (komentarError) {
  //   toaster.error(komentarError);
  // }
  const onReplyClickFocus = (id, name) => {
    onReplyClick(id, name);
    window.scrollTo({
      behavior: "smooth",
    });
    setTimeout(() => {
      komentarInputRef.current.focus();
    }, 200);
  };

  return (
    <>
      {!isDetail ? (
        <aside className="hidden h-fit border-l border-gray-100 pl-8 lg:block">
          <div className="w-full">
            {/* ── Tombol Tulis Artikel ── */}
            {isAuthenticated ? (
              <div className="mb-6">
                <Link
                  to="/artikel/buat"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#1e1f78] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#1a1b65] active:scale-[0.98]"
                >
                  <RiPencilLine className="h-4 w-4" />
                  Tulis Artikel
                </Link>
              </div>
            ) : (
              <div className="mb-6 rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4 text-center">
                <p className="mb-3 text-sm leading-relaxed text-gray-500">
                  Punya cerita seputar lingkungan? Yuk bagikan!
                </p>
                <Link
                  to="/login"
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-[#1e1f78] px-4 py-2.5 text-sm font-semibold text-[#1e1f78] transition-all hover:bg-[#1e1f78] hover:text-white"
                >
                  <RiPencilLine className="h-4 w-4" />
                  Masuk untuk Menulis
                </Link>
              </div>
            )}

            {/* Divider */}
            <div className="mb-6 h-px bg-gray-100" />

            {/* ── Search Bar ── */}
            <div className="mb-7">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  onSearchSubmit();
                }}
                className="relative"
              >
                <input
                  type="text"
                  placeholder="Cari artikel..."
                  value={searchQuery}
                  onChange={onSearchChange}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pr-4 pl-10 text-sm transition-all outline-none placeholder:text-gray-400 focus:border-[#1e1f78] focus:bg-white focus:ring-1 focus:ring-[#1e1f78]"
                />
                <RiSearchLine className="absolute top-1/2 left-3.5 -translate-y-1/2 text-gray-400" />
              </form>
            </div>

            {/* ── Topik yang Sama ── */}
            {popularArticles && popularArticles.length > 0 && (
              <div className="mb-8">
                <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-gray-900">
                  <svg
                    className="h-5 w-5 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    />
                  </svg>
                  Artikel Populer
                </h3>
                <div className="flex flex-col gap-5">
                  {popularArticles.map((item, idx) => {
                    const authorName =
                      item.penulis?.full_name ||
                      item.penulis?.username ||
                      "Penulis";
                    const dateStr = new Date(
                      item.created_at,
                    ).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    });
                    return (
                      <div
                        key={item.id}
                        onClick={() => navigate(`/artikel/${item.id}`)}
                        className="group flex cursor-pointer items-start gap-3"
                      >
                        <div className="mt-0.5 shrink-0">
                          <span className="text-2xl font-black text-gray-200 transition-colors group-hover:text-blue-500">
                            0{idx + 1}
                          </span>
                        </div>
                        <div>
                          <h4 className="mb-1.5 line-clamp-2 text-sm leading-snug font-bold text-gray-900 transition-colors group-hover:text-blue-600">
                            {item.judul_artikel}
                          </h4>
                          <div className="flex items-center gap-2">
                            <img
                              src={
                                item.penulis?.avatar_url ||
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=random&size=24`
                              }
                              alt={authorName}
                              className="h-4 w-4 rounded-full object-cover shadow-sm"
                            />
                            <span className="text-[11px] font-medium text-gray-500">
                              {authorName} <span className="mx-0.5">•</span>{" "}
                              {dateStr}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── Jelajahi Topik ── */}
            {topics && topics.length > 0 && (
              <div className="mb-10">
                <h3 className="mb-4 text-base font-bold text-gray-900">
                  # Tag Populer
                </h3>
                <div className="flex flex-wrap gap-2">
                  {topics.map((topic, index) => (
                    <button
                      key={index}
                      onClick={() => onTagClick(topic)}
                      className="rounded-lg border border-gray-100 bg-gray-50 px-3.5 py-1.5 text-xs font-medium text-gray-600 transition-all hover:border-gray-300 hover:bg-gray-100 hover:text-gray-900"
                    >
                      #{topic}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>
      ) : (
        <aside className="h-fit lg:border-l lg:border-gray-100 lg:pl-8">
          <div className="flex h-full flex-col">
            {/* Header */}
            <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Komentar ({commentsCount})
              </h2>
            </div>

            {/* Body */}
            <div className="flex-1">
              {/* Input komentar */}
              {isAuthenticated ? (
                <div className="mb-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all focus-within:border-gray-400 focus-within:shadow-md">
                  {replyTo && (
                    <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-4 py-2">
                      <span className="text-xs font-medium text-gray-500 italic">
                        Membalas{" "}
                        <span className="font-bold text-blue-600">
                          @{replyTo.name}
                        </span>
                      </span>
                      <button
                        onClick={onCancelReply}
                        className="text-xs font-bold text-gray-400 hover:text-red-500"
                      >
                        Batal
                      </button>
                    </div>
                  )}
                  <div className="p-4">
                    <div className="mb-3 flex items-center gap-3">
                      <img
                        src={
                          user?.avatar_url ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.full_name)}&background=random&size=32`
                        }
                        alt="Anda"
                        className="h-8 w-8 rounded-full object-cover"
                      />
                      <span className="text-sm font-medium text-gray-800">
                        {user?.full_name}
                      </span>
                    </div>
                    <textarea
                      value={komentarTeks}
                      onChange={onKomentarChange}
                      disabled={komentarLoading}
                      ref={komentarInputRef}
                      className="min-h-[60px] w-full resize-none border-none text-sm text-gray-700 placeholder-gray-400 focus:ring-0 focus:outline-none disabled:opacity-60"
                      placeholder={
                        replyTo ? "Tulis balasan..." : "Berikan pendapatmu..."
                      }
                    />

                    <div className="mt-2 flex items-center justify-end pt-2">
                      <button
                        onClick={onKomentarSubmit}
                        disabled={komentarLoading || !komentarTeks.trim()}
                        className="rounded-full bg-green-600 px-5 py-2 text-sm font-medium text-white transition-all hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
                      >
                        {komentarLoading ? "..." : replyTo ? "Balas" : "Kirim"}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="group mb-8 cursor-pointer rounded-xl border border-gray-200 bg-gray-50 p-6 text-center transition-all hover:border-gray-300">
                  <p className="mb-4 text-sm font-medium text-gray-600 group-hover:text-gray-800">
                    Masuk untuk memberi komentar...
                  </p>
                  <Link
                    to="/login"
                    className="inline-block w-full rounded-full bg-green-600 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-green-700"
                  >
                    Masuk
                  </Link>
                </div>
              )}

              {/* Sort */}
              {comments.length > 0 && (
                <div className="mb-4 flex items-center border-b border-gray-100 pb-4">
                  <span className="cursor-pointer text-xs font-bold tracking-wide text-gray-900 uppercase transition-colors hover:text-gray-600">
                    Terbaru
                  </span>
                </div>
              )}

              {/* List komentar */}
              <div className="space-y-6">
                {comments.map((c, i) => (
                  <CommentItem
                    key={c.id || i}
                    comment={c}
                    onReplyClickFocus={onReplyClickFocus}
                    onKomentarDelete={onKomentarDelete}
                    currentUser={user}
                  />
                ))}
              </div>
            </div>
          </div>
        </aside>
      )}
    </>
  );
};

const CommentItem = ({
  comment,
  onReplyClickFocus,
  onKomentarDelete,
  currentUser,
  isReply = false,
}) => {
  const nama =
    comment.user?.full_name ??
    comment.user?.username ??
    (typeof comment.user === "string" ? comment.user : "Anonim");

  const avatarUrl =
    comment.user?.avatar_url ??
    comment.userImage ??
    `https://ui-avatars.com/api/?name=${encodeURIComponent(nama)}&background=random&size=32`;

  const teks = comment.isi_komentar ?? comment.text ?? "";

  const dateStr = comment.waktu_komentar
    ? new Date(comment.waktu_komentar).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
      })
    : "Baru saja";

  return (
    <div
      className={`group ${isReply ? "mt-0 ml-2 border-l border-gray-300 pb-2 pl-4" : ""}`}
    >
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={avatarUrl}
            alt={nama}
            className={`${isReply ? "h-6 w-6" : "h-8 w-8"} rounded-full object-cover shadow-sm`}
          />
          <div>
            <p
              className={`${isReply ? "text-[12px]" : "text-[13px]"} font-bold text-gray-900`}
            >
              {nama}
            </p>
            <p className="text-[10px] font-medium text-gray-400">{dateStr}</p>
          </div>
        </div>
      </div>
      <p
        className={`${isReply ? "text-[13px]" : "text-[14px]"} leading-relaxed text-gray-800`}
      >
        {teks}
      </p>

      <div className="mt-1 flex justify-end gap-3">
        {currentUser?.id === comment.id_user && (
          <button
            onClick={() => onKomentarDelete(comment.id)}
            className="text-[11px] font-bold text-red-400 transition-colors hover:text-red-600"
          >
            Hapus
          </button>
        )}
        {!isReply && (
          <button
            onClick={() => onReplyClickFocus(comment.id, nama)}
            className="text-[11px] font-bold text-gray-400 transition-colors hover:text-blue-600"
          >
            Balas
          </button>
        )}
      </div>

      {/* Render Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-0">
          {comment.replies.map((reply, idx) => (
            <CommentItem
              key={reply.id || idx}
              comment={reply}
              onReplyClickFocus={onReplyClickFocus}
              onKomentarDelete={onKomentarDelete}
              currentUser={currentUser}
              isReply={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Sidebar;
