import api from "../axios";

export const petaAPI = {
  getMarkers: (params) => api.get("/peta/markers", { params }),
};
