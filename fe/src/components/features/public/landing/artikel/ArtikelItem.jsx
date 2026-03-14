import React from "react";
import { LuArrowRight } from "react-icons/lu";
import { AiOutlineEye } from "react-icons/ai";
import { BiLike } from "react-icons/bi";
import { LuMessageSquare } from "react-icons/lu";
import { Link } from "react-router-dom";

const ArtikelItem = ({ id, image, title, views, likes, comments }) => {
  return (
    <div className="flex flex-col gap-4 rounded-xl bg-white sm:flex-row">
      {/* Thumbnail */}
      <div className="h-[150px] w-full shrink-0 overflow-hidden rounded-lg shadow-[0px_2px_15px_2px_rgba(0,0,0,0.2)] sm:h-[140px] sm:w-[200px]">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-all duration-300 hover:scale-105"
        />
      </div>

      {/* Konten */}
      <div className="flex flex-1 flex-col justify-between gap-2 py-0.5">
        {/* Judul */}
        <h4 className="text-md leading-5 font-semibold tracking-tight text-(--dark)">
          {title}
        </h4>

        {/* Statistik */}
        <div className="flex items-center gap-4 text-xs text-(--gray-light)">
          <span className="flex items-center gap-1">
            <AiOutlineEye className="text-sm" />
            {views}
          </span>
          <span className="flex items-center gap-1">
            <BiLike className="text-sm" />
            {likes}
          </span>
          <span className="flex items-center gap-1">
            <LuMessageSquare className="text-sm" />
            {comments}
          </span>
        </div>

        {/* Link Selengkapnya */}
        <Link
          to={`/artikel/${id}`}
          className="flex flex-1 items-end gap-1 text-xs font-semibold text-(--accent) transition-all duration-300 hover:gap-2"
        >
          Selengkapnya
          <LuArrowRight className="text-xs" />
        </Link>
      </div>
    </div>
  );
};

export default ArtikelItem;
