import api from "../axios";

export const getAdminStats = async () => {
  const response = await api.get("/dashboard/admin");
  return response.data;
};

// Add other admin-related API calls here as needed
