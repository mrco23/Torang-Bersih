import React from "react";
import FloatingIcons from "./FloatingIcons";
import { Link } from "react-router-dom";
const FiturHero = ({ title, description, buttonText, buttonLink }) => {
  return (
    <div className="relative z-0 flex w-full items-center bg-(--gray-shine) px-4 pt-30 pb-0 md:h-115 md:px-6 md:pt-35 md:pb-10">
      <div className="z-10 mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-10 md:flex-row md:gap-0">
        <div className="w-full space-y-5 text-center md:text-left">
          <h1 className="text-3xl font-semibold md:text-4xl">{title}</h1>
          <p className="mx-auto max-w-xl md:mx-0">{description}</p>
          <Link
            to={buttonLink}
            className="mx-auto flex w-fit items-center justify-center rounded bg-(--primary) px-6 py-3 font-bold text-white hover:bg-(--primary-dark) md:mx-0"
          >
            {buttonText}
          </Link>
        </div>
        <div className="w-full">
          {/* Mobile: background decoration. Desktop: right-side visual */}
          <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center opacity-20 md:static md:inset-auto md:z-auto md:justify-end md:opacity-100">
            <div className="mx-auto max-w-sm md:mx-0 md:max-w-none">
              <FloatingIcons />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FiturHero;
