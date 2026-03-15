import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { LuChevronDown } from "react-icons/lu";
import { fiturItems } from "./navConstants";

function HeaderNav() {
  const location = useLocation();
  const [fiturOpen, setFiturOpen] = useState(false);
  const fiturRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (fiturRef.current && !fiturRef.current.contains(e.target)) {
        setFiturOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinkClass = (path) =>
    `text-[1rem] font-medium transition ${
      location.pathname === path
        ? "text-black font-semibold underline underline-offset-4 underline-emerald-600"
        : "text-gray-700 hover:text-black hover:underline hover:underline-offset-4 hover:underline-emerald-600 "
    }`;

  const isFiturActive = fiturItems.some(
    (item) => location.pathname === item.path,
  );

  return (
    <div className="hidden items-center gap-10 md:flex">
      <Link to="/" className={navLinkClass("/")}>
        Beranda
      </Link>
      <Link to="/peta" className={navLinkClass("/peta")}>
        Peta
      </Link>
      <Link to="/artikel" className={navLinkClass("/artikel")}>
        Artikel
      </Link>

      {/* Fitur dropdown */}
      <div className="relative" ref={fiturRef}>
        <button
          onClick={() => setFiturOpen(!fiturOpen)}
          className={`flex cursor-pointer items-center gap-1 text-[1rem] font-medium transition ${
            isFiturActive
              ? "underline-emerald-600 font-semibold text-black underline underline-offset-4"
              : "hover:underline-emerald-600 text-gray-700 hover:text-black hover:underline hover:underline-offset-4"
          }`}
        >
          Fitur
          <LuChevronDown
            className={`h-4 w-4 transition-transform duration-200 ${
              fiturOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {fiturOpen && (
          <div className="absolute top-full left-1/2 z-50 mt-2 w-48 -translate-x-1/2 animate-[fadeIn_0.15s_ease-out] rounded-xl border border-gray-100 bg-white py-2 shadow-lg">
            {fiturItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setFiturOpen(false)}
                className={`block px-4 py-2.5 text-[1rem] transition ${
                  location.pathname === item.path
                    ? "bg-gray-50 font-semibold text-black"
                    : "text-gray-700 hover:bg-gray-50 hover:text-black"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
      <Link to="/tentang-kami" className={navLinkClass("/tentang-kami")}>
        Tentang Kami
      </Link>
    </div>
  );
}

export default HeaderNav;
