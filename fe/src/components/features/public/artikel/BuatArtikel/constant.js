export const getKatStyle = (index) => {
  const styles = [
    { color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-300" },
    { color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-300" },
    { color: "text-green-700", bg: "bg-green-50", border: "border-green-300" },
    {
      color: "text-purple-700",
      bg: "bg-purple-50",
      border: "border-purple-300",
    },
    { color: "text-rose-700", bg: "bg-rose-50", border: "border-rose-300" },
    { color: "text-teal-700", bg: "bg-teal-50", border: "border-teal-300" },
  ];
  return styles[index % styles.length];
};

export const getKatStylePreview = (index) => {
  const styles = [
    { color: "bg-blue-100 text-blue-700" },
    { color: "bg-amber-100 text-amber-700" },
    { color: "bg-green-100 text-green-700" },
    { color: "bg-purple-100 text-purple-700" },
    { color: "bg-rose-100 text-rose-700" },
    { color: "bg-teal-100 text-teal-700" },
  ];
  return styles[index % styles.length];
};
