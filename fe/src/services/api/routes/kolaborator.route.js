import api from "../axios";
export const kolaboratorAPI = {
  getAll: (params) => api.get("/kolaborator", { params }),
  getById: (id) => api.get(`/kolaborator/${id}`),
  create: (data, logoFile) => {
    if (logoFile) {
      const formData = new FormData();
      formData.append("logo", logoFile);
      Object.entries(data).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });
      return api.post("/kolaborator", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }
    return api.post("/kolaborator", data);
  },
  update: (id, data) => api.put(`/kolaborator/${id}`, data),
  delete: (id) => api.delete(`/kolaborator/${id}`),
};
