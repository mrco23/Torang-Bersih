import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { LuMenu, LuX, LuChevronDown } from "react-icons/lu";
import { fiturItems } from "./navConstants";

function MobileMenu({
  isAuthenticated,
  user,
  onLogout,
  menuOpen,
  setMenuOpen,
}) {
  const [mobileFiturOpen, setMobileFiturOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setMenuOpen(false);
    await onLogout();
    navigate("/login");
  };

  return (
    <>
      {/* Hamburger button */}
      <div className="flex items-center gap-2 md:hidden">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="cursor-pointer p-1 text-gray-600 transition hover:font-bold hover:text-black"
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <LuX className="h-6 w-6" />
          ) : (
            <LuMenu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Dropdown menu */}
      {menuOpen && (
        <div className="absolute top-full right-0 left-0 z-40 space-y-1 border-b border-gray-200 bg-white px-4 pt-3 pb-3 shadow-sm md:hidden">
          {/* Navigation */}
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:font-semibold hover:text-black"
          >
            Beranda
          </Link>
          <Link
            to="/peta"
            onClick={() => setMenuOpen(false)}
            className="block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:font-semibold hover:text-black"
          >
            Peta
          </Link>
          <Link
            to="/artikel"
            onClick={() => setMenuOpen(false)}
            className="block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:font-semibold hover:text-black"
          >
            Artikel
          </Link>

          {/* Fitur accordion */}
          <div>
            <button
              onClick={() => setMobileFiturOpen(!mobileFiturOpen)}
              className="flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:font-semibold hover:text-black"
            >
              Fitur
              <LuChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  mobileFiturOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {mobileFiturOpen && (
              <div className="mt-1 ml-4 space-y-1 border-l-2 border-emerald-200 pl-3">
                {fiturItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-lg py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:font-semibold hover:text-black"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            to="/tentang-kami"
            onClick={() => setMenuOpen(false)}
            className="block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:font-semibold hover:text-black"
          >
            Tentang Kami
          </Link>

          {/* Auth section */}
          <div className="mt-2 border-t border-gray-200 pt-2">
            {isAuthenticated ? (
              <>
                <div className="px-3 py-2">
                  <p className="truncate text-sm font-semibold text-gray-800">
                    {user?.username || user?.full_name}
                  </p>
                  <p className="truncate text-xs text-gray-500">
                    {user?.email}
                  </p>
                </div>
                {user?.role === "admin" ? (
                  <Link
                    to="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-emerald-600"
                  >
                    Admin Panel
                  </Link>
                ) : (
                  <Link
                    to={`/${user?.username}`}
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-emerald-600"
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full cursor-pointer rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-500 transition hover:bg-red-50 hover:text-red-600"
                >
                  Keluar
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="mx-3 mt-1 block rounded-lg bg-gray-900 px-4 py-2.5 text-center text-sm font-medium text-white transition hover:bg-black"
              >
                Bergabung
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default MobileMenu;
