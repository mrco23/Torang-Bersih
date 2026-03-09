import api from "../axios";
export const referensiAPI = {
  getAll: (tipe, params) => api.get(`/referensi/${tipe}`, { params }),
  create: (tipe, data) => api.post(`/referensi/${tipe}`, data),
  update: (tipe, id, data) => api.put(`/referensi/${tipe}/${id}`, data),
  delete: (tipe, id) => api.delete(`/referensi/${tipe}/${id}`),
};
