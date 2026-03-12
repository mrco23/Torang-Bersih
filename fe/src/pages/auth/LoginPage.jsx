import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import { GoogleLoginButton } from "../../components/features/auth/GoogleButton";
import AuthLogo from "../../components/features/auth/AuthLogo";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" }); /* nothing */
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await login(form.email, form.password);
    if (result.success) {
      const redirectTo = result.user?.role === "admin" ? "/admin" : "/";
      navigate(redirectTo);
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex w-full items-center justify-center">
      <div className="w-full max-w-lg space-y-5 p-6">
        <div className="flex items-center justify-center">
          <AuthLogo />
        </div>
        <div className="space-y-2 text-center">
          <h1 className="text-center text-3xl font-bold text-black">
            Selamat Datang
          </h1>
          <p className="text-center text-gray-500">
            Masuk ke akun anda terlebih dahulu
          </p>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <label htmlFor="email" className="font-medium">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full rounded-lg border px-4 py-2.5 outline-[0.5px] outline-(--primary) focus:ring-1 focus:ring-(--primary) focus:outline-none"
            required
          />
          <label htmlFor="password" className="font-medium">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-lg border px-4 py-2.5 outline-[0.5px] outline-(--primary) focus:ring-1 focus:ring-(--primary) focus:outline-none"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
            </button>
          </div>
          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-sm font-medium text-(--primary) hover:underline"
            >
              Lupa Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer rounded-lg bg-(--primary) py-2.5 font-medium text-white transition hover:bg-(--primary-dark) disabled:opacity-50"
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <div className="flex items-center gap-3">
          <hr className="flex-1" />
          <span className="text-sm whitespace-nowrap text-gray-400">atau</span>
          <hr className="flex-1" />
        </div>
        <div className="flex w-full items-center justify-center">
          <GoogleLoginButton
            disabled={loading}
            onSuccess={({ user }) => {
              const redirectTo = user?.role === "admin" ? "/admin" : "/";
              navigate(redirectTo);
            }}
            onError={(err) => setError(err.message)}
          />
        </div>

        <p className="text-center text-sm text-gray-500">
          Belum punya akun?{" "}
          <Link to="/register" className="text-(--primary) hover:underline">
            Daftar
          </Link>
        </p>
      </div>
    </div>
  );
}
