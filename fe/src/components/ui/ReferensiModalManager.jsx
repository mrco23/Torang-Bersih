import React, { useState, useEffect, useCallback } from "react";
import {
  RiCloseLine,
  RiAddLine,
  RiEditLine,
  RiDeleteBinLine,
  RiCheckLine,
  RiLoader4Line,
  RiInformationLine,
  RiSettings4Line,
  RiAlertLine,
} from "react-icons/ri";
import { referensiAPI } from "../../services/api/routes/referensi.route";
import toaster from "../../utils/toaster";

/**
 * ReferensiModalManager
 * Reusable modal for CRUD operations on reference tables (kategori, jenis, etc.)
 *
 * @param {string} tipe - The type string for API (e.g., 'kategori-artikel')
 * @param {string} label - Display label (e.g., 'Kategori Artikel')
 * @param {boolean} isOpen - Modal open state
 * @param {function} onClose - Function to close the modal
 */
export default function ReferensiModalManager({
  tipe,
  label,
  isOpen,
  onClose,
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Form state
  const [mode, setMode] = useState("list"); // list, add, edit
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({ nama: "", is_active: true });

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const res = await referensiAPI.getAll(tipe, { include_inactive: true });
      setItems(res.data.data || []);
    } catch {
      toaster.error(`Gagal memuat ${label}`);
    } finally {
      setLoading(false);
    }
  }, [tipe, label]);

  useEffect(() => {
    if (isOpen) {
      fetchItems();
      setMode("list");
    }
  }, [isOpen, fetchItems]);

  const handleOpenAdd = () => {
    setFormData({ nama: "", is_active: true });
    setMode("add");
  };

  const handleOpenEdit = (item) => {
    setSelectedItem(item);
    setFormData({ nama: item.nama, is_active: item.is_active });
    setMode("edit");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.nama.trim())
      return toaster.warning("Nama tidak boleh kosong");

    setActionLoading(true);
    try {
      if (mode === "add") {
        await referensiAPI.create(tipe, { nama: formData.nama });
        toaster.success(`${label} berhasil ditambahkan`);
      } else {
        // Extra confirmation if deactivating item in use
        if (selectedItem.usage_count > 0 && !formData.is_active) {
          const confirm = window.confirm(
            `${label} "${selectedItem.nama}" sedang digunakan oleh ${selectedItem.usage_count} data. Jika dinonaktifkan, data lama tidak akan hilang, namun kategori tidak akan muncul lagi di pilihan baru. Lanjutkan?`,
          );
          if (!confirm) return setActionLoading(false);
        }
        await referensiAPI.update(tipe, selectedItem.id, formData);
        toaster.success(`${label} berhasil diperbarui`);
      }
      setMode("list");
      fetchItems();
    } catch (err) {
      toaster.error(err.response?.data?.message || `Gagal menyimpan ${label}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (item) => {
    let confirmMsg = `Yakin ingin menonaktifkan ${label} "${item.nama}"?`;
    if (item.usage_count > 0) {
      confirmMsg = `${label} "${item.nama}" sedang digunakan oleh ${item.usage_count} data. Jika dinonaktifkan, data lama tidak akan hilang, namun kategori tidak akan muncul lagi di pilihan baru. Lanjutkan menonaktifkan?`;
    }

    if (!window.confirm(confirmMsg)) return;

    setActionLoading(true);
    try {
      await referensiAPI.delete(tipe, item.id);
      toaster.success(`${label} dinonaktifkan`);
      fetchItems();
    } catch {
      toaster.error(`Gagal menghapus ${label}`);
    } finally {
      setActionLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative flex h-full max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <RiSettings4Line className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Kelola {label}
              </h3>
              <p className="text-xs text-gray-500">
                Master data untuk modul terkait
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 font-bold text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <RiCloseLine className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {mode === "list" ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-gray-700">
                  Daftar {label}
                </h4>
                <button
                  onClick={handleOpenAdd}
                  className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white transition-all hover:bg-indigo-700 active:scale-95"
                >
                  <RiAddLine className="h-4 w-4" />
                  Tambah Baru
                </button>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <RiLoader4Line className="h-10 w-10 animate-spin text-indigo-600" />
                  <p className="mt-3 animate-pulse text-sm text-gray-500">
                    Memuat data...
                  </p>
                </div>
              ) : items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full bg-gray-50 p-4">
                    <RiInformationLine className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="mt-4 text-sm text-gray-500">
                    Belum ada data {label.toLowerCase()}.
                  </p>
                </div>
              ) : (
                <div className="overflow-hidden rounded-xl border border-gray-100 bg-gray-50/30">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                      <tr>
                        <th className="px-4 py-3">Nama</th>
                        <th className="px-4 py-3">Digunakan</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {items.map((item) => (
                        <tr
                          key={item.id}
                          className="group transition-colors hover:bg-indigo-50/30"
                        >
                          <td className="px-4 py-3 font-medium text-gray-900">
                            {item.nama}
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-xs font-semibold text-gray-600">
                              {item.usage_count || 0}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {item.is_active ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-bold text-green-600">
                                <RiCheckLine className="h-3 w-3" /> Aktif
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-600">
                                <RiCloseLine className="h-3 w-3" /> Tidak Aktif
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                              <button
                                onClick={() => handleOpenEdit(item)}
                                className="rounded-md p-1.5 text-blue-600 hover:bg-blue-50"
                                title="Edit"
                              >
                                <RiEditLine className="h-4 w-4" />
                              </button>
                              {item.is_active && (
                                <button
                                  onClick={() => handleDelete(item)}
                                  className="rounded-md p-1.5 text-red-600 hover:bg-red-50"
                                  title="Nonaktifkan"
                                >
                                  <RiDeleteBinLine className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            /* Add/Edit Form */
            <form onSubmit={handleSave} className="space-y-6 py-2">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">
                  Nama {label}
                </label>
                <input
                  type="text"
                  autoFocus
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm transition-all outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                  placeholder={`Masukkan nama ${label.toLowerCase()}...`}
                  value={formData.nama}
                  onChange={(e) =>
                    setFormData({ ...formData, nama: e.target.value })
                  }
                />
              </div>

              {mode === "edit" && (
                <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
                  <div>
                    <p className="text-sm font-bold text-gray-700">
                      Status Aktif
                    </p>
                    <p className="text-xs text-gray-500">
                      Matikan untuk menyembunyikan dari pilihan
                    </p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={formData.is_active}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          is_active: e.target.checked,
                        })
                      }
                    />
                    <div className="peer h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-indigo-600 after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white" />
                  </label>
                </div>
              )}

              {mode === "edit" &&
                selectedItem.usage_count > 0 &&
                !formData.is_active && (
                  <div className="flex items-start gap-3 rounded-xl bg-amber-50 p-4 text-amber-800">
                    <RiAlertLine className="mt-0.5 h-5 w-5 shrink-0" />
                    <div className="space-y-1 text-xs">
                      <p className="font-bold">
                        Peringatan: Data Sedang Digunakan
                      </p>
                      <p>
                        Referensi ini digunakan oleh{" "}
                        <strong>{selectedItem.usage_count}</strong> data. Jika
                        dinonaktifkan, data lama tetap aman, namun tidak akan
                        muncul lagi di pilihan form baru.
                      </p>
                    </div>
                  </div>
                )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setMode("list")}
                  className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex flex-2 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 disabled:opacity-50"
                >
                  {actionLoading && (
                    <RiLoader4Line className="h-4 w-4 animate-spin" />
                  )}
                  {mode === "add" ? "Tambah Data" : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer info (only in list mode) */}
        {mode === "list" && (
          <div className="border-t bg-gray-50/50 px-6 py-3 text-[10px] text-gray-400">
            * Referensi yang tidak aktif tidak akan muncul di input pilihan form
            user.
          </div>
        )}
      </div>
    </div>
  );
}
