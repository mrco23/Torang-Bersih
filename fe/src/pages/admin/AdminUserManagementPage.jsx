import { useState, useEffect } from "react";
import { userAPI } from "../../services/api/routes/user.route";
import { toast } from "react-hot-toast";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState({
    page: 1,
    per_page: 10,
    search: "",
    role: "",
    is_verified: "",
    sort_by: "created_at",
    sort_order: "desc",
  });

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      // Bersihkan params kosong sebelum dikirim
      const params = Object.fromEntries(
        // eslint-disable-next-line no-unused-vars
        Object.entries(query).filter(([_, v]) => v !== ""),
      );
      const res = await userAPI.getAll(params);
      setUsers(res.data.data);
      setMeta(res.data.meta?.pagination);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memuat data user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.page, query.role, query.is_verified, query.sort_order]);

  const handleSearch = (e) => {
    e.preventDefault();
    setQuery((q) => ({ ...q, page: 1 }));
    fetchUsers();
  };

  const handleDeactivate = async (userId) => {
    if (!confirm("Nonaktifkan user ini?")) return;
    try {
      await userAPI.deactivate(userId);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal menonaktifkan user");
    }
  };

  const handleActivate = async (userId) => {
    if (!confirm("Aktifkan user ini?")) return;
    try {
      await userAPI.activate(userId);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal mengaktifkan user");
    }
  };

  const handleDelete = async (userId) => {
    if (!confirm("Hapus user ini? Tindakan ini tidak bisa dibatalkan.")) return;
    try {
      await userAPI.delete(userId);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal menghapus user");
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Manajemen User</h1>

      {/* Filter & Search */}
      <div className="space-y-3 rounded-xl ring ring-gray-300 border-gray-100 bg-white p-3 shadow-sm md:p-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Cari email, username, nama..."
            value={query.search}
            onChange={(e) =>
              setQuery((q) => ({ ...q, search: e.target.value }))
            }
            className="flex-1 rounded-lg ring ring-gray-300 px-3 py-2 text-sm focus:ring-1 focus:ring-(--primary) focus:outline-none md:px-4"
          />
          <button
            type="submit"
            className="cursor-pointer rounded-lg bg-(--primary) px-3 py-2 text-sm text-white transition hover:bg-(--primary-dark) md:px-4"
          >
            Cari
          </button>
        </form>

        <div className="flex flex-wrap gap-2 md:gap-3">
          <select
            value={query.role}
            onChange={(e) =>
              setQuery((q) => ({ ...q, role: e.target.value, page: 1 }))
            }
            className="rounded-lg ring ring-gray-300 px-2 py-2 text-sm focus:ring-1 focus:ring-(--primary) focus:outline-none md:px-3"
          >
            <option value="">Semua Role</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <select
            value={query.is_verified}
            onChange={(e) =>
              setQuery((q) => ({ ...q, is_verified: e.target.value, page: 1 }))
            }
            className="rounded-lg ring ring-gray-300 px-2 py-2 text-sm focus:ring-1 focus:ring-(--primary) focus:outline-none md:px-3"
          >
            <option value="">Semua Status</option>
            <option value="true">Terverifikasi</option>
            <option value="false">Belum Verifikasi</option>
          </select>

          <select
            value={query.sort_order}
            onChange={(e) =>
              setQuery((q) => ({ ...q, sort_order: e.target.value, page: 1 }))
            }
            className="rounded-lg ring ring-gray-300 px-2 py-2 text-sm focus:ring-1 focus:ring-(--primary) focus:outline-none md:px-3"
          >
            <option value="desc">Terbaru</option>
            <option value="asc">Terlama</option>
          </select>
        </div>
      </div>

      {/* Table / Card view */}
      <div className="overflow-hidden rounded-xl ring ring-gray-300 bg-white shadow-sm">
        {error && (
          <div className="bg-red-50 p-4 text-sm text-red-600">{error}</div>
        )}

        {loading ? (
          <div className="flex justify-center p-10">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-(--primary) border-t-transparent" />
          </div>
        ) : users.length === 0 ? (
          <div className="p-10 text-center text-sm text-gray-400">
            Tidak ada user ditemukan
          </div>
        ) : (
          <>
            {/* Desktop: Table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-100 bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">
                      Username
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">
                      Nama Lengkap
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">
                      Role
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">
                      Masuk via
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-600">
                      Dibuat
                    </th>
                    <th className="px-4 py-3 text-right font-medium text-gray-600">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.map((user) => (
                    <tr key={user.id} className="transition hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {user.avatar_url ? (
                            <img
                              src={user.avatar_url}
                              alt=""
                              referrerPolicy="no-referrer"
                              className="h-8 w-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-(--primary)">
                              {user.username?.charAt(0).toUpperCase() || "?"}
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-800">
                              {user.username || "-"}
                            </p>
                            <p className="text-xs text-gray-400">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">{user.full_name || "-"}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${user.role === "admin"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-gray-100 text-gray-600"
                            }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {!user.is_active ? (
                          <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-600">
                            Nonaktif
                          </span>
                        ) : user.is_verified ? (
                          <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-600">
                            Aktif
                          </span>
                        ) : (
                          <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-600">
                            Belum Verifikasi
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-500 capitalize">
                        {user.auth_provider === "google" ? "Google" : "Email"}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400">
                        {new Date(user.created_at).toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {user.is_active ? (
                            <button
                              onClick={() => handleDeactivate(user.id)}
                              className="text-xs text-yellow-600 transition hover:text-yellow-800"
                            >
                              Nonaktifkan
                            </button>
                          ) : (
                            <button
                              onClick={() => handleActivate(user.id)}
                              className="text-xs text-green-600 transition hover:text-green-800"
                            >
                              Aktifkan
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="text-xs text-red-500 transition hover:text-red-700"
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile: Card view */}
            <div className="divide-y divide-gray-100 md:hidden">
              {users.map((user) => (
                <div key={user.id} className="space-y-3 p-4">
                  {/* User info */}
                  <div className="flex items-center gap-3">
                    {user.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt=""
                        referrerPolicy="no-referrer"
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-(--primary)">
                        {user.full_name?.charAt(0).toUpperCase() || "?"}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-gray-800">
                        {user.full_name || "-"}
                      </p>
                      <p className="truncate text-xs text-gray-400">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${user.role === "admin"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-gray-100 text-gray-600"
                        }`}
                    >
                      {user.role}
                    </span>
                    {!user.is_active ? (
                      <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-600">
                        Nonaktif
                      </span>
                    ) : user.is_verified ? (
                      <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-600">
                        Aktif
                      </span>
                    ) : (
                      <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-600">
                        Belum Verifikasi
                      </span>
                    )}
                    <span className="text-xs text-gray-400">
                      {user.auth_provider === "google"
                        ? "🔵 Google"
                        : "✉️ Email"}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(user.created_at).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-1">
                    {user.is_active && (
                      <button
                        onClick={() => handleDeactivate(user.id)}
                        className="text-xs font-medium text-yellow-600 transition hover:text-yellow-800"
                      >
                        Nonaktifkan
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-xs font-medium text-red-500 transition hover:text-red-700"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Pagination */}
        {meta && (
          <div className="flex flex-col items-center justify-between gap-2 border-t border-gray-100 px-4 py-3 text-sm text-gray-500 sm:flex-row">
            <span>
              Menampilkan {users.length} dari {meta.total} user
            </span>
            <div className="flex gap-2">
              <button
                disabled={!meta.has_prev}
                onClick={() => setQuery((q) => ({ ...q, page: q.page - 1 }))}
                className="rounded-lg border px-3 py-1 transition hover:bg-gray-50 disabled:opacity-40"
              >
                ← Prev
              </button>
              <span className="px-3 py-1">
                {meta.page} / {meta.total_pages}
              </span>
              <button
                disabled={!meta.has_next}
                onClick={() => setQuery((q) => ({ ...q, page: q.page + 1 }))}
                className="rounded-lg border px-3 py-1 transition hover:bg-gray-50 disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
