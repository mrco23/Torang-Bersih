
import React from "react";
import { useNavigate } from "react-router-dom";
import { RiAddLine, RiArticleLine, RiAlertLine, RiCloseCircleLine } from "react-icons/ri";

import { useArtikelSaya } from "../../hooks/UserArtikelSaya";
import ArtikelCard from "../../components/features/user/UserMyArtikelPage/ArtikelCard";
import ArtikelToolbar from "../../components/features/user/UserMyArtikelPage/ArtikelToolbar";
import ArtikelPagination from "../../components/features/user/UserMyArtikelPage/ArtikelPagnition";
import ArtikelDeleteModal from "../../components/features/user/UserMyArtikelPage/ArtikelDeleteModal";
import ArtikelEditModal from "../../components/features/user/UserMyArtikelPage/ArtikelEditModal";
import { ArtikelSkeleton, ArtikelEmpty } from "../../components/features/user/UserMyArtikelPage/ArtikelStates";

export default function UserArtikelPage() {
  const navigate = useNavigate();
  const {
    articles,
    total,
    totalPages,
    page,
    loading,
    error,
    setError,
    draft,
    setDraft,
    search,
    submitSearch,
    clearSearch,
    sortBy,
    sortOrder,
    toggleSort,
    goPage,
    confirmId,
    setConfirmId,
    deleting,
    doDelete,
    // edit
    editId,
    setEditId,
    editingArt,
    updating,
    openEdit,
    doUpdate,
    load,
  } = useArtikelSaya();

  return (
    <div className="min-h-screen px-2 py-4 sm:px-4 md:px-6 lg:px-12 xl:px-28 2xl:px-10 transition-all">

      {/* Modal hapus */}
      <ArtikelDeleteModal
        open={!!confirmId}
        deleting={deleting}
        onCancel={() => setConfirmId(null)}
        onConfirm={doDelete}
      />

      {/* Modal edit */}
      <ArtikelEditModal
        isOpen={!!editId}
        onClose={() => setEditId(null)}
        article={editingArt}
        onSave={doUpdate}
        updating={updating}
      />

      {/* Header */}
      <div className="mb-8 flex flex-col-reverse items-start gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div>
          <h1 className="text-xl font-extrabold sm:text-2xl">Artikel Saya</h1>
          <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">
            Kelola tulisanmu — pantau status, edit, atau hapus kapan saja.
          </p>
        </div>
        <button
          onClick={() => navigate("/artikel/buat")}
          className="flex items-center gap-2 rounded-xl bg-[#1e1f78] px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#1a1b65] hover:shadow-md active:scale-95 sm:px-5 sm:py-2.5 sm:text-sm"
        >
          <RiAddLine className="h-4 w-4" />
          Tulis Artikel
        </button>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-5 flex flex-col items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 sm:flex-row sm:items-center sm:gap-3 sm:px-4 sm:py-3">
          <RiAlertLine className="h-4 w-4 shrink-0 text-red-500" />
          <p className="flex-1 text-xs text-red-700 sm:text-sm">{error}</p>
          <button onClick={() => setError("")} className="text-red-400 hover:text-red-600">
            <RiCloseCircleLine className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Toolbar: search + sort + refresh */}
      <ArtikelToolbar
        draft={draft}
        setDraft={setDraft}
        search={search}
        submitSearch={submitSearch}
        clearSearch={clearSearch}
        sortBy={sortBy}
        sortOrder={sortOrder}
        toggleSort={toggleSort}
        loading={loading}
        load={load}
      />

      {/* Jumlah artikel */}
      <p className="mb-5 flex items-center gap-1 text-[11px] text-gray-400 sm:gap-1.5 sm:text-xs">
        <RiArticleLine className="h-3 w-3.5 sm:h-3.5 sm:w-3.5" />
        {loading
          ? "Memuat…"
          : `${total} artikel${search ? ` untuk "${search}"` : ""}`}
      </p>

      {/* Grid / Skeleton / Empty */}
      {loading && articles.length === 0 ? (
        <ArtikelSkeleton />
      ) : articles.length === 0 ? (
        <ArtikelEmpty
          hasSearch={!!search}
          onReset={clearSearch}
          onWrite={() => navigate("/dashboard/artikel/buat")}
        />
      ) : (
        <div className="
          grid grid-cols-1 gap-4
          xs:grid-cols-2
          sm:gap-5
          sm:grid-cols-2
          md:grid-cols-3
          xl:grid-cols-3
          "
        >
          {articles.map((art) => (
            <ArtikelCard
              key={art.id}
              art={art}
              onView={() => navigate(`/artikel/${art.id}`)}
              onEdit={() => openEdit(art.id)}
              onDelete={() => setConfirmId(art.id)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="mt-8 flex justify-center">
        <ArtikelPagination page={page} totalPages={totalPages} goPage={goPage} />
      </div>
    </div>
  );
}
