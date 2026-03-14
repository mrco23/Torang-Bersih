// components/features/admin/artikel/AdminArtikelStats.jsx
import React from "react";
import {
  RiFileTextLine,
  RiCheckboxCircleLine,
  RiTimeLine,
  RiLineChartLine,
} from "react-icons/ri";
import StatsCard from "../../../ui/StatsCard";

const AdminArtikelStats = ({ meta, articles }) => {
  const total = meta?.total || 0;
  const totalPublished = articles.filter(
    (a) => a.status_publikasi === "published"
  ).length;
  const totalDraft = articles.filter(
    (a) => a.status_publikasi === "draft"
  ).length;
  const totalViews = articles.reduce(
    (sum, a) => sum + (a.jumlah_views || 0),
    0
  );

  const stats = [
    {
      title: "Total Artikel",
      value: total,
      icon: RiFileTextLine,
      colorVar: "--primary",
      subtitle: "Semua waktu",
    },
    {
      title: "Dipublikasikan",
      value: totalPublished,
      icon: RiCheckboxCircleLine,
      colorVar: "--cyan",
      subtitle: "Artikel terbit",
    },
    {
      title: "Menunggu Verifikasi",
      value: totalDraft,
      icon: RiTimeLine,
      colorVar: "--accent",
      subtitle: "Perlu review",
    },
    {
      title: "Total Views",
      value: totalViews.toLocaleString("id-ID"),
      icon: RiLineChartLine,
      colorVar: "--accent-dark",
      subtitle: "Akumulasi tampilan",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <StatsCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default AdminArtikelStats;