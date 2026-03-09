import api from "../axios";
export const kolaboratorAPI = {
  getAll: (params) => api.get("/kolaborator", { params }),
  getById: (id) => api.get(`/kolaborator/${id}`),
  create: (data) => api.post("/kolaborator", data),
  update: (id, data) => api.put(`/kolaborator/${id}`, data),
  delete: (id) => api.delete(`/kolaborator/${id}`),
};
