import React from "react";
import FloatingIcons from "./FloatingIcons";
import { Link } from "react-router-dom";
const FiturHero = ({ title, description, buttonText, buttonLink }) => {
  return (
    <div className="relative z-0 flex h-115 w-full items-center bg-(--gray-shine) px-4 pt-24 md:px-6">
      <div className="z-10 mx-auto flex w-full max-w-7xl items-center justify-between">
        <div className="w-full space-y-5">
          <h1 className="text-4xl font-semibold">{title}</h1>
          <p>{description}</p>
          <Link
            to={buttonLink}
            className="flex w-fit items-center justify-center rounded bg-(--primary) px-6 py-3 font-bold text-white hover:bg-(--primary-dark)"
          >
            {buttonText}
          </Link>
        </div>
        <div className="w-full">
          <div className="top-0 right-0 z-0">
            <FloatingIcons />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FiturHero;
