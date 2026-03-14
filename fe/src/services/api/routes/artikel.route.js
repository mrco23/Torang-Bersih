import api from "../axios";

export const artikelAPI = {
  getAll: (params) => api.get("/artikel", { params }),
  getPopular: () => api.get("/artikel/popular"),
  getTags: () => api.get("/artikel/tags"),
  getById: (id) => api.get(`/artikel/${id}`),
  getMyArtikel: (params) => api.get("/artikel/my-artikel", { params }),
  
  create: (data, fotoFile) => {
    if (fotoFile) {
      const formData = new FormData();
      formData.append("foto_cover", fotoFile);
      
      // Handle tags array specifically
      if (data.tags && Array.isArray(data.tags)) {
        data.tags.forEach(tag => formData.append("tags", tag));
      }
      
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'tags' && value !== "" && value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });
      return api.post("/artikel", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }
    return api.post("/artikel", data);
  },

  update: (id, data, fotoFile) => {
    if (fotoFile) {
      const formData = new FormData();
      formData.append("foto_cover", fotoFile);
      
      // Handle tags array specifically
      if (data.tags && Array.isArray(data.tags)) {
        data.tags.forEach(tag => formData.append("tags", tag));
      }
      
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'tags' && value !== "" && value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });
      return api.put(`/artikel/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }
    return api.put(`/artikel/${id}`, data);
  },

  delete: (id) => api.delete(`/artikel/${id}`),

  // Like operations
  toggleLike: (id) => api.post(`/artikel/${id}/like`),

  // Komentar operations
  getKomentar: (id, params) => api.get(`/artikel/${id}/komentar`, { params }),
  createKomentar: (id, data) => api.post(`/artikel/${id}/komentar`, data),
  updateKomentar: (id, komentarId, data) => api.put(`/artikel/${id}/komentar/${komentarId}`, data),
  deleteKomentar: (id, komentarId) => api.delete(`/artikel/${id}/komentar/${komentarId}`),
};
