import { Outlet, useLocation } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import Header from "./partials/header/Header";
import Footer from "./partials/Footer";

function PublicLayout() {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  const pagesWithoutFooter = ["/peta", "/profile"];

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-white transition-colors duration-200">
      <Header isAuthenticated={isAuthenticated} user={user} onLogout={logout} />

      {/* Content fill empty space*/}
      <main className="z-100 flex-1">
        <Outlet />
      </main>

      {pagesWithoutFooter.includes(location.pathname) ? null : <Footer />}
    </div>
  );
}

export default PublicLayout;
