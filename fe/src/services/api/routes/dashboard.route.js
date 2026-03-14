import api from "../axios";

export const getAdminStats = async () => {
  const response = await api.get("/dashboard/admin");
  return response.data;
};

export const getUserStats = async () => {
  const response = await api.get("/dashboard/user");
  return response.data;
};
