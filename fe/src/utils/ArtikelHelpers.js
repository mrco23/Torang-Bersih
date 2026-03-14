export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("id-ID");
};

export const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getAvatarUrl = (user) => {
  if (user?.avatar_url) return user.avatar_url;
  const name = user?.username || user?.full_name || "U";
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`;
};
