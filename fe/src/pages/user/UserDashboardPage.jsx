import React, { useState, useEffect } from "react";
import { getUserStats } from "../../services/api/routes/dashboard.route";
import { useAuth } from "../../contexts/AuthContext";

import DashboardGreeting from "../../components/features/user/UserDashboardPage/DashboardGreating";
import DashboardStatCards from "../../components/features/user/UserDashboardPage/DashboardStatsCard";
import DashboardStatusPanel from "../../components/features/user/UserDashboardPage/DashboardStatusPanel";
import DashboardLaporanList from "../../components/features/user/UserDashboardPage/DashboardLaporanList";
import DashboardArtikelList from "../../components/features/user/UserDashboardPage/DashboardDartArtikelList";

function Skeleton({ className = "" }) {
  return (
    <div className={`animate-pulse rounded-2xl bg-gray-100 ${className}`} />
  );
}

function LoadingState() {
  return (
    <div className="space-y-5 p-4 sm:p-6 lg:p-8">
      <Skeleton className="h-[120px]" />
      <div className="grid grid-cols-3 gap-3">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
      <div className="grid grid-cols-6 gap-2">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-20" />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-52" />
        <Skeleton className="h-52" />
      </div>
      <Skeleton className="h-[280px]" />
    </div>
  );
}

// ─── Error state ──────────────────────────────────────────────────
function ErrorState({ refetch, message }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-6 text-center">
      <div className="flex size-20 items-center justify-center rounded-3xl bg-red-50">
        <svg
          className="size-10 text-red-400"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </svg>
      </div>
      <div>
        <p className="text-[17px] font-bold text-gray-900">Gagal Memuat Data</p>
        <p className="mt-1 text-[13px] text-gray-500">{message}</p>
      </div>
      <button
        type="button"
        onClick={refetch}
        className="rounded-xl bg-[#1e1f78] px-6 py-2.5 text-[13px] font-bold text-white shadow-sm transition hover:bg-[#1a1b65]"
      >
        Coba Lagi
      </button>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────
export default function UserDashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const data = await getUserStats();
      if (data.success) {
        setData(data.data);
      }
    } catch (error) {
      console.error("Error fetching user stats:", error);
      setErrorMsg(error.message || "Gagal mengambil data statistik dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Loading ──
  if (isLoading) return <LoadingState />;

  // ── Error ──
  if (errorMsg) return <ErrorState refetch={fetchStats} message={errorMsg} />;

  // ── Dashboard ──
  return (
    <div className="space-y-4 md:space-y-6">
      {/* 1. Hero greeting + quick actions (Sub-komponen) */}
      <DashboardGreeting namaUser={user.full_name} />

      {/* 2. Stat cards utama + mini aktivitas (Sub-komponen) */}
      <DashboardStatCards data={data} />

      {/* 3. Progress bars status laporan & artikel (Sub-komponen) */}
      <DashboardStatusPanel data={data} />

      {/* 4. Daftar laporan terbaru (Sub-komponen) */}
      <DashboardLaporanList data={data} />

      {/* 5. Daftar artikel terbaru (Sub-komponen) */}
      <DashboardArtikelList data={data} />
    </div>
  );
}
