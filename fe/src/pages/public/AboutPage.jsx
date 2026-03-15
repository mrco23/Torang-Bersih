import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Map, Recycle, BookOpen, ArrowRight } from "lucide-react";
import Logo from "../../../public/images/Logo.png";
import Tpa from "../../../public/images/tpa.jpg";
import Scan from "../../../public/images/Scan.png";
import { motion, AnimatePresence } from "framer-motion";

// --- Komponen Accordion (dengan animasi Framer Motion) ---
const AccordionItem = ({ title, content, isOpen, onClick }) => (
  <motion.div
    className="mb-4 overflow-hidden rounded-xl bg-[#1e1f78] text-white shadow-md transition duration-200 hover:shadow-blue-400/20"
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35 }}
  >
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between px-6 py-5 text-left font-bold focus:outline-none hover:bg-[#232486] transition"
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
            collapsed: { height: 0, opacity: 0 }
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          <div className="border-t border-white/10 px-6 pb-5 pt-3 text-sm leading-relaxed text-blue-100">
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
      className="min-h-screen bg-white pt-28 text-gray-800 flex flex-col"
    >
      <motion.div
        variants={fadeItem}
        className="mx-auto w-full max-w-7xl px-4 sm:px-8 flex flex-col items-center"
      >
        {/* Slot Logo */}
        <motion.div
          variants={fadeItem}
          className="flex w-full justify-center items-center pt-10 pb-6 transition group hover:scale-105"
        >
          <motion.img
            src={Logo}
            alt=""
            className="w-50 max-w-[180px] transition duration-300 group-hover:drop-shadow-xl group-hover:scale-110"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.18, type: "spring", stiffness: 110 }}
          />
        </motion.div>

        {/* HEADER */}
        <motion.div
          variants={fadeItem}
          className="w-full flex flex-col items-center text-center gap-1 mb-12"
        >
          <motion.p
            className="text-xs sm:text-sm font-semibold tracking-widest text-gray-500 uppercase mb-1"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.2 }}
          >
            <span className="text-[#1e1f78] font-bold">Torang Bersih</span>
            <span className="mx-1 text-gray-300 font-thin">/</span>
            <span className="text-gray-800">Tentang Kami</span>
          </motion.p>
          <motion.h1
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 mb-4"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.27 }}
          >
            Tentang Torang Bersih
          </motion.h1>
          <motion.p
            className="max-w-2xl text-base/relaxed sm:text-lg text-gray-600"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.37 }}
          >
            Kami hadir untuk merajut kolaborasi demi Manado yang lebih bersih dan berkelanjutan.<br className="hidden sm:inline" />
          </motion.p>
        </motion.div>

        {/* Gap antar section */}
        <div className="h-8 sm:h-12"></div>

        {/* ─── SECTION 1: GAMBAR KIRI, TEKS KANAN ─── */}
        <motion.div
          variants={fadeItem}
          className="mb-20 grid grid-cols-1 items-center gap-20 lg:grid-cols-[minmax(0,460px)_1fr] lg:gap-36 w-full"
        >
          <motion.div
            className="relative mx-auto w-full max-w-[460px] lg:mx-0 group"
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ duration: 0.7, type: "spring", stiffness: 80 }}
          >
            <div className="absolute -left-8 -top-8 bottom-14 right-14 rounded-tl-[110px] rounded-br-[110px] bg-blue-50/80"></div>
            <motion.img
              src={Tpa}
              alt="Tpa Sumompow Over capacity"
              className="relative z-10 w-full rounded-2xl object-cover shadow-lg transition duration-300 group-hover:scale-105 group-hover:shadow-blue-200"
              style={{ aspectRatio: "4/5" }}
              initial={{ scale: 0.93, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.65 }}
              transition={{ duration: 0.7, type: "spring", stiffness: 100 }}
            />
          </motion.div>
          <motion.div
            className="space-y-6 text-gray-600 leading-relaxed text-[18px]"
            initial={{ opacity: 0, x: 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.65 }}
            transition={{ duration: 0.65, type: "spring", stiffness: 70 }}
          >
            <p>
              <strong>Torang Bersih</strong> adalah inisiatif ekosistem digital hiperlokal yang dikembangkan oleh tim <strong>Lasalle Vibers</strong> dari Universitas Katolik De La Salle Manado untuk ajang kompetisi PROXOCORIS 2026.
              Mengambil kata "Torang" yang berarti "Kita", platform ini lahir dari kesadaran bahwa krisis sampah di Tempat Pemrosesan Akhir (TPA) Sumompo tidak dapat diselesaikan oleh satu instansi saja.
            </p>
            <p>
              Kami mengambil peran aktif untuk senantiasa menyebarkan kesadaran akan pentingnya kolaborasi antara warga penghasil sampah, Bank Sampah sebagai pendorong ekonomi sirkular, dan pemerintah sebagai pembuat kebijakan.
            </p>
            <p>
              Mengusung visi sebagai <em>one-stop-solution platform</em>, Torang Bersih menjadi payung informasi mengenai pemantauan titik tumpukan sampah liar, bursa barang bekas daur ulang, serta wadah berkumpulnya para individu, aktivis lingkungan, dan semua pihak yang peduli pada kelestarian lingkungan hidup di Sulawesi Utara.
            </p>
          </motion.div>
        </motion.div>

        {/* Gap antar section */}
        <div className="h-8 sm:h-12"></div>

        {/* == BANNER ANIMATED == */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.7 }}
          transition={{ duration: 0.7, type: "spring", stiffness: 80 }}
          className="w-full max-w-7xl mx-auto mb-14 rounded-2xl bg-gradient-to-r from-[#1e1f78]/90 to-[#3f48cc] px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-blue-200 shadow"
        >
          <motion.div
            className="text-center md:text-left flex-1"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="text-2xl font-bold text-white drop-shadow">
              Ingin bergabung?
            </span>
          </motion.div>
          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ duration: 0.5, delay: 0.18 }}
          >
            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-lg bg-[#1e1f78] px-7 py-3 text-sm font-bold text-white shadow-lg hover:brightness-95 transition"
            >
              Daftar Sekarang
            </Link>
            <Link
              to="/artikel"
              className="inline-flex items-center justify-center rounded-lg border border-white px-7 py-3 text-sm font-bold text-white bg-transparent hover:bg-white/20 transition"
            >
              Pelajari Edukasi <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Gap antar section */}
        <div className="h-8 sm:h-12"></div>

        {/* ─── SECTION 2: TEKS KIRI, GAMBAR KANAN ─── */}
        <motion.div
          variants={fadeItem}
          className="mb-24 grid grid-cols-1 items-center gap-20 lg:grid-cols-[1fr_minmax(0,460px)] lg:gap-36 w-full"
        >
          <motion.div
            className="order-2 lg:order-1"
            initial={{ opacity: 0, x: -80 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ duration: 0.68, delay: 0.07 }}
          >
            <h2 className="mb-8 text-3xl font-extrabold leading-tight text-gray-900 sm:text-4xl">
              Platform Torang Bersih Memiliki 3 Pilar Utama
            </h2>
            <motion.div
              className="mb-10 flex flex-wrap gap-6 sm:gap-10"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.6 }}
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: 0.14 }
                }
              }}
            >
              <motion.div className="flex items-center gap-3 group transition" variants={fadeItem}>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-[#1e1f78] transition duration-300 group-hover:bg-blue-200 group-hover:scale-110">
                  <Map className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <span className="font-bold text-gray-900 transition group-hover:text-blue-800">Pemantauan</span>
              </motion.div>
              <motion.div className="flex items-center gap-3 group transition" variants={fadeItem}>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-700 transition-all duration-300 group-hover:bg-amber-200 group-hover:scale-110">
                  <Recycle className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <span className="font-bold text-gray-900 transition group-hover:text-amber-800">Sirkular</span>
              </motion.div>
              <motion.div className="flex items-center gap-3 group transition" variants={fadeItem}>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700 transition-all duration-300 group-hover:bg-green-200 group-hover:scale-110">
                  <BookOpen className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <span className="font-bold text-gray-900 transition group-hover:text-green-800">Edukasi</span>
              </motion.div>
            </motion.div>
            <motion.div
              className="space-y-4 text-[15px] leading-relaxed text-gray-600"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.7 }}
              transition={{ duration: 0.5, delay: 0.07 }}
            >
              <p>Dengan Torang Bersih, kami percaya bahwa ada elemen-elemen yang ingin kami sentuh dan itulah dasar keberhasilan untuk perubahan:</p>
              <ol className="list-decimal pl-5 space-y-1 font-medium text-gray-700">
                <li>Warga Masyarakat</li>
                <li>Pemerintah (Dinas Lingkungan Hidup)</li>
                <li>Komunitas & Bank Sampah</li>
                <li>Pengepul Barang Bekas</li>
              </ol>
              <p className="pt-2">Torang Bersih sangat terbuka untuk peluang kolaborasi dengan berbagai pihak demi mendukung upaya pelestarian alam dan lingkungan hidup di Indonesia.</p>
              <p>Kami percaya bahwa perjalanan panjang ke arah yang lebih baik selalu diawali dengan satu langkah, #TorangBisaTorangBersih.</p>
            </motion.div>
          </motion.div>
          
          <motion.div
            className="relative order-1 mx-auto w-full max-w-[460px] lg:order-2 lg:mx-0 lg:ml-auto group"
            initial={{ opacity: 0, x: 90 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.7 }}
            transition={{ duration: 0.7 }}
          >
            <div className="absolute -bottom-8 -right-8 left-14 top-14 rounded-tr-[110px] rounded-bl-[110px] bg-gray-100"></div>
            <motion.img
              src={Scan}
              alt="User Torang Bersih"
              className="relative z-10 w-full rounded-2xl object-cover shadow-lg transition duration-300 group-hover:scale-105 group-hover:shadow-green-200"
              style={{ aspectRatio: "4/5" }}
              initial={{ scale: 0.92, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.65 }}
              transition={{ duration: 0.7, type: "spring", stiffness: 100 }}
            />
          </motion.div>
        </motion.div>

        {/* Gap antar section */}
        <div className="h-8 sm:h-12"></div>

        {/* ─── SECTION 3: FAQ / ACCORDION ─── */}
        <section className="mx-auto w-full max-w-3xl px-4 sm:px-8 py-12 flex flex-col items-center bg-white rounded-2xl shadow border border-gray-200 my-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-5 text-[#1e1f78] tracking-tight text-center">Pertanyaan Umum</h2>
          <p className="mb-8 max-w-2xl text-center text-gray-600 text-base font-medium">
            Temukan jawaban atas pertanyaan yang sering diberikan tentang Torang Bersih.<br />
            Masih ada yang ingin ditanyakan? <a href="mailto:info@torangbersih.com" className="text-[#1e1f78] underline font-semibold">Hubungi kami!</a>
          </p>
          <div className="w-full max-w-xl mx-auto">
            {faqs.map((faq, index) => (
              <div key={index} className="mb-3 shadow-sm border border-gray-100 rounded-xl bg-[#f7f8fc] hover:border-blue-100 transition">
                <button
                  onClick={() => setOpenAccordion(openAccordion === index ? -1 : index)}
                  className="flex w-full items-center justify-between px-6 py-4 text-left font-semibold text-[#222364] focus:outline-none rounded-xl transition hover:bg-blue-50"
                >
                  <span>{faq.title}</span>
                  <ChevronDown className={`h-5 w-5 text-[#1e1f78] transition-transform duration-300${openAccordion === index ? " rotate-180" : ""}`} />
                </button>
                <AnimatePresence initial={false}>
                  {openAccordion === index && (
                    <motion.div
                      key="content"
                      initial="collapsed"
                      animate="open"
                      exit="collapsed"
                      variants={{ open: { height: "auto", opacity: 1 }, collapsed: { height: 0, opacity: 0 } }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-gray-100 px-6 pb-4 pt-2 text-sm text-gray-700 leading-relaxed">
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