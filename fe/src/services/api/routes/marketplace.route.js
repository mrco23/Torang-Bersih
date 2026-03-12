import api from "../axios";
export const marketplaceAPI = {
  getAll: (params) => api.get("/marketplace", { params }),
  getById: (id) => api.get(`/marketplace/${id}`),
  create: (data, fotoBarangFiles) => {
    if (fotoBarangFiles) {
      const formData = new FormData();
      fotoBarangFiles.foto_barang_urls.forEach((file) => {
        formData.append("foto_barang_urls", file);
      });
      Object.entries(data).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
          if (Array.isArray(value)) {
            value.forEach((val) => formData.append(key, val));
          } else {
            formData.append(key, value);
          }
        }
      });
      return api.post("/marketplace", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }
    return api.post("/marketplace", data);
  },
  update: (id, data, fotoBarangFiles = null) => {
    if (fotoBarangFiles || (data && Array.isArray(data.existing_pictures))) {
      const formData = new FormData();
      if (fotoBarangFiles && fotoBarangFiles.foto_barang_urls) {
        fotoBarangFiles.foto_barang_urls.forEach((file) => {
          formData.append("foto_barang_urls", file);
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
      return api.put(`/marketplace/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }
    return api.put(`/marketplace/${id}`, data);
  },
  delete: (id) => api.delete(`/marketplace/${id}`),
  updateKetersediaan: (id, data) =>
    api.patch(`/marketplace/${id}/update-ketersediaan`, data),
  getMyMarketplace: (params) =>
    api.get("/marketplace/my-marketplace", { params }),
};
