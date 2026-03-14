import { Link, useLocation } from "react-router";
import {
  LuLayoutDashboard,
  LuUsers,
  LuUserCog,
  LuFileUser,
  LuX,
  LuNewspaper,
  LuBuilding2,
  LuArchive,
  LuFileText,
} from "react-icons/lu";

function Sidebar({ user, sidebarOpen, onClose, onLogout, onNavClick }) {
  const location = useLocation();

  const menuItems = [
    {
      label: "Dashboard",
      path: `/${user?.username}`,
      icon: LuLayoutDashboard,
    },
    {
      label: "Kolaborator",
      path: `/${user?.username}/kolaborator`,
      icon: LuFileUser,
    },
    { label: "Aset", path: `/${user?.username}/aset`, icon: LuBuilding2 },
    {
      label: "Barang Bekas",
      path: `/${user?.username}/barang-bekas`,
      icon: LuArchive,
    },
    { label: "Laporan", path: `/${user?.username}/laporan`, icon: LuFileText },
    {
      label: "Artikel",
      path: `/${user?.username}/artikel`,
      icon: LuNewspaper,
    },
    { label: "Profil", path: `/${user?.username}/profile`, icon: LuUserCog },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 transform flex-col bg-gray-900 text-white transition-transform duration-200 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Brand */}
      <div className="flex items-center justify-between border-b border-gray-800 px-6 pt-5 pb-2">
        <div className="w-full">
          <Link
            to="/"
            className="flex w-full shrink-0 items-center gap-2 rounded-2xl py-2"
            onClick={onNavClick}
          >
            <picture>
              <img
                src="/images/logo-fill.png"
                alt="logo"
                className="h-[45px] w-[45px]"
              />
            </picture>
            <p className="flex flex-col gap-0 text-[1.2rem] leading-none font-semibold text-white">
              <span>TORANG</span>
              <span>BERSIH</span>
            </p>
          </Link>
          {/* <p className="mt-3 text-sm text-gray-400">{user?.username}</p> */}
        </div>
        {/* Close button for mobile */}
        <button
          onClick={onClose}
          className="text-gray-400 transition hover:text-white lg:hidden"
          aria-label="Tutup sidebar"
        >
          <LuX className="h-5 w-5" />
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onNavClick}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                isActive
                  ? "bg-(--primary) font-medium text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User info + Logout */}
      <div className="border-t border-gray-800 px-4 py-4">
        <div className="mb-3 flex items-center gap-3">
          {user?.avatar_url ? (
            <img
              src={user.avatar_url}
              alt=""
              referrerPolicy="no-referrer"
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-(--primary) text-xs font-bold">
              {user?.username?.charAt(0).toUpperCase() || "?"}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{user?.username}</p>
            <p className="truncate text-xs text-gray-400">{user?.email}</p>
          </div>
        </div>
        <Link to="/">
          <button className="w-full cursor-pointer rounded-lg border-y border-gray-800 px-3 py-3 text-center text-sm text-gray-400 transition hover:bg-gray-800 hover:text-white">
            Kembali ke halaman publik
          </button>
        </Link>
        <button
          onClick={onLogout}
          className="w-full cursor-pointer rounded-lg px-3 py-2 text-center text-sm text-gray-400 transition hover:bg-red-600/80 hover:text-white"
        >
          Keluar
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
