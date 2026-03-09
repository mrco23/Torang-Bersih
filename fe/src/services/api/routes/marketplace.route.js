import api from "../axios";
export const marketplaceAPI = {
  getAll: (params) => api.get("/marketplace", { params }),
  getById: (id) => api.get(`/marketplace/${id}`),
  create: (data) => api.post("/marketplace", data),
  update: (id, data) => api.put(`/marketplace/${id}`, data),
  delete: (id) => api.delete(`/marketplace/${id}`),
};
