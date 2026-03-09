import { useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router";
import { authAPI } from "../../services/api/routes/auth.route";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="w-full max-w-md space-y-4 rounded-xl bg-white p-8 text-center shadow-md">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <span className="text-3xl">❌</span>
          </div>
          <h2 className="text-xl font-bold text-gray-800">
            Token Tidak Ditemukan
          </h2>
          <p className="text-gray-600">Link reset password tidak valid.</p>
          <Link
            to="/forgot-password"
            className="mt-2 inline-block rounded-lg bg-(--primary) px-6 py-2.5 font-medium text-white transition hover:bg-(--primary-dark)"
          >
            Minta Link Baru
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirmPassword) {
      setError("Password tidak sama.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password minimal 8 karakter.");
      return;
    }

    setLoading(true);
    try {
      await authAPI.resetPassword({ token, password: form.password });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Gagal reset password. Token mungkin sudah kedaluwarsa.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="w-full max-w-md space-y-4 rounded-xl bg-white p-8 text-center shadow-md">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <span className="text-3xl">✅</span>
          </div>
          <h2 className="text-xl font-bold text-gray-800">
            Password Berhasil Direset!
          </h2>
          <p className="text-gray-600">
            Kamu akan dialihkan ke halaman login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-5 rounded-xl bg-white p-8 shadow-md">
        <h1 className="text-center text-2xl font-bold text-gray-800">
          Reset Password
        </h1>
        <p className="text-center text-sm text-gray-500">
          Masukkan password baru kamu.
        </p>

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Password Baru (min. 8 karakter)"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full rounded-lg border px-4 py-2.5 focus:ring-1 focus:ring-(--primary) focus:outline-none"
            required
          />
          <input
            type="password"
            placeholder="Konfirmasi Password Baru"
            value={form.confirmPassword}
            onChange={(e) =>
              setForm({ ...form, confirmPassword: e.target.value })
            }
            className="w-full rounded-lg border px-4 py-2.5 focus:ring-1 focus:ring-(--primary) focus:outline-none"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-(--primary) py-2.5 font-medium text-white transition hover:bg-(--primary-dark) disabled:opacity-50"
          >
            {loading ? "Memproses..." : "Reset Password"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          <Link
            to="/login"
            className="font-medium text-(--primary) hover:underline"
          >
            ← Kembali ke Halaman Masuk
          </Link>
        </p>
      </div>
    </div>
  );
}
