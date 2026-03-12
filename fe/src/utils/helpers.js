// Truncate text
export const truncateText = (text, maxLength = 50) => {
  if (!text) return "-";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

// Get file extension
export const getFileExtension = (filename) => {
  if (!filename) return "";
  return filename.split(".").pop().toLowerCase();
};

// Check if file is PDF
export const isPDF = (filename) => {
  return getFileExtension(filename) === "pdf";
};

// Check if file is image
export const isImage = (filename) => {
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
  return imageExtensions.includes(getFileExtension(filename));
};

// Generate initials from name
export const getInitials = (name) => {
  if (!name) return "?";
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

// Format estimasi berat laporan ke label rentang aslinya
export const formatBeratLaporan = (berat) => {
  if (!berat) return "-";
  
  // Mapping sesuai dengan dropdown yang dipilih pengguna saat pelaporan
  const numBerat = Number(berat);
  if (numBerat === 2.5) return "Kurang dari 5 kg";
  if (numBerat === 12.5) return "5 - 20 kg";
  if (numBerat === 35) return "20 - 50 kg";
  if (numBerat === 75) return "50 - 100 kg";
  if (numBerat === 150) return "Lebih dari 100 kg";
  
  // Default fallback jika nilai tak sesuai map
  return `${berat} kg`;
};
