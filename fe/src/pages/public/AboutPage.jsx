/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Map, Recycle, BookOpen, ArrowRight } from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

const AccordionItem = ({ title, content, isOpen, onClick }) => (
  <motion.div
    className="mb-4 overflow-hidden rounded-xl bg-[#1e1f78] text-white shadow-md transition duration-200 hover:shadow-blue-400/20"
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35 }}
  >
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between px-3 py-4 text-left text-sm font-bold transition hover:bg-[#232486] focus:outline-none sm:px-6 sm:py-5 sm:text-base"
    >
      <span>{title}</span>
      <ChevronDown
        className={`h-5 w-5 transition-transform duration-300${isOpen ? " rotate-180" : ""}`}
      />
    </button>

    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          key="content"
          initial="collapsed"
          animate="open"
          exit="collapsed"
          variants={{
            open: { height: "auto", opacity: 1 },
            collapsed: { height: 0, opacity: 0 },
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div className="border-t border-white/10 px-3 pt-3 pb-4 text-xs leading-relaxed text-blue-100 sm:px-6 sm:pb-5 sm:text-sm">
            {content}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

export default function AboutPage() {
  const [openAccordion, setOpenAccordion] = useState(0);

  const faqs = [
    {
      title: "Apakah Torang Bersih menerima dan menjemput sampah langsung?",
      content:
        "Torang Bersih adalah platform digital penghubung. Kami tidak memiliki armada penjemputan sendiri, melainkan menghubungkan Anda langsung dengan pengepul atau Bank Sampah terdekat di kota Manado yang telah terdaftar di ekosistem kami melalui fitur Lapak Daur Ulang.",
    },
    {
      title: "Bagaimana cara Bank Sampah atau Komunitas bergabung?",
      content:
        "Bank Sampah atau komunitas peduli lingkungan dapat mendaftar dengan membuat akun dan mengajukan verifikasi sebagai 'Kolaborator'. Setelah diverifikasi oleh tim admin, titik lokasi Anda akan muncul di Super Map dan Anda bisa menerima pasokan barang bekas dari warga.",
    },
  ];

  const staggerParent = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.13 },
    },
  };

  const fadeItem = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerParent}
      className="flex min-h-screen flex-col bg-white pt-24 text-gray-800 sm:pt-28"
    >
      <motion.div
        variants={fadeItem}
        className="mx-auto flex w-full max-w-[97vw] flex-col items-center px-2 sm:px-4 md:max-w-7xl md:px-8"
      >
        {/* Slot Logo */}
        <motion.div
          variants={fadeItem}
          className="group flex w-full items-center justify-center pt-6 pb-4 transition hover:scale-105 sm:pt-10 sm:pb-6"
        >
          <motion.img
            src="/images/logo-fill.png"
            alt="Logo Torang Bersih"
            className="w-24 max-w-[130px] transition duration-300 group-hover:scale-110 group-hover:drop-shadow-xl sm:w-40 sm:max-w-[180px]"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 0.6,
              delay: 0.18,
              type: "spring",
              stiffness: 110,
            }}
          />
        </motion.div>

        {/* HEADER */}
        <motion.div
          variants={fadeItem}
          className="mb-8 flex w-full flex-col items-center gap-1 text-center sm:mb-12"
        >
          <motion.p
            className="xs:text-xs mb-1 text-[11px] font-semibold tracking-widest text-gray-500 uppercase sm:text-sm"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.2 }}
          >
            <span className="font-bold text-[#1e1f78]">Torang Bersih</span>
            <span className="mx-1 font-thin text-gray-300">/</span>
            <span className="text-gray-800">Tentang Kami</span>
          </motion.p>
          <motion.h1
            className="xs:text-2xl mb-3 text-xl font-extrabold tracking-tight text-gray-900 sm:mb-4 sm:text-3xl md:text-4xl"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.27 }}
          >
            Tentang Torang Bersih
          </motion.h1>
          <motion.p
            className="xs:text-base max-w-[90vw] text-sm text-gray-600 sm:max-w-2xl sm:text-lg"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.37 }}
          >
            Kami hadir untuk merajut kolaborasi demi Manado yang lebih bersih
            dan berkelanjutan.
            <br className="hidden sm:inline" />
          </motion.p>
        </motion.div>

        {/* Gap antar section */}
        <div className="xs:h-8 h-5 sm:h-12"></div>

        {/* ─── SECTION 1: GAMBAR KIRI, TEKS KANAN ─── */}
        <motion.div
          variants={fadeItem}
          className="xs:gap-14 mb-16 grid w-full grid-cols-1 items-center gap-10 md:mb-20 md:gap-20 lg:grid-cols-[minmax(0,360px)_1fr] lg:gap-24 xl:grid-cols-[minmax(0,460px)_1fr] xl:gap-36"
        >
          <motion.div
            className="xs:max-w-[320px] group relative mx-auto w-full max-w-[95vw] sm:max-w-[420px] md:max-w-[460px] lg:mx-0"
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ duration: 0.7, type: "spring", stiffness: 80 }}
            style={{ minWidth: 0 }}
          >
            <div className="xs:-left-4 xs:-top-4 xs:bottom-12 xs:right-8 xs:rounded-tl-[80px] xs:rounded-br-[80px] absolute -top-2 right-4 bottom-8 -left-2 rounded-tl-[60px] rounded-br-[60px] bg-blue-50/80 sm:-top-8 sm:right-14 sm:bottom-14 sm:-left-8 sm:rounded-tl-[110px] sm:rounded-br-[110px]"></div>
            <motion.img
              src="/images/tpa.jpg"
              alt="Tpa Sumompow Over capacity"
              className="xs:rounded-2xl relative z-10 w-full rounded-xl object-cover shadow-lg transition duration-300 group-hover:scale-105 group-hover:shadow-blue-200"
              style={{ aspectRatio: "4/5" }}
              initial={{ scale: 0.93, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.65 }}
              transition={{ duration: 0.7, type: "spring", stiffness: 100 }}
            />
          </motion.div>
          <motion.div
            className="xs:space-y-5 xs:text-[16px] flex h-full flex-col justify-center space-y-4 text-[15px] leading-relaxed text-gray-600 sm:space-y-6 sm:text-[18px] lg:justify-start lg:pr-2 lg:pl-2 xl:pl-10"
            initial={{ opacity: 0, x: 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.65 }}
            transition={{ duration: 0.65, type: "spring", stiffness: 70 }}
            style={{ minWidth: 0 }}
          >
            <div className="space-y-4 sm:space-y-6 xl:space-y-7">
              <p className="max-w-3xl">
                <strong>Torang Bersih</strong> adalah inisiatif ekosistem
                digital hiperlokal yang dikembangkan oleh tim{" "}
                <strong>Lasalle Vibers</strong> dari Universitas Katolik De La
                Salle Manado untuk ajang kompetisi PROXOCORIS 2026. Mengambil
                kata <span className="whitespace-nowrap">"Torang"</span> yang
                berarti "Kita", platform ini lahir dari kesadaran bahwa krisis
                sampah di Sulawesi Utara tidak dapat diselesaikan oleh satu
                instansi saja.
              </p>
              <p className="max-w-3xl">
                Kami mengambil peran aktif untuk senantiasa menyebarkan
                kesadaran akan pentingnya kolaborasi antara warga penghasil
                sampah, Bank Sampah sebagai pendorong ekonomi sirkular, dan
                pemerintah sebagai pembuat kebijakan.
              </p>
              <p className="max-w-3xl">
                Mengusung visi sebagai <em>one-stop-solution platform</em>,
                Torang Bersih menjadi payung informasi mengenai pemantauan titik
                tumpukan sampah liar, bursa barang bekas daur ulang, serta wadah
                berkumpulnya para individu, aktivis lingkungan, dan semua pihak
                yang peduli pada kelestarian lingkungan hidup di Sulawesi Utara.
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Gap antar section */}
        <div className="xs:h-8 h-5 sm:h-12"></div>

        {/* == BANNER ANIMATED (Layout Diperbaiki agar tidak gepeng) == */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.7 }}
          transition={{ duration: 0.7, type: "spring", stiffness: 80 }}
          className="xs:px-6 xs:py-8 xs:gap-8 mx-auto mb-8 flex w-full max-w-[97vw] flex-col items-center justify-between gap-6 rounded-xl border border-blue-200 bg-linear-to-r from-[#1e1f78]/90 to-[#3f48cc] px-5 py-6 shadow sm:mb-14 sm:rounded-2xl sm:px-10 sm:py-10 md:max-w-7xl lg:flex-row"
        >
          <motion.div
            className="flex-1 text-center lg:text-left"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Judul dinaikkan ke atas paragraf agar rapi */}
            <span className="xs:text-2xl mb-2 block text-xl font-bold text-white drop-shadow sm:mb-3 sm:text-3xl">
              Ingin bergabung?
            </span>
            <p className="xs:text-sm mx-auto max-w-full text-xs leading-relaxed font-medium text-white/90 sm:text-base md:text-lg lg:mx-0 lg:max-w-2xl">
              <span className="block sm:inline">
                Jadi bagian perubahan lingkungan di Manado. Torang Bersih
                membuka kolaborasi dari semua kalangan, baik warga, komunitas,
                maupun pelaku usaha!
              </span>
              <span className="hidden sm:inline">
                {" "}
                Gabung sebagai anggota, relawan, Bank Sampah, atau sekadar
                menebar aksi inspirasi—semua bisa berkontribusi dari perangkat
                apapun.{" "}
              </span>
            </p>
          </motion.div>
          <motion.div
            className="xs:gap-4 mt-2 flex w-full shrink-0 flex-col justify-center gap-3 sm:w-auto sm:flex-row lg:mt-0"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ duration: 0.5, delay: 0.18 }}
          >
            <Link
              to="/register"
              className="xs:px-6 xs:text-sm inline-flex min-w-[140px] items-center justify-center rounded-lg bg-[#1e1f78] px-4 py-3 text-center text-xs font-bold text-white shadow-lg transition hover:brightness-95 sm:px-7 sm:py-3.5 sm:text-base"
            >
              Daftar Sekarang
            </Link>
            <Link
              to="/artikel"
              className="xs:px-6 xs:text-sm inline-flex min-w-[140px] items-center justify-center rounded-lg border border-white bg-transparent px-4 py-3 text-center text-xs font-bold text-white transition hover:bg-white/20 sm:px-7 sm:py-3.5 sm:text-base"
            >
              Pelajari Edukasi <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </motion.div>
        </motion.div>

        <div className="xs:h-8 h-5 sm:h-12"></div>

        <motion.div
          variants={fadeItem}
          className="xs:gap-14 mb-6 grid w-full grid-cols-1 items-center gap-10 md:mb-10 md:gap-20 lg:grid-cols-[1fr_minmax(0,360px)] lg:gap-24 xl:grid-cols-[1fr_minmax(0,460px)] xl:gap-36"
        >
          <motion.div
            className="order-2 lg:order-1"
            initial={{ opacity: 0, x: -80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ duration: 0.68, delay: 0.07 }}
          >
            <h2 className="xs:mb-8 xs:text-3xl mb-5 text-2xl leading-tight font-extrabold text-gray-900 sm:text-4xl">
              Platform Torang Bersih Memiliki 3 Pilar Utama
            </h2>
            <motion.div
              className="xs:mb-10 xs:gap-6 mb-8 flex flex-wrap gap-4 sm:gap-10"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.6 }}
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: 0.14 },
                },
              }}
            >
              <motion.div
                className="xs:gap-3 group flex items-center gap-2 transition"
                variants={fadeItem}
              >
                <div className="xs:h-12 xs:w-12 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-[#1e1f78] transition duration-300 group-hover:scale-110 group-hover:bg-blue-200">
                  <Map className="xs:h-5 xs:w-5 h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                </div>
                <span className="xs:text-base text-sm font-bold text-gray-900 transition group-hover:text-blue-800">
                  Pemantauan
                </span>
              </motion.div>
              <motion.div
                className="xs:gap-3 group flex items-center gap-2 transition"
                variants={fadeItem}
              >
                <div className="xs:h-12 xs:w-12 flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-700 transition-all duration-300 group-hover:scale-110 group-hover:bg-amber-200">
                  <Recycle className="xs:h-5 xs:w-5 h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                </div>
                <span className="xs:text-base text-sm font-bold text-gray-900 transition group-hover:text-amber-800">
                  Sirkular
                </span>
              </motion.div>
              <motion.div
                className="xs:gap-3 group flex items-center gap-2 transition"
                variants={fadeItem}
              >
                <div className="xs:h-12 xs:w-12 flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-700 transition-all duration-300 group-hover:scale-110 group-hover:bg-green-200">
                  <BookOpen className="xs:h-5 xs:w-5 h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                </div>
                <span className="xs:text-base text-sm font-bold text-gray-900 transition group-hover:text-green-800">
                  Edukasi
                </span>
              </motion.div>
            </motion.div>
            <motion.div
              className="xs:space-y-4 xs:text-[15px] space-y-3 text-[13px] leading-relaxed text-gray-600 sm:text-[16px]"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.7 }}
              transition={{ duration: 0.5, delay: 0.07 }}
            >
              <p>
                Dengan Torang Bersih, kami percaya bahwa ada elemen-elemen yang
                ingin kami sentuh dan itulah dasar keberhasilan untuk perubahan:
              </p>
              <ol className="xs:pl-5 list-decimal space-y-1 pl-4 font-medium text-gray-700">
                <li>Warga Masyarakat</li>
                <li>Pemerintah (Dinas Lingkungan Hidup)</li>
                <li>Komunitas & Bank Sampah</li>
                <li>Pengepul Barang Bekas</li>
              </ol>
              <p className="xs:pt-2 pt-1">
                Torang Bersih sangat terbuka untuk peluang kolaborasi dengan
                berbagai pihak demi mendukung upaya pelestarian alam dan
                lingkungan hidup di Indonesia.
              </p>
              <p>
                Kami percaya bahwa perjalanan panjang ke arah yang lebih baik
                selalu diawali dengan satu langkah, #TorangBisaTorangBersih.
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            className="xs:max-w-[320px] group relative order-1 mx-auto w-full max-w-[95vw] sm:max-w-[420px] md:max-w-[460px] lg:order-2 lg:mx-0 lg:ml-auto"
            initial={{ opacity: 0, x: 90 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ duration: 0.7 }}
            style={{ minWidth: 0 }}
          >
            <div className="xs:-bottom-4 xs:-right-4 xs:left-8 xs:top-8 xs:rounded-tr-[80px] xs:rounded-bl-[80px] absolute top-4 -right-2 -bottom-2 left-4 rounded-tr-[60px] rounded-bl-[60px] bg-gray-100 sm:top-14 sm:-right-8 sm:-bottom-8 sm:left-14 sm:rounded-tr-[110px] sm:rounded-bl-[110px]"></div>
            <motion.img
              src="/images/Scan.png"
              alt="User Torang Bersih"
              className="xs:rounded-2xl relative z-10 w-full rounded-xl object-cover shadow-lg transition duration-300 group-hover:scale-105 group-hover:shadow-green-200"
              style={{ aspectRatio: "4/5" }}
              initial={{ scale: 0.92, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.65 }}
              transition={{ duration: 0.7, type: "spring", stiffness: 100 }}
            />
          </motion.div>
        </motion.div>

        <section className="xs:max-w-2xl xs:px-4 xs:py-10 mx-auto mt-4 mb-16 flex w-full max-w-[97vw] flex-col items-center rounded-xl border border-gray-200 bg-white px-2 py-6 shadow sm:mt-8 sm:mb-24 sm:max-w-3xl sm:rounded-2xl sm:px-8 sm:py-12">
          <h2 className="xs:text-2xl xs:mb-5 mb-4 text-center text-xl font-bold tracking-tight text-[#1e1f78] md:text-3xl">
            Pertanyaan Umum
          </h2>
          <p className="xs:mb-8 xs:max-w-2xl xs:text-sm mb-6 max-w-full text-center text-xs font-medium text-gray-600 sm:text-base">
            Temukan jawaban atas pertanyaan yang sering diberikan tentang Torang
            Bersih.
            <br />
            Masih ada yang ingin ditanyakan?{" "}
            <a
              href="mailto:info@torangbersih.com"
              className="font-semibold text-[#1e1f78] underline"
            >
              Hubungi kami!
            </a>
          </p>
          <div className="xs:max-w-md mx-auto w-full max-w-[97vw] sm:max-w-xl">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="xs:mb-3 mb-2 rounded-xl border border-gray-100 bg-[#f7f8fc] shadow-sm transition hover:border-blue-100"
              >
                <button
                  onClick={() =>
                    setOpenAccordion(openAccordion === index ? -1 : index)
                  }
                  className="xs:px-4 xs:py-4 xs:text-sm flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-xs font-semibold text-[#222364] transition hover:bg-blue-50 focus:outline-none sm:px-6"
                >
                  <span>{faq.title}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-[#1e1f78] transition-transform duration-300${openAccordion === index ? " rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {openAccordion === index && (
                    <motion.div
                      key="content"
                      initial="collapsed"
                      animate="open"
                      exit="collapsed"
                      variants={{
                        open: { height: "auto", opacity: 1 },
                        collapsed: { height: 0, opacity: 0 },
                      }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="xs:px-4 xs:pb-4 xs:text-sm border-t border-gray-100 px-3 pt-2 pb-3 text-xs leading-relaxed text-gray-700 sm:px-6">
                        {faq.content}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>
      </motion.div>
    </motion.div>
  );
}
