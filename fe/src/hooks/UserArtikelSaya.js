/**
 * hooks/useArtikelSaya.js
 * Mengelola seluruh state dan logic fetch untuk halaman Artikel Saya.
 * Komponen hanya perlu memanggil hook ini, tanpa tahu detail API-nya.
 */

import { useState, useCallback, useEffect } from "react";
import { artikelAPI } from "../services/api/routes/artikel.route";

const PER_PAGE = 9;

export function useArtikelSaya() {
  // ── Data ──────────────────────────────────────────────────
  const [articles,   setArticles]   = useState([]);
  const [total,      setTotal]      = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // ── UI State ──────────────────────────────────────────────
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  // ── Query Params ──────────────────────────────────────────
  const [page,      setPage]      = useState(1);
  const [search,    setSearch]    = useState("");
  const [draft,     setDraft]     = useState(""); // nilai input sebelum di-submit
  const [sortBy,    setSortBy]    = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");

  // ── Delete State ──────────────────────────────────────────
  const [confirmId, setConfirmId] = useState(null);
  const [deleting,  setDeleting]  = useState(false);

  // ── Fetch ─────────────────────────────────────────────────
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data: body } = await artikelAPI.getMyArtikel({
        page,
        per_page:   PER_PAGE,   // ← per_page, bukan limit
        search,
        sort_by:    sortBy,
        sort_order: sortOrder,
      });

      setArticles(body.data ?? []);

      const pg = body.meta?.pagination ?? {};
      setTotal(      pg.total       ?? 0);
      setTotalPages( pg.total_pages ?? 1);
    } catch (err) {
      const msg = err?.response?.data?.message ?? "Gagal memuat artikel. Periksa koneksi.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [page, search, sortBy, sortOrder]);

  useEffect(() => { load(); }, [load]);

  // ── Handlers ──────────────────────────────────────────────
  const submitSearch = (e) => {
    e.preventDefault();
    setSearch(draft.trim());
    setPage(1);
  };

  const clearSearch = () => {
    setDraft("");
    setSearch("");
    setPage(1);
  };

  const toggleSort = (field) => {
    if (sortBy === field) setSortOrder((o) => (o === "desc" ? "asc" : "desc"));
    else { setSortBy(field); setSortOrder("desc"); }
    setPage(1);
  };

  const goPage = (n) => {
    if (n >= 1 && n <= totalPages) setPage(n);
  };

  const doDelete = async () => {
    if (!confirmId) return;
    setDeleting(true);
    try {
      await artikelAPI.delete(confirmId);
      setConfirmId(null);
      load();
    } catch {
      setError("Gagal menghapus artikel.");
    } finally {
      setDeleting(false);
    }
  };

  return {
    // data
    articles, total, totalPages, page,
    // ui
    loading, error, setError,
    // search
    draft, setDraft, search, submitSearch, clearSearch,
    // sort
    sortBy, sortOrder, toggleSort,
    // pagination
    goPage,
    // delete
    confirmId, setConfirmId, deleting, doDelete,
    // refresh
    load,
  };
}