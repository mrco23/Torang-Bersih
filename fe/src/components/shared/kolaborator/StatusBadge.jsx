const StatusBadge = ({ status }) => {
  if (status === "terverifikasi")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-bold text-green-700 ring-1 ring-green-600/20">
        <span className="size-1.5 rounded-full bg-green-500" />
        Terverifikasi
      </span>
    );
  if (status === "ditolak")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-700 ring-1 ring-red-600/20">
        <span className="size-1.5 rounded-full bg-red-500" />
        Ditolak
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 ring-1 ring-amber-600/20">
      <span className="size-1.5 animate-pulse rounded-full bg-amber-500" />
      Menunggu Verifikasi
    </span>
  );
};

export default StatusBadge;
