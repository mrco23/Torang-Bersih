import React from "react";
import { Link } from "react-router-dom";
import { FaComment } from "react-icons/fa";
import { AiTwotoneLike } from "react-icons/ai";

const ArticleCard = ({ article }) => {
  return (
    <article className="group flex flex-col-reverse gap-6 border-b border-gray-100 py-8 sm:flex-row">
      {/* Bagian Teks */}
      <div className="flex flex-1 flex-col justify-center">
        {/* Author Info */}
        <div className="mb-3 flex items-center gap-2">
          <img
            src={article.authorImage}
            alt={article.author}
            className="h-6 w-6 rounded-full"
          />
          <span className="text-sm font-medium text-gray-700">
            {article.author}
          </span>
          <span className="ml-2 hidden rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600 sm:inline-block">
            {article.category}
          </span>
        </div>

        {/* --- JUDUL YANG BISA DIKLIK --- */}
        <Link to={`/artikel/${article.id}`}>
          <h2 className="mb-2 text-xl leading-tight font-bold text-gray-900 transition-colors group-hover:text-blue-600 sm:text-2xl">
            {article.title}
          </h2>
        </Link>

        <p
          className="mb-4 line-clamp-2 text-sm leading-relaxed text-gray-500 sm:text-base"
          dangerouslySetInnerHTML={{ __html: article.excerpt }}
        />

        {/* Meta: Date, Like & Comment */}
        <div className="mt-auto flex items-center gap-6 text-sm text-gray-500">
          <span>{article.date}</span>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 transition-colors">
              <AiTwotoneLike /> <span>{article.likes}</span>
            </div>
            <div className="flex items-center gap-1.5 transition-colors">
              <FaComment /> <span>{article.comments}</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- GAMBAR YANG BISA DIKLIK --- */}
      <Link
        to={`/artikel/${article.id}`}
        className="flex w-full shrink-0 items-center overflow-hidden rounded-md bg-gray-100 sm:w-32 md:w-48"
      >
        <img
          src={article.image}
          alt={article.title}
          className="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-32 md:h-full"
        />
      </Link>
    </article>
  );
};

export default ArticleCard;
