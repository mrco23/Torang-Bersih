import api from "../axios";
export const asetAPI = {
  getAll: (params) => api.get("/aset", { params }),
  getById: (id) => api.get(`/aset/${id}`),
  create: (data, fotoAsetFiles) => {
    if (fotoAsetFiles) {
      const formData = new FormData();
      fotoAsetFiles.foto_aset_urls.forEach((file) => {
        formData.append("pictures_urls", file);
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
      return api.post("/aset", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }
    return api.post("/aset", data);
  },
  update: (id, data, fotoAsetFiles = null) => {
    // Force FormData if sending files or if there are existing pictures to ensure backend gets array
    if (fotoAsetFiles || (data && Array.isArray(data.existing_pictures))) {
      const formData = new FormData();
      if (fotoAsetFiles && fotoAsetFiles.foto_aset_urls) {
        fotoAsetFiles.foto_aset_urls.forEach((file) => {
          formData.append("pictures_urls", file);
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
      return api.put(`/aset/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }
    return api.put(`/aset/${id}`, data);
  },
  delete: (id) => api.delete(`/aset/${id}`),
  verify: (id, data) => api.patch(`/aset/${id}/verify`, data),
  getMyAset: (params) => api.get("/aset/my-aset", { params }),
};
