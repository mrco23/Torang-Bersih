import React, { useState, useEffect } from "react";
import {
  Users,
  FileText,
  MapPin,
  Store,
  Package,
  ThumbsUp,
  MessageSquare,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { getAdminStats } from "../../services/api/routes/dashboard.route";
import StatsCard from "../../components/ui/StatsCard";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import StatusGroupCard from "../../components/features/admin/StatusGroupCard";
import RecentActivityTable from "../../components/features/admin/RecentActivityTable";

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

const AdminDashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await getAdminStats();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error("Error fetching admin stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  if (!stats) return null;

  return (
    <div className="animate-in fade-in space-y-8 duration-500">
      {/* Header Section */}
      <div className="flex flex-col justify-between gap-4 border-b border-gray-100 pb-6 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Dashboard Admin
          </h1>
          <p className="mt-1 text-gray-500">
            Ringkasan aktivitas dan performa sistem Torang-Bersih.
          </p>
        </div>
        <button
          onClick={fetchStats}
          className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-700 shadow-sm transition-all hover:bg-gray-50"
        >
          <TrendingUp size={16} className="text-primary" />
          Refresh Data
        </button>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Pengguna"
          value={stats.total_users}
          icon={Users}
          colorVar="--primary"
          subtitle="Pengguna terdaftar"
        />
        <StatsCard
          title="Total Laporan"
          value={stats.total_laporan}
          icon={AlertTriangle}
          colorVar="--red"
          subtitle="Laporan sampah ilegal"
        />
        <StatsCard
          title="Total Artikel"
          value={stats.total_artikel}
          icon={FileText}
          colorVar="--indigo"
          subtitle="Edukasi & Berita"
        />
        <StatsCard
          title="Marketplace"
          value={stats.total_marketplace}
          icon={Store}
          colorVar="--green"
          subtitle="Barang daur ulang"
        />
      </div>

      {/* Engagement Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="group flex cursor-default items-center gap-4 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-6 transition-all hover:bg-indigo-50">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500 text-white shadow-lg ring-4 shadow-indigo-200 ring-indigo-50">
            <ThumbsUp
              size={24}
              className="transition-transform group-hover:scale-110"
            />
          </div>
          <div>
            <p className="mb-1 text-2xl leading-none font-bold text-indigo-900">
              {stats.total_artikel_likes}
            </p>
            <p className="text-xs font-bold tracking-wider text-indigo-600 uppercase">
              Total Likes Artikel
            </p>
          </div>
        </div>

        <div className="group flex cursor-default items-center gap-4 rounded-2xl border border-blue-100 bg-blue-50/50 p-6 transition-all hover:bg-blue-50">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500 text-white shadow-lg ring-4 shadow-blue-200 ring-blue-50">
            <MessageSquare
              size={24}
              className="transition-transform group-hover:scale-110"
            />
          </div>
          <div>
            <p className="mb-1 text-2xl leading-none font-bold text-blue-900">
              {stats.total_artikel_komentar}
            </p>
            <p className="text-xs font-bold tracking-wider text-blue-600 uppercase">
              Total Komentar
            </p>
          </div>
        </div>

        <div className="group flex cursor-default items-center gap-4 rounded-2xl border border-teal-100 bg-teal-50/50 p-6 transition-all hover:bg-teal-50">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500 text-white shadow-lg ring-4 shadow-teal-200 ring-teal-50">
            <ArrowRight
              size={24}
              className="transition-transform group-hover:scale-110"
            />
          </div>
          <div>
            <p className="mb-1 text-2xl leading-none font-bold text-teal-900">
              {stats.total_tindak_lanjut}
            </p>
            <p className="text-xs font-bold tracking-wider text-teal-600 uppercase">
              Laporan Ditindaklanjuti
            </p>
          </div>
        </div>
      </div>

      {/* Detailed Status Breakdown */}
      <div>
        <div className="mb-6 flex items-center gap-2">
          <div className="bg-primary h-6 w-1 rounded-full"></div>
          <h2 className="text-xl font-bold text-gray-800">
            Detail Status Konten
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatusGroupCard
            title="Laporan"
            stats={stats.laporan_per_status}
            icon={AlertTriangle}
            colorClass="red"
          />
          <StatusGroupCard
            title="Kolaborator"
            stats={stats.kolaborator_per_status}
            icon={MapPin}
            colorClass="primary"
          />
          <StatusGroupCard
            title="Artikel"
            stats={stats.artikel_per_status}
            icon={FileText}
            colorClass="indigo"
          />
          <StatusGroupCard
            title="Aset"
            stats={stats.aset_per_status}
            icon={Package}
            colorClass="orange"
          />
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
        <div>
          <div className="mb-6 flex items-center gap-2 text-gray-800">
            <AlertTriangle size={20} className="text-red-500" />
            <h2 className="text-xl font-bold">Laporan Terbaru</h2>
          </div>
          <RecentActivityTable
            items={stats.recent_laporan}
            type="laporan"
            title="Daftar Laporan Terakhir"
          />
        </div>

        <div>
          <div className="mb-6 flex items-center gap-2 text-gray-800">
            <FileText size={20} className="text-indigo-500" />
            <h2 className="text-xl font-bold">Artikel Terbaru</h2>
          </div>
          <RecentActivityTable
            items={stats.recent_artikel}
            type="artikel"
            title="Daftar Artikel Terakhir"
          />
        </div>

        <div className="xl:col-span-2">
          <div className="mb-6 flex items-center gap-2 text-gray-800">
            <Users size={20} className="text-primary" />
            <h2 className="text-xl font-bold">Kolaborator Terbaru</h2>
          </div>
          <RecentActivityTable
            items={stats.recent_kolaborator}
            type="kolaborator"
            title="Pendaftaran Kolaborator Baru"
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
