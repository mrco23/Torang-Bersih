import { useState } from "react";
import { Link } from "react-router";
import { authAPI } from "../../services/api/routes/auth.route";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await authAPI.forgotPassword({ email });
      setSuccess(
        res.data?.message || "Link reset password telah dikirim ke email kamu.",
      );
    } catch (err) {
      setError(
        err.response?.data?.message || "Gagal mengirim link reset password.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-5 rounded-xl bg-white p-8 shadow-md">
        <h1 className="text-center text-2xl font-bold text-gray-800">
          Lupa Password
        </h1>
        <p className="text-center text-sm text-gray-500">
          Masukkan email kamu dan kami akan mengirimkan link untuk reset
          password.
        </p>

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
            {success}
          </div>
        )}

        {!success ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border px-4 py-2.5 focus:ring-1 focus:ring-(--primary) focus:outline-none"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-(--primary) py-2.5 font-medium text-white transition hover:bg-(--primary-dark) disabled:opacity-50"
            >
              {loading ? "Mengirim..." : "Kirim Link Reset"}
            </button>
          </form>
        ) : (
          <p className="text-center text-sm text-gray-500">
            Cek inbox atau folder spam di email kamu.
          </p>
        )}

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
