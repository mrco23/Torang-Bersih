import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { kolaboratorAPI } from "../../services/api/routes/kolaborator.route";
import { referensiAPI } from "../../services/api/routes/referensi.route";
import StatusBadge from "../../components/shared/kolaborator/StatusBadge";
import KolaboratorDetailModal from "../../components/shared/kolaborator/KolaboratorDetailModal";
import KolaboratorEditModal from "../../components/shared/kolaborator/KolaboratorEditModal";
import toaster from "../../utils/toaster";

function UserKolaboratorPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [jenisOptions, setJenisOptions] = useState([]);

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await kolaboratorAPI.getMy();
      setItems(res.data.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Gagal memuat data kolaborator Anda",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Fetch jenis options when edit modal opens
  useEffect(() => {
    if (editing && jenisOptions.length === 0) {
      referensiAPI
        .getAll("jenis-kolaborator", { include_inactive: true })
        .then((res) => setJenisOptions(res.data.data || []))
        .catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editing]);

  const handleDelete = async (id) => {
    if (!confirm("Hapus kolaborator ini?")) return;
    try {
      await kolaboratorAPI.delete(id);
      toaster.success("Kolaborator berhasil dihapus");
      fetchItems();
      if (selected?.id === id) setSelected(null);
      if (editing?.id === id) setEditing(null);
    } catch (err) {
      toaster.error(
        err.response?.data?.message || "Gagal menghapus kolaborator",
      );
    }
  };

  const openEdit = (item) => {
    setSelected(null);
    setEditing(item);
  };

  const handleEditSubmit = async (formData, logoFile) => {
    setSubmitting(true);
    try {
      await kolaboratorAPI.update(editing.id, formData, logoFile);
      toaster.success("Data kolaborator berhasil diperbarui!");
      setEditing(null);
      fetchItems();
    } catch (err) {
      toaster.error(
        err.response?.data?.message || "Gagal memperbarui data kolaborator",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ── Empty State ──────────────────────────────────────────────────
  if (!loading && !error && items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="mb-6 flex size-28 items-center justify-center rounded-full bg-linear-to-br from-blue-50 to-indigo-100">
          <svg
            className="size-14 text-(--primary)"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
            />
          </svg>
        </div>
        <h2 className="mb-2 text-xl font-bold text-gray-900">
          Belum Ada Kolaborator
        </h2>
        <p className="mb-8 max-w-sm text-sm text-gray-500">
          Anda belum mendaftarkan organisasi atau komunitas sebagai kolaborator.
          Daftarkan sekarang dan bergabung dalam gerakan perubahan!
        </p>
        <button
          onClick={() => navigate("/kolaborator/daftar")}
          className="flex items-center gap-2 rounded-xl bg-(--primary) px-8 py-3 text-sm font-bold text-white shadow-(--primary)/25 shadow-lg transition hover:bg-(--primary-dark) active:scale-95"
        >
          <svg
            className="size-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Daftar Kolaborator Baru
        </button>
      </div>
    );
  }

  return (
    <div className="relative space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Kolaborator Saya</h1>
          <p className="mt-1 text-sm text-gray-500">
            Daftar organisasi/komunitas yang Anda daftarkan sebagai kolaborator.
          </p>
        </div>
        <button
          onClick={() => navigate("/kolaborator/daftar")}
          className="flex shrink-0 items-center gap-2 rounded-xl bg-(--primary) px-5 py-2.5 text-sm font-bold text-white transition hover:bg-(--primary-dark) active:scale-95"
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
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Daftar Baru
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="size-8 animate-spin rounded-full border-4 border-(--primary) border-t-transparent" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="group flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md"
            >
              {/* Card Header */}
              <div className="flex items-start gap-3 p-5 pb-3">
                <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                  {item.logo_url ? (
                    <img
                      src={item.logo_url}
                      alt="Logo"
                      className="size-full object-cover"
                    />
                  ) : (
                    <span className="text-lg font-bold text-gray-400">
                      {item.nama_organisasi?.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3
                    className="truncate text-sm font-bold text-gray-900"
                    title={item.nama_organisasi}
                  >
                    {item.nama_organisasi}
                  </h3>
                  <p className="mt-0.5 truncate text-xs text-gray-500">
                    {item.jenis_kolaborator?.nama || "—"}
                  </p>
                </div>
              </div>
              {/* Card Body */}
              <div className="flex-1 space-y-2.5 px-5 pb-4">
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <svg
                    className="size-3.5 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0115 0z"
                    />
                  </svg>
                  <span className="truncate">
                    {item.kabupaten_kota || "Lokasi belum diisi"}
                  </span>
                </div>
                <StatusBadge status={item.status_verifikasi} />
              </div>
              {/* Card Footer */}
              <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/50 px-5 py-3">
                <span className="text-[10px] text-gray-400">
                  {new Date(item.created_at).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(item)}
                    className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-(--primary) ring-1 ring-(--primary)/20 transition hover:bg-(--primary)/5"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setSelected(item)}
                    className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-gray-700 ring-1 ring-gray-200 transition hover:bg-gray-100"
                  >
                    Detail
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <KolaboratorDetailModal
          data={selected}
          onClose={() => setSelected(null)}
          footerActions={
            <>
              <button
                onClick={() => handleDelete(selected.id)}
                className="flex items-center gap-1.5 text-sm font-bold text-red-500 transition hover:text-red-700"
              >
                <svg
                  className="size-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Hapus
              </button>
              <div className="flex gap-3">
                <button
                  onClick={() => openEdit(selected)}
                  className="rounded-xl bg-(--primary) px-6 py-2.5 text-sm font-bold text-white transition hover:bg-(--primary-dark)"
                >
                  Edit Data
                </button>
              </div>
            </>
          }
        />
      )}

      {/* Edit Modal */}
      {editing && (
        <KolaboratorEditModal
          data={editing}
          jenisOptions={jenisOptions}
          onClose={() => setEditing(null)}
          onSubmit={handleEditSubmit}
          submitting={submitting}
        />
      )}
    </div>
  );
}

export default UserKolaboratorPage;
