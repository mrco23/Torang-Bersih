import { Routes, Route } from "react-router";
import {
  ProtectedRoute,
  AdminRoute,
  GuestRoute,
  UserRoute,
} from "./components/common/ProtectedRoute";

/* layouts */
import PublicLayout from "./components/layouts/PublicLayout";
import AdminLayout from "./components/layouts/AdminLayout";
import AuthLayout from "./components/layouts/AuthLayout";
import UserLayout from "./components/layouts/UserLayout";

/* auth pages */
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage";
import NotFoundPage from "./pages/NotFoundPage";

/* public pages */
import LandingPage from "./pages/public/LandingPage";
import PetaPage from "./pages/public/PetaPage";
import KolaboratorPage from "./pages/public/KolaboratorPage";
import DetailKolaboratorPage from "./pages/public/DetailKolaboratorPage";
import RegisterKolaboratorPage from "./pages/public/RegisterKolaboratorPage";
import AsetPage from "./pages/public/AsetPage";
import RegisterAsetPage from "./pages/public/RegisterAsetPage";
import DetailAsetPage from "./pages/public/DetailAsetPage";
import BarangBekasPage from "./pages/public/BarangBekasPage";
import BarangBekasDetailPage from "./components/features/public/barangbekas/BarangBekasDetailPages";
import JualBarangBekasPage from "./pages/public/JualBarangBekasPage";
import LaporanPage from "./pages/public/LaporanPage";
import BuatLaporanPageUser from "./pages/public/BuatLaporanPage";
import DetailLaporan from "./pages/public/DetailLaporan";
import ArtikelPage from "./pages/public/ArtikelPage";
import ArticleDetailPage from "./components/features/public/artikel/DetailArticle";

/* user pages */
import UserDashboardPage from "./pages/user/UserDashboardPage";
import UserKolaboratorPage from "./pages/user/UserKolaboratorPage";
import UserAsetPage from "./pages/user/UserAsetPage";
import UserBarangBekasPage from "./pages/user/UserBarangBekasPage";
import UserLaporanPage from "./pages/user/UserLaporanPage";
import UserArtikelPage from "./pages/user/UserArtikelPage";
import UserProfilePage from "./pages/user/UserProfilePage";

/* admin pages */
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminKolaboratorPage from "./pages/admin/AdminKolaboratorPage";
import AdminAsetPage from "./pages/admin/AdminAsetPage";
import AdminBarangBekasPage from "./pages/admin/AdminBarangBekasPage";
import AdminLaporanPage from "./pages/admin/AdminLaporanPage";
import AdminArtikelPage from "./pages/admin/AdminArtikelPage";
import AdminUsersManagementPage from "./pages/admin/AdminUserManagementPage";
import AdminProfilePage from "./pages/admin/AdminProfilePage";
import BuatLaporanPage from "./pages/public/BuatLaporanPage";

function App() {
  return (
    <Routes>
      {/* Standalone pages (no layout) */}
      <Route element={<GuestRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        {/* Untuk halaman publik yang perlu login user */}
        <Route
          path="/kolaborator/daftar"
          element={<RegisterKolaboratorPage />}
        />
        <Route path="/laporan/buat" element={<BuatLaporanPageUser />} />
        <Route path="/aset/daftar" element={<RegisterAsetPage />} />
        <Route path="/barang-bekas/jual" element={<JualBarangBekasPage />} />
      </Route>

      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />

      {/* Public + User */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="peta" element={<PetaPage />} />
        <Route path="kolaborator" element={<KolaboratorPage />} />
        <Route path="kolaborator/:id" element={<DetailKolaboratorPage />} />

        <Route path="aset" element={<AsetPage />} />
        <Route path="aset/:id" element={<DetailAsetPage />} />
        <Route path="barang-bekas" element={<BarangBekasPage />} />
        <Route path="/barang-bekas/:id" element={<BarangBekasDetailPage />} />
        <Route path="laporan" element={<LaporanPage />} />
        <Route path="/laporan/:id" element={<DetailLaporan />} />
        <Route path="artikel" element={<ArtikelPage />} />
        <Route path="/artikel/:id" element={<ArticleDetailPage />} />

        <Route element={<ProtectedRoute />}>
          {/* Untuk halaman publik yang perlu login user */}
        </Route>
      </Route>

      {/* User (UserSidebar and UserHeader) diakses menggunakan slug user */}
      <Route element={<UserRoute />}>
        <Route path="/:user" element={<UserLayout />}>
          <Route index element={<UserDashboardPage />} />
          <Route path="kolaborator" element={<UserKolaboratorPage />} />
          <Route path="aset" element={<UserAsetPage />} />
          <Route path="barang-bekas" element={<UserBarangBekasPage />} />
          <Route path="laporan" element={<UserLaporanPage />} />
          <Route path="artikel" element={<UserArtikelPage />} />
          <Route path="profile" element={<UserProfilePage />} />
        </Route>
      </Route>

      {/* Admin (sidebar layout) */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="kolaborator" element={<AdminKolaboratorPage />} />
          <Route path="aset" element={<AdminAsetPage />} />
          <Route path="barang-bekas" element={<AdminBarangBekasPage />} />
          <Route path="laporan" element={<AdminLaporanPage />} />
          <Route path="artikel" element={<AdminArtikelPage />} />
          <Route path="profile" element={<AdminProfilePage />} />
          <Route path="users" element={<AdminUsersManagementPage />} />
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
