import { useState } from "react";
import HeaderLogo from "./HeaderLogo";
import HeaderNav from "./HeaderNav";
import HeaderAuth from "./HeaderAuth";
import MobileMenu from "./MobileMenu";
import { useLocation } from "react-router-dom";

function Header({ isAuthenticated, user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isLandingPage = location.pathname === "/";

  const [scrolled, setScrolled] = useState(false);
  const handleScroll = () => {
    setScrolled(window.scrollY > 50);
  };
  window.addEventListener("scroll", handleScroll);

  return (
    <nav
      className={`fixed top-0 right-0 left-0 z-[9999] flex h-24 w-full justify-center px-4 py-2 shadow-sm md:px-6 ${menuOpen || !isLandingPage ? "bg-white shadow-md" : scrolled ? "bg-transparent shadow-md backdrop-blur-sm" : "bg-transparent backdrop-blur-sm"}`}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
        <HeaderLogo />
        <HeaderNav />
        <HeaderAuth
          isAuthenticated={isAuthenticated}
          user={user}
          onLogout={onLogout}
        />
        <MobileMenu
          isAuthenticated={isAuthenticated}
          user={user}
          onLogout={onLogout}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
        />
      </div>
    </nav>
  );
}

export default Header;
