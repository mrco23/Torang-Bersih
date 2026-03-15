import React, { useEffect, useState, useRef, useCallback } from "react";
import ArticleCard from "../../components/features/public/artikel/articleCard";
import Sidebar from "../../components/features/public/artikel/Sidebar";
import { artikelAPI } from "../../services/api/routes/artikel.route";
import { referensiAPI } from "../../services/api/routes/referensi.route";
import { RiCloseLine } from "react-icons/ri";

// ── Loading skeleton (tidak ubah desain, hanya filler) ─────────
function ArticleSkeleton() {
  return (
    <div className="flex animate-pulse flex-col-reverse gap-6 border-b border-gray-100 py-8 sm:flex-row">
      <div className="flex flex-1 flex-col justify-center gap-3">
        <div className="h-3 w-32 rounded bg-gray-100" />
        <div className="h-5 w-3/4 rounded bg-gray-100" />
        <div className="h-5 w-1/2 rounded bg-gray-100" />
        <div className="h-3 w-1/4 rounded bg-gray-100" />
      </div>
      <div className="h-40 w-full shrink-0 rounded-md bg-gray-100 sm:h-32 sm:w-32 md:w-48" />
    </div>
  );
}

// ── Error state ─────────────────────────────────────────────────
function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <p className="text-base font-bold text-gray-900">Gagal memuat artikel</p>
      <p className="text-sm text-gray-500">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-2 rounded-full bg-gray-900 px-5 py-2 text-sm font-bold text-white hover:bg-black"
      >
        Coba Lagi
      </button>
    </div>
  );
}

// ── Pagination controls ─────────────────────────────────────────
function Pagination({ meta, page, onPage }) {
  if (!meta?.pagination) return null;
  const { has_prev, has_next, total_pages } = meta.pagination;
  if (total_pages <= 1) return null;

  return (
    <div className="mt-8 flex items-center justify-center gap-3">
      <button
        type="button"
        disabled={!has_prev}
        onClick={() => onPage(page - 1)}
        className="rounded-full border border-gray-200 px-5 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Sebelumnya
      </button>
      <span className="text-sm text-gray-500">
        Halaman {page} dari {total_pages}
      </span>
      <button
        type="button"
        disabled={!has_next}
        onClick={() => onPage(page + 1)}
        className="rounded-full border border-gray-200 px-5 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Berikutnya
      </button>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────
const ArtikelPage = () => {
  const [categories, setCategories] = useState([]);
  const [popularArticles, setPopularArticles] = useState([]);
  const [topics, setTopics] = useState([]);

  const [activeTab, setActiveTab] = useState("Terbaru");
  const [articles, setArticles] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");

  const [query, setQuery] = useState({
    page: 1,
    per_page: 10,
    search: "",
    kategori_id: "",
    tag: "",
    sort_by: "created_at",
    sort_order: "desc",
    status_publikasi: "published",
  });

  // Ref untuk auto-scroll ke bawah (komentar)
  const commentsSectionRef = useRef(null);

  // Helper: deteksi mobile
  const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;

  // Handler ketika tombol komentar di klik
  const handleCommentClick = useCallback(() => {
    if (isMobile && commentsSectionRef.current) {
      commentsSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [isMobile]);

  // Fetch meta data (categories, popular, tags)
  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const [catRes, popRes, tagRes] = await Promise.all([
          referensiAPI.getAll("kategori-artikel"),
          artikelAPI.getPopular(),
          artikelAPI.getTags(),
        ]);
        setCategories(catRes.data?.data || []);
        setPopularArticles(popRes.data?.data || []);
        setTopics(tagRes.data?.data || []);
      } catch (err) {
        console.error("Gagal memuat data meta sidebar", err);
      }
    };
    fetchMeta();
  }, []);

  const tabList = ["Terbaru", ...categories.map((c) => c.nama)];

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "Terbaru") {
      setQuery((q) => ({ ...q, page: 1, kategori_id: "" }));
    } else {
      const cat = categories.find((c) => c.nama === tab);
      if (cat) {
        setQuery((q) => ({ ...q, page: 1, kategori_id: cat.id }));
      }
    }
  };

  const handleSearchSubmit = () => {
    setQuery((q) => ({ ...q, page: 1, search: searchQuery }));
    setActiveTab("Terbaru");
  };

  const handleTagClick = (tag) => {
    setQuery((q) => ({ ...q, page: 1, tag: tag }));
    setActiveTab("Terbaru");
  };

  const clearTag = () => {
    setQuery((q) => ({ ...q, page: 1, tag: "" }));
  };

  const clearSearch = () => {
    setSearchQuery("");
    setQuery((q) => ({ ...q, page: 1, search: "" }));
  };

  const fetchArtikel = async () => {
    setLoading(true);
    setError("");
    try {
      const params = Object.fromEntries(
        // eslint-disable-next-line no-unused-vars
        Object.entries(query).filter(([_, v]) => v !== ""),
      );

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
          author: item.penulis?.full_name ?? item.penulis?.username ?? "Anonim",
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
      setMeta(res.data.meta || null);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal memuat artikel.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtikel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    query.page,
    query.kategori_id,
    query.search,
    query.tag,
    query.sort_by,
    query.sort_order,
  ]);

  return (
    <div className="bg-white pt-20 text-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
          {/* ── Konten utama ── */}
          <div className="lg:col-span-8">
            {/* Tab bar */}
            <div className="scrollbar-hide mb-0 flex overflow-x-auto border-b border-gray-200">
              {tabList.map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={`relative px-4 pb-4 text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab
                      ? "text-gray-900"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <span className="absolute bottom-0 left-0 h-[2px] w-full rounded-t-md bg-gray-900" />
                  )}
                </button>
              ))}
            </div>

            {/* Indikator Filter Aktif */}
            {(query.search || query.tag) && (
              <div className="mt-6 flex flex-wrap items-center gap-2">
                <span className="text-sm text-gray-500">
                  Menampilkan hasil untuk:
                </span>
                {query.search && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                    Pencarian: "{query.search}"
                    <button
                      onClick={clearSearch}
                      className="text-blue-500 hover:text-blue-900"
                    >
                      <RiCloseLine />
                    </button>
                  </span>
                )}
                {query.tag && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                    Tag: #{query.tag}
                    <button
                      onClick={clearTag}
                      className="text-gray-500 hover:text-gray-900"
                    >
                      <RiCloseLine />
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* ── Loading ── */}
            {loading && (
              <div className="flex flex-col">
                {[...Array(3)].map((_, i) => (
                  <ArticleSkeleton key={i} />
                ))}
              </div>
            )}

            {/* ── Error ── */}
            {!loading && error && (
              <ErrorState message={error} onRetry={fetchArtikel} />
            )}

            {/* ── Empty ── */}
            {!loading && !error && articles.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
                <p className="text-base font-bold text-gray-900">
                  Belum ada artikel
                </p>
                <p className="text-sm text-gray-500">
                  Kami tidak menemukan artikel yang sesuai dengan kriteria yang
                  Anda cari.
                </p>
              </div>
            )}

            {/* ── Daftar artikel ── */}
            {!loading && !error && articles.length > 0 && (
              <>
                <div className="flex flex-col">
                  {articles.map((item) => (
                    <ArticleCard
                      key={item.id}
                      article={{
                        id: item.id,
                        slug: item.slug,
                        title: item.title,
                        author: item.author,
                        authorImage: item.authorImage,
                        category: item.category,
                        date: item.date,
                        likes: item.likes,
                        comments: item.comments,
                        excerpt: item.excerpt,
                        image: item.image,
                        views: item.views,
                      }}
                      onCommentClick={handleCommentClick}
                    />
                  ))}
                </div>

                {/* Pagination */}
                <Pagination
                  meta={meta}
                  page={query.page}
                  onPage={(newPage) =>
                    setQuery((q) => ({ ...q, page: newPage }))
                  }
                />
                {/* Komentar Section Anchor (scroll target untuk mobile) */}
                <div
                  ref={commentsSectionRef}
                  id="comments-section-anchor"
                  style={{ height: 0 }}
                />
              </>
            )}
          </div>

          {/* ── Sidebar ── */}
          <div className="sticky top-30 hidden h-fit lg:col-span-4 lg:block">
            <Sidebar
              popularArticles={popularArticles}
              topics={topics}
              isDetail={false}
              searchQuery={searchQuery}
              onSearchChange={(e) => setSearchQuery(e.target.value)}
              onSearchSubmit={handleSearchSubmit}
              onTagClick={handleTagClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtikelPage;
