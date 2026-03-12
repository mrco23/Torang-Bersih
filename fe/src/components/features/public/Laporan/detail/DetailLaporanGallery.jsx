import React, { useState } from "react";

const DetailLaporanGallery = ({ fotoBuktiUrls, laporanStatus }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);

  const openViewer = (index) => {
    setActiveImageIndex(index);
    setViewerOpen(true);
  };

  const len = fotoBuktiUrls.length;
  const isSelesaiClass =
    laporanStatus?.toLowerCase() === "selesai" ? "grayscale-30" : "";

  return (
    <div className="mb-12">
      {/* Grid Layout */}
      {(() => {
        if (len === 1) {
          return (
            <div
              className="h-[300px] w-full cursor-pointer overflow-hidden rounded-3xl sm:h-[400px] md:h-[480px]"
              onClick={() => openViewer(0)}
            >
              <img
                src={fotoBuktiUrls[0]}
                alt="Bukti 1"
                className={`size-full object-cover transition-transform duration-700 hover:scale-105 ${isSelesaiClass}`}
              />
            </div>
          );
        }
        if (len === 2) {
          return (
            <div className="flex h-[300px] w-full gap-2 overflow-hidden rounded-3xl sm:h-[400px] md:h-[480px]">
              <div
                className="relative w-1/2 cursor-pointer overflow-hidden bg-gray-100"
                onClick={() => openViewer(0)}
              >
                <img
                  src={fotoBuktiUrls[0]}
                  alt="Bukti 1"
                  className={`size-full object-cover transition-transform duration-700 hover:scale-105 ${isSelesaiClass}`}
                />
              </div>
              <div
                className="relative w-1/2 cursor-pointer overflow-hidden bg-gray-100"
                onClick={() => openViewer(1)}
              >
                <img
                  src={fotoBuktiUrls[1]}
                  alt="Bukti 2"
                  className={`size-full object-cover transition-transform duration-700 hover:scale-105 ${isSelesaiClass}`}
                />
              </div>
            </div>
          );
        }
        if (len === 3) {
          return (
            <div className="flex h-[300px] w-full gap-2 overflow-hidden rounded-3xl sm:h-[400px] md:h-[480px]">
              <div
                className="relative w-1/2 cursor-pointer overflow-hidden bg-gray-100"
                onClick={() => openViewer(0)}
              >
                <img
                  src={fotoBuktiUrls[0]}
                  alt="Bukti 1"
                  className={`size-full object-cover transition-transform duration-700 hover:scale-105 ${isSelesaiClass}`}
                />
              </div>
              <div className="grid w-1/2 grid-rows-2 gap-2">
                <div
                  className="relative cursor-pointer overflow-hidden bg-gray-100"
                  onClick={() => openViewer(1)}
                >
                  <img
                    src={fotoBuktiUrls[1]}
                    alt="Bukti 2"
                    className={`size-full object-cover transition-transform duration-700 hover:scale-105 ${isSelesaiClass}`}
                  />
                </div>
                <div
                  className="relative cursor-pointer overflow-hidden bg-gray-100"
                  onClick={() => openViewer(2)}
                >
                  <img
                    src={fotoBuktiUrls[2]}
                    alt="Bukti 3"
                    className={`size-full object-cover transition-transform duration-700 hover:scale-105 ${isSelesaiClass}`}
                  />
                </div>
              </div>
            </div>
          );
        }
        if (len === 4) {
          return (
            <div className="flex h-[300px] w-full gap-2 overflow-hidden rounded-3xl sm:h-[400px] md:h-[480px]">
              <div
                className="relative w-1/2 cursor-pointer overflow-hidden bg-gray-100"
                onClick={() => openViewer(0)}
              >
                <img
                  src={fotoBuktiUrls[0]}
                  alt="Bukti 1"
                  className={`size-full object-cover transition-transform duration-700 hover:scale-105 ${isSelesaiClass}`}
                />
              </div>
              <div className="grid w-1/2 grid-cols-2 grid-rows-2 gap-2">
                <div
                  className="relative col-span-2 cursor-pointer overflow-hidden bg-gray-100"
                  onClick={() => openViewer(1)}
                >
                  <img
                    src={fotoBuktiUrls[1]}
                    alt="Bukti 2"
                    className={`size-full object-cover transition-transform duration-700 hover:scale-105 ${isSelesaiClass}`}
                  />
                </div>
                <div
                  className="relative cursor-pointer overflow-hidden bg-gray-100"
                  onClick={() => openViewer(2)}
                >
                  <img
                    src={fotoBuktiUrls[2]}
                    alt="Bukti 3"
                    className={`size-full object-cover transition-transform duration-700 hover:scale-105 ${isSelesaiClass}`}
                  />
                </div>
                <div
                  className="relative cursor-pointer overflow-hidden bg-gray-100"
                  onClick={() => openViewer(3)}
                >
                  <img
                    src={fotoBuktiUrls[3]}
                    alt="Bukti 4"
                    className={`size-full object-cover transition-transform duration-700 hover:scale-105 ${isSelesaiClass}`}
                  />
                </div>
              </div>
            </div>
          );
        }

        // 5 or more
        return (
          <div className="group relative flex h-[300px] w-full gap-2 overflow-hidden rounded-3xl sm:h-[400px] md:h-[480px]">
            <div
              className="relative h-full w-full cursor-pointer overflow-hidden bg-gray-100 md:w-1/2"
              onClick={() => openViewer(0)}
            >
              <img
                src={fotoBuktiUrls[0]}
                alt="Bukti 1"
                className={`size-full object-cover transition-transform duration-700 hover:scale-105 ${isSelesaiClass}`}
              />
            </div>
            <div className="hidden h-full w-1/2 grid-cols-2 grid-rows-2 gap-2 md:grid">
              {fotoBuktiUrls.slice(1, 4).map((url, idx) => (
                <div
                  key={idx}
                  className="relative size-full cursor-pointer overflow-hidden bg-gray-100"
                  onClick={() => openViewer(idx + 1)}
                >
                  <img
                    src={url}
                    alt={`Bukti ${idx + 2}`}
                    className={`size-full object-cover transition-transform duration-700 hover:scale-105 ${isSelesaiClass}`}
                  />
                </div>
              ))}
              {/* Photo Thumbnail + N Count */}
              <div
                className="relative size-full cursor-pointer overflow-hidden bg-gray-100"
                onClick={() => openViewer(4)}
              >
                <img
                  src={fotoBuktiUrls[4]}
                  alt="Bukti 5"
                  className={`size-full object-cover transition-transform duration-700 hover:scale-105 ${isSelesaiClass}`}
                />
                {len > 5 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-xl font-bold text-white transition-colors hover:bg-black/50">
                    +{len - 5}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* FULLSCREEN IMAGE VIEWER MODAL */}
      {viewerOpen && (
        <div
          className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-black/85 backdrop-blur-sm"
          onClick={() => setViewerOpen(false)}
        >
          {/* Close Button */}
          <button
            onClick={() => setViewerOpen(false)}
            className="absolute top-28 right-5 z-101 rounded-full p-2 text-white transition hover:bg-white/10 active:scale-95"
          >
            <svg
              className="size-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {/* Top Controls */}
          <div
            className="absolute top-0 right-0 left-0 z-101 flex items-center justify-between p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-sm font-medium text-white/80">
              {activeImageIndex + 1} / {fotoBuktiUrls.length}
            </span>
            <button
              onClick={() => setViewerOpen(false)}
              className="rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20 active:scale-95"
            >
              <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Prev/Next Navigation */}
          {fotoBuktiUrls.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIndex((p) => p > 0 ? p - 1 : fotoBuktiUrls.length - 1);
                }}
                className="absolute top-1/2 left-4 z-101 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20 active:scale-95"
              >
                <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveImageIndex((p) => p < fotoBuktiUrls.length - 1 ? p + 1 : 0);
                }}
                className="absolute top-1/2 right-4 z-101 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20 active:scale-95"
              >
                <svg className="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Main Image View */}
          <div className="mb-16 flex h-full max-h-[80vh] w-full max-w-7xl items-center justify-center overflow-hidden px-8 md:mb-10 md:px-24">
            <img
              src={fotoBuktiUrls[activeImageIndex]}
              alt={`Bukti Laporan Fullscreen ${activeImageIndex + 1}`}
              className="max-h-[80vh] w-auto max-w-full cursor-default object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Thumbnails Strip at Bottom */}
          {fotoBuktiUrls.length > 1 && (
            <div
              className="scrollbar-hide absolute bottom-6 mx-auto flex max-w-full gap-2 overflow-x-auto px-4 py-2"
              onClick={(e) => e.stopPropagation()}
            >
              {fotoBuktiUrls.map((url, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                    idx === activeImageIndex
                      ? "border-white opacity-100"
                      : "border-transparent opacity-50 hover:opacity-100"
                  }`}
                >
                  <img src={url} alt={`Thumb ${idx}`} className="size-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DetailLaporanGallery;
