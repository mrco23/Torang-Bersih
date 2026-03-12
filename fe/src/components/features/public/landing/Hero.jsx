import React from "react";
import { Link } from "react-router";

const Hero = () => {
  return (
    <div className="relative flex min-h-screen w-full justify-center px-4 pt-24 md:px-6">
      <div className="relative z-10 mx-auto flex w-full max-w-6xl">
        <div className="absolute inset-0 z-0 hidden items-center justify-center">
          <img
            src="/images/landing-hero.png"
            alt="landing-hero"
            className="w-2xl blur-lg"
          />
        </div>
        <div className="z-10 flex w-full items-center justify-between gap-6">
          <div className="flex w-full flex-col gap-5">
            <h1 className="mb-0 text-4xl font-semibold sm:text-5xl">
              Laporkan. Pantau. Bergerak Bersama.
            </h1>
            <p className="max-w-lg text-lg font-light sm:text-2xl">
              Satu platform untuk menghubungkan warga, komunitas, dan pemerintah
              dalam menjaga lingkungan dari ancaman sampah.
            </p>
            <div className="align-start mt-2 flex">
              <Link
                to="kolaborator"
                className="rounded-lg bg-(--primary) px-10 py-2.5 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.03] hover:bg-(--primary-dark) hover:shadow-[0px_4px_20px_rgba(30,31,120,0.4)] sm:text-[1.4rem]"
              >
                Daftar Kolaborator
              </Link>
            </div>
            <div className="mt-5">
              <img
                src="/icons/swipe-down.svg"
                alt="swipe-down"
                className="w-12 animate-bounce"
              />
            </div>
          </div>
          <div className="hidden w-4/5 lg:block">
            <div className="mb-10">
              <img
                src="/images/landing-hero.png"
                alt="landing-hero"
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
