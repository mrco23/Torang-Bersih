import api from "../axios";
export const laporanAPI = {
  getAll: (params) => api.get("/laporan", { params }),
  getById: (id) => api.get(`/laporan/${id}`),
  create: (data) => api.post("/laporan", data),
  updateStatus: (id, data) => api.patch(`/laporan/${id}/status`, data),
  delete: (id) => api.delete(`/laporan/${id}`),
  // Tindak Lanjut
  getTindakLanjut: (laporanId) =>
    api.get(`/laporan/${laporanId}/tindak-lanjut`),
  createTindakLanjut: (laporanId, data) =>
    api.post(`/laporan/${laporanId}/tindak-lanjut`, data),
};
