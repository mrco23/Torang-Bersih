import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

import FormTindakLanjut from "../../components/features/public/Laporan/FormTindakLanjut";
import DetailLaporanGallery from "../../components/features/public/Laporan/detail/DetailLaporanGallery";
import DetailLaporanInfo from "../../components/features/public/Laporan/detail/DetailLaporanInfo";
import DetailLaporanMap from "../../components/features/public/Laporan/detail/DetailLaporanMap";
import DetailLaporanTimeline from "../../components/features/public/Laporan/detail/DetailLaporanTimeline";
import DetailLaporanAction from "../../components/features/public/Laporan/detail/DetailLaporanAction";

import { laporanAPI } from "../../services/api/routes/laporan.route";
import toaster from "../../utils/toaster";

const defaultImage =
  "https://images.unsplash.com/photo-1618477461853-cf6ed80fbfc5?auto=format&fit=crop&w=1200&q=80";

const DetailLaporan = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [laporan, setLaporan] = useState(null);
  const [tindakLanjutList, setTindakLanjutList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [menyelesaikan, setMenyelesaikan] = useState(false);

  // MOCK AUTH STATE
  const isAuthenticated = true;

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [laporanRes, tindakLanjutRes] = await Promise.all([
        laporanAPI.getById(id),
        laporanAPI.getTindakLanjut(id).catch(() => ({ data: { data: [] } })),
      ]);
      setLaporan(laporanRes.data.data);
      setTindakLanjutList(tindakLanjutRes.data.data || []);
    } catch (err) {
      console.error(err);
      setError("Gagal memuat detail laporan. Laporan mungkin tidak ditemukan.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // FUNGSI NAVIGASI KE PETA PENUH
  const handleGoToMap = () => {
    if (!laporan) return;
    navigate("/peta", {
      state: {
        targetLocation: {
          lat: laporan.latitude,
          lng: laporan.longitude,
          name: `Laporan: ${laporan.id}`,
          type: "Laporan Sampah",
          status: laporan.status_laporan,
        },
      },
    });
  };

  const handleActionClick = () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=/laporan/${laporan.id}`);
    } else {
      setIsModalOpen(true);
    }
  };

  const handleSelesaikanLaporan = async () => {
    if (
      !window.confirm(
        "Apakah Anda yakin ingin menyelesaikan pelacakan laporan ini?",
      )
    )
      return;

    setMenyelesaikan(true);
    try {
      await laporanAPI.updateStatus(laporan.id, { status_laporan: "selesai" });
      toaster.success("Status laporan berhasil diperbarui menjadi Selesai.");
      fetchData();
    } catch (err) {
      console.error(err);
      toaster.error("Gagal memperbarui status laporan.");
    } finally {
      setMenyelesaikan(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-white pt-30 pb-24">
        <div className="size-10 animate-spin rounded-full border-4 border-gray-200 border-t-[#1e1f78]"></div>
      </div>
    );
  }

  if (error || !laporan) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-white pt-30 pb-24">
        <div className="mx-auto max-w-lg rounded-3xl bg-red-50 p-8 text-center text-red-600 ring-1 ring-red-100">
          <p className="text-lg font-semibold">
            {error || "Data tidak ditemukan."}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 text-sm font-bold underline hover:text-red-800"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "menunggu":
        return {
          bg: "bg-red-50",
          text: "text-red-700",
          ring: "ring-red-600/20",
          dot: "bg-red-500",
        };
      case "selesai":
        return {
          bg: "bg-emerald-50",
          text: "text-emerald-700",
          ring: "ring-emerald-600/20",
          dot: "bg-emerald-500",
        };
      default:
        return {
          bg: "bg-gray-50",
          text: "text-gray-700",
          ring: "ring-gray-600/20",
          dot: "bg-gray-500",
        };
    }
  };
  const statusColors = getStatusColor(laporan.status_laporan);

  const formatTanggal = (isoString) => {
    if (!isoString) return "-";
    const date = new Date(isoString);
    return (
      date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }) + " WITA"
    );
  };

  const pelaporName = laporan.pelapor
    ? laporan.pelapor.full_name || laporan.pelapor.username
    : "Anonim";
  const namaJenisSampah = laporan.jenis_sampah
    ? laporan.jenis_sampah.nama
    : "Tidak diketahui";
  const fotoBuktiUrls =
    laporan.foto_bukti_urls && laporan.foto_bukti_urls.length > 0
      ? laporan.foto_bukti_urls
      : [defaultImage];

  return (
    <div className="min-h-dvh bg-white pt-30 pb-24 selection:bg-[#1e1f78]/10 selection:text-[#1e1f78]">
      <div className="mx-auto max-w-[1160px] px-4 sm:px-6 lg:px-8">
        {/* HEADER SECTION */}
        <div className="mb-8">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div className="flex-1">
              <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-balance text-gray-900 md:text-4xl lg:text-[40px]">
                Timbulan Sampah di{" "}
                {laporan.alamat_lokasi.split(",")[0] || "Lokasi"}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span
                  className={`flex items-center gap-1.5 rounded-full ${statusColors.bg} px-3 py-1 text-xs font-bold ${statusColors.text} ring-1 ring-inset ${statusColors.ring}`}
                >
                  <span
                    className={`size-1.5 rounded-full ${statusColors.dot} ${laporan.status_laporan?.toLowerCase() === "menunggu" ? "animate-pulse" : ""}`}
                  ></span>
                  Status: {(laporan.status_laporan || "").toUpperCase()}
                </span>
                <span className="flex items-center gap-1 text-xs font-medium text-gray-500">
                  <svg
                    className="size-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Dilaporkan {formatTanggal(laporan.created_at)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* GALLERY SECTION */}
        <DetailLaporanGallery
          fotoBuktiUrls={fotoBuktiUrls}
          laporanStatus={laporan.status_laporan}
        />

        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
          {/* LEFT COLUMN: INFO & MAP */}
          <div className="flex flex-col gap-10 lg:col-span-7">
            <DetailLaporanInfo
              laporan={laporan}
              pelaporName={pelaporName}
              pelapor={laporan.pelapor}
              namaJenisSampah={namaJenisSampah}
            />
            <DetailLaporanMap laporan={laporan} />
          </div>

          {/* RIGHT COLUMN: ACTION & TRACKING */}
          <div className="relative z-10 lg:col-span-5">
            <div className="sticky top-28 rounded-3xl bg-white p-6 shadow-xl ring-1 shadow-gray-200/40 ring-gray-900/5 sm:p-8">
              <h3 className="mb-6 text-xl font-extrabold text-gray-900">
                Pelacakan Laporan
              </h3>

              <div className="relative ml-2 border-l-[3px] border-gray-100 pb-4">
                <div className="relative pl-6">
                  <span
                    className={`absolute top-1 -left-[11px] flex size-5 items-center justify-center rounded-full ring-4 ring-white ${laporan.status_laporan?.toLowerCase() === "menunggu" ? "bg-red-50" : laporan.status_laporan?.toLowerCase() === "ditolak" ? "bg-gray-100" : "bg-emerald-50"}`}
                  >
                    <span
                      className={`size-2.5 rounded-full ${laporan.status_laporan?.toLowerCase() === "menunggu" ? "animate-pulse bg-red-500" : laporan.status_laporan?.toLowerCase() === "ditolak" ? "bg-gray-500" : "bg-emerald-500"}`}
                    ></span>
                  </span>

                  <DetailLaporanTimeline
                    tindakLanjutList={tindakLanjutList}
                    laporanStatus={laporan.status_laporan}
                  />
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <DetailLaporanAction
                laporan={laporan}
                pelapor={laporan.pelapor}
                isAuthenticated={isAuthenticated}
                menyelesaikan={menyelesaikan}
                onActionClick={handleActionClick}
                onSelesaikanLaporan={handleSelesaikanLaporan}
                onGoToMap={handleGoToMap}
              />
            </div>
          </div>
        </div>
      </div>

      <FormTindakLanjut
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          fetchData(); // Refresh data after tindak lanjut is created
        }}
        laporanId={laporan?.id}
      />
    </div>
  );
};

export default DetailLaporan;
