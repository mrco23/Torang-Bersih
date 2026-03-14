import React from "react";
import { LuArrowRight } from "react-icons/lu";
import { Link } from "react-router-dom";

const ArtikelHeadline = ({
  id,
  image,
  author,
  authorAvatar,
  title,
  description,
}) => {
  return (
    <div className="flex w-full flex-col gap-4">
      {/* Gambar Utama */}
      <div className="overflow-hidden rounded-2xl shadow-[0px_2px_15px_2px_rgba(0,0,0,0.1)]">
        <img
          src={image}
          alt={title}
          className="h-[250px] w-full object-cover transition-transform duration-500 hover:scale-105 md:h-[420px]"
        />
      </div>

      {/* Info Penulis */}
      <div className="flex items-center gap-2">
        <img
          src={authorAvatar}
          alt={author}
          className="h-8 w-8 rounded-full object-cover"
        />
        <span className="text-sm font-semibold text-(--dark-text)">
          {author}
        </span>
      </div>

      {/* Judul */}
      <h3 className="text-2xl leading-8 font-bold tracking-tight text-(--dark) sm:text-3xl">
        {title}
      </h3>

      {/* Deskripsi */}
      <p
        className="leading-6 text-(--gray)"
        dangerouslySetInnerHTML={{ __html: description }}
      />

      {/* Link Selengkapnya */}
      <Link
        to={`/artikel/${id}`}
        className="flex items-center gap-1 text-sm font-semibold text-(--accent) transition-all duration-300 hover:gap-2"
      >
        Selengkapnya
        <LuArrowRight className="text-base" />
      </Link>
    </div>
  );
};

export default ArtikelHeadline;
