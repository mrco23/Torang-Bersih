import React, { useState, useEffect } from "react";
import { 
  Users, 
  FileText, 
  MapPin, 
  Store, 
  Package, 
  Heart, 
  MessageSquare,
  AlertTriangle,
  TrendingUp,
  ArrowRight
} from "lucide-react";
import { getAdminStats } from "../../services/api/routes/admin.route";
import StatsCard from "../../components/ui/StatsCard";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import StatusGroupCard from "../../components/features/admin/StatusGroupCard";
import RecentActivityTable from "../../components/features/admin/RecentActivityTable";
import toast from "react-hot-toast";

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
      toast.error("Gagal mengambil data statistik dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <LoadingSpinner size="lg" />
        <p className="text-gray-500 font-medium animate-pulse">Memuat data dashboard...</p>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Dashboard Admin</h1>
          <p className="text-gray-500 mt-1">Ringkasan aktivitas dan performa sistem Torang-Bersih.</p>
        </div>
        <button 
          onClick={fetchStats}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
        >
          <TrendingUp size={16} className="text-primary" />
          Refresh Data
        </button>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-indigo-50/50 rounded-2xl p-6 border border-indigo-100 flex items-center gap-4 group hover:bg-indigo-50 transition-all cursor-default">
          <div className="w-12 h-12 rounded-xl bg-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-200 ring-4 ring-indigo-50">
            <Heart size={24} className="group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <p className="text-2xl font-bold text-indigo-900 leading-none mb-1">{stats.total_artikel_likes}</p>
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Total Likes Artikel</p>
          </div>
        </div>

        <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100 flex items-center gap-4 group hover:bg-blue-50 transition-all cursor-default">
          <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-200 ring-4 ring-blue-50">
            <MessageSquare size={24} className="group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-900 leading-none mb-1">{stats.total_artikel_komentar}</p>
            <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Total Komentar</p>
          </div>
        </div>

        <div className="bg-teal-50/50 rounded-2xl p-6 border border-teal-100 flex items-center gap-4 group hover:bg-teal-50 transition-all cursor-default">
          <div className="w-12 h-12 rounded-xl bg-teal-500 flex items-center justify-center text-white shadow-lg shadow-teal-200 ring-4 ring-teal-50">
            <ArrowRight size={24} className="group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <p className="text-2xl font-bold text-teal-900 leading-none mb-1">{stats.total_tindak_lanjut}</p>
            <p className="text-xs font-bold text-teal-600 uppercase tracking-wider">Laporan Ditindaklanjuti</p>
          </div>
        </div>
      </div>

      {/* Detailed Status Breakdown */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <div className="h-6 w-1 bg-primary rounded-full"></div>
          <h2 className="text-xl font-bold text-gray-800">Detail Status Konten</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-6 text-gray-800">
            <AlertTriangle size={20} className="text-red-500" />
            <h2 className="text-xl font-bold">Laporan Terbaru</h2>
          </div>
          <RecentActivityTable items={stats.recent_laporan} type="laporan" title="Daftar Laporan Terakhir" />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-6 text-gray-800">
            <FileText size={20} className="text-indigo-500" />
            <h2 className="text-xl font-bold">Artikel Terbaru</h2>
          </div>
          <RecentActivityTable items={stats.recent_artikel} type="artikel" title="Daftar Artikel Terakhir" />
        </div>

        <div className="xl:col-span-2">
          <div className="flex items-center gap-2 mb-6 text-gray-800">
            <Users size={20} className="text-primary" />
            <h2 className="text-xl font-bold">Kolaborator Terbaru</h2>
          </div>
          <RecentActivityTable items={stats.recent_kolaborator} type="kolaborator" title="Pendaftaran Kolaborator Baru" />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
