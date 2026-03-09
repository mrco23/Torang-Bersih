import React from "react";
import FiturCard from "./FiturCard";
// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react";

const Fitur = () => {
  const fitur = [
    {
      title: "Kolaborator",
      description:
        "Bergabunglah bersama komunitas, organisasi, dan instansi yang sudah bergerak menjaga lingkungan.",
      icon: "/icons/handshake.svg",
      link: "kolaborator",
    },
    {
      title: "Aset",
      description:
        "Temukan bank sampah, TPS, dan pengepul terdekat di sekitarmu",
      icon: "/icons/location.png",
      link: "/aset",
    },
    {
      title: "Laporan Sampah Ilegal",
      description:
        "Pantau dan laporkan titik pembuangan sampah ilegal di sekitarmu.",
      icon: "/icons/infographic.png",
      link: "laporan",
    },
    {
      title: "Barang Daur Ulang",
      description:
        "Punya barang bekas yang bisa didaur ulang? Tandai lokasimu dan biarkan orang lain mengambilnya",
      icon: "/icons/recycling-point.png",
      link: "barang-bekas",
    },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
      className="flex w-full justify-center px-4 pb-20 md:px-6 md:pb-50"
    >
      <div className="mx-auto flex w-full max-w-6xl">
        <div className="flex w-full flex-col items-center gap-4 text-center">
          <h2 className="text-3xl font-bold tracking-tighter">
            APA YANG BISA KAMU LAKUKAN DISINI ?
          </h2>
          <p className="max-w-3xl text-lg leading-6 font-medium text-gray-500">
            Dari memantau lokasi aset sampah, melaporkan titik ilegal, hingga
            bergabung bersama komunitas peduli lingkungan, semua bisa kamu
            lakukan dalam satu platform.
          </p>
          <div className="mt-10 flex w-full max-w-5xl flex-col items-center gap-4 md:mt-20 md:flex-row md:flex-wrap md:justify-center md:gap-3">
            {fitur.map((fitur) => (
              <FiturCard key={fitur.title} {...fitur} />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Fitur;
