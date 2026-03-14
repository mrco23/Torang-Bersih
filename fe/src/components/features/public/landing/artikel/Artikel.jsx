import React, { useEffect, useState } from "react";
import ArtikelHeadline from "./ArtikelHeadline";
import ArtikelItem from "./ArtikelItem";
import { HiFire } from "react-icons/hi";
// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react";
import { artikelAPI } from "../../../../../services/api/routes/artikel.route";

const Artikel = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLandingArtikel = async () => {
      setLoading(true);
      setError("");
      try {
        const params = {
          per_page: 5,
          sort_by: "created_at",
          sort_order: "desc",
          status_publikasi: "published",
        };

        const res = await artikelAPI.getAll(params);
        const data = res.data.data || [];

        setArticles(
          data.map((item) => ({
            id: item.id,
            slug: item.slug,
            title: item.judul_artikel,
            excerpt: item.excerpt ?? "",
            image: item.foto_cover_url ?? "",
            category: item.kategori?.nama ?? item.kategori ?? "",
            author:
              item.penulis?.full_name ?? item.penulis?.username ?? "Anonim",
            authorImage:
              item.penulis?.avatar_url ??
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                item.penulis?.full_name ?? "A",
              )}&background=1e1f78&color=fff`,
            date: item.waktu_publish
              ? new Date(item.waktu_publish).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : "-",
            views: item.jumlah_views ?? 0,
            likes: item.jumlah_likes ?? 0,
            comments: item.jumlah_komentar ?? 0,
            status: item.status_publikasi,
          })),
        );
      } catch (err) {
        setError(err.response?.data?.message || "Gagal memuat artikel.");
      } finally {
        setLoading(false);
      }
    };

    fetchLandingArtikel();
  }, []);

  const hasData = !loading && !error && articles.length > 0;
  const headline = hasData ? articles[0] : null;
  const artikelTerbaru = hasData ? articles.slice(1) : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.6 }}
      className="flex w-full justify-center px-4 py-16 md:px-6"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10">
        {/* Section Title */}
        <div className="flex flex-col items-center gap-3 text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Berita & Artikel
          </h2>
          <p className="max-w-2xl text-lg leading-7 font-medium text-gray-500">
            Informasi terkini seputar pengelolaan sampah dan lingkungan di
            Sulawesi Utara.
          </p>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-10">
          {/* Kolom Kiri — Headline */}
          <div className="w-full lg:w-[55%]">
            {loading && (
              <div className="h-[250px] w-full animate-pulse rounded-2xl bg-gray-100 md:h-[420px]" />
            )}
            {!loading && error && (
              <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">
                Gagal memuat artikel: {error}
              </div>
            )}
            {!loading && !error && headline && (
              <ArtikelHeadline
                id={headline.id}
                image={headline.image}
                author={headline.author}
                authorAvatar={headline.authorImage}
                title={headline.title}
                description={headline.excerpt}
              />
            )}
          </div>

          {/* Kolom Kanan — Terbaru */}
          <div className="flex w-full flex-col gap-5 rounded-2xl bg-white p-6 shadow-[0px_2px_15px_2px_rgba(0,0,0,0.1)] lg:w-[45%]">
            {/* Header Terbaru */}
            <div className="flex items-center gap-2">
              <HiFire className="text-3xl text-(--cyan)" />
              <h3 className="text-2xl font-semibold tracking-tight text-(--dark)">
                Terbaru
              </h3>
            </div>

            {/* List Artikel */}
            <div className="flex flex-col gap-5">
              {loading && (
                <>
                  {[...Array(3)].map((_, idx) => (
                    <div
                      key={idx}
                      className="flex animate-pulse flex-col gap-4 rounded-xl bg-white sm:flex-row"
                    >
                      <div className="h-[150px] w-full rounded-lg bg-gray-100 sm:h-[140px] sm:w-[200px]" />
                      <div className="flex flex-1 flex-col gap-3 py-0.5">
                        <div className="h-4 w-3/4 rounded bg-gray-100" />
                        <div className="h-3 w-1/2 rounded bg-gray-100" />
                        <div className="mt-auto flex gap-4">
                          <div className="h-3 w-10 rounded bg-gray-100" />
                          <div className="h-3 w-10 rounded bg-gray-100" />
                          <div className="h-3 w-10 rounded bg-gray-100" />
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}

              {!loading && error && (
                <p className="text-sm text-red-600">
                  Tidak dapat menampilkan artikel terbaru.
                </p>
              )}

              {!loading && !error && artikelTerbaru.length === 0 && hasData && (
                <p className="text-sm text-gray-500">
                  Belum ada artikel lainnya.
                </p>
              )}

              {!loading &&
                !error &&
                artikelTerbaru.length > 0 &&
                artikelTerbaru.map((item) => (
                  <ArtikelItem
                    key={item.id}
                    id={item.id}
                    image={item.image}
                    title={item.title}
                    views={item.views}
                    likes={item.likes}
                    comments={item.comments}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Artikel;
