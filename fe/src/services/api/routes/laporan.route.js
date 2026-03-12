import api from "../axios";
export const laporanAPI = {
  getAll: (params) => api.get("/laporan", { params }),
  getMilikSaya: (params) => api.get("/laporan/my-laporan", { params }),
  getById: (id) => api.get(`/laporan/${id}`),
  create: (data, fotoBuktiFiles) => {
    if (fotoBuktiFiles && fotoBuktiFiles.foto_bukti_urls) {
      const formData = new FormData();
      fotoBuktiFiles.foto_bukti_urls.forEach((file) => {
        formData.append("foto_bukti_urls", file);
      });
      Object.entries(data).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });
      return api.post("/laporan", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }
    return api.post("/laporan", data);
  },
  update: (id, data, fotoBuktiFiles = null) => {
    if (fotoBuktiFiles || (data && Array.isArray(data.existing_foto_bukti))) {
      const formData = new FormData();
      if (fotoBuktiFiles && fotoBuktiFiles.foto_bukti_urls) {
        fotoBuktiFiles.foto_bukti_urls.forEach((file) => {
          formData.append("foto_bukti_urls", file);
        });
      }
      Object.entries(data).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
          if (Array.isArray(value)) {
            value.forEach((val) => formData.append(key, val));
          } else {
            formData.append(key, value);
          }
        }
      });
      return api.put(`/laporan/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }
    return api.put(`/laporan/${id}`, data);
  },
  updateStatus: (id, data) => api.patch(`/laporan/${id}/status`, data),
  delete: (id) => api.delete(`/laporan/${id}`),

  // Tindak Lanjut
  getTindakLanjut: (laporanId) =>
    api.get(`/laporan/${laporanId}/tindak-lanjut`),
  createTindakLanjut: (laporanId, data, fotoFiles) => {
    if (fotoFiles) {
      const formData = new FormData();
      if (fotoFiles.foto_sebelum) {
        fotoFiles.foto_sebelum.forEach((file) =>
          formData.append("foto_sebelum_tindakan_urls", file),
        );
      }
      if (fotoFiles.foto_setelah) {
        fotoFiles.foto_setelah.forEach((file) =>
          formData.append("foto_setelah_tindakan_urls", file),
        );
      }
      Object.entries(data).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });
      return api.post(`/laporan/${laporanId}/tindak-lanjut`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }
    return api.post(`/laporan/${laporanId}/tindak-lanjut`, data);
  },
};
