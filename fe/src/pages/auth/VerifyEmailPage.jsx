import { useEffect, useRef, useState } from "react";
import { useSearchParams, Link } from "react-router";
import api from "../../services/api/axios";
import { authAPI } from "../../services/api/routes/auth.route";

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState(() => (token ? "loading" : "error"));
  const [message, setMessage] = useState(() =>
    token ? "" : "Token verifikasi tidak ditemukan.",
  );
  const calledRef = useRef(false);

  // Resend state
  const [resendEmail, setResendEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMsg, setResendMsg] = useState(null);

  useEffect(() => {
    if (!token || calledRef.current) return;
    calledRef.current = true;

    api
      .get(`/auth/verify/${token}`)
      .then((res) => {
        setStatus("success");
        setMessage(res.data?.message || "Email berhasil diverifikasi!");
      })
      .catch((err) => {
        setStatus("error");
        setMessage(
          err.response?.data?.message ||
            "Verifikasi gagal. Token mungkin sudah kedaluwarsa.",
        );
      });
  }, [token]);

  const handleResend = async (e) => {
    e.preventDefault();
    if (!resendEmail) return;
    setResendLoading(true);
    setResendMsg(null);

    try {
      const res = await authAPI.resendVerification({ email: resendEmail });
      setResendMsg({
        type: "success",
        text: res.data?.message || "Email verifikasi telah dikirim ulang!",
      });
    } catch (err) {
      setResendMsg({
        type: "error",
        text: err.response?.data?.message || "Gagal mengirim ulang.",
      });
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-4 rounded-xl bg-white p-8 text-center shadow-md">
        {status === "loading" && (
          <>
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-(--primary) border-t-transparent" />
            <p className="text-gray-500">Memverifikasi email...</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <span className="text-3xl">✅</span>
            </div>
            <h2 className="text-xl font-bold text-gray-800">Berhasil!</h2>
            <p className="text-gray-600">{message}</p>
            <Link
              to="/login"
              className="mt-2 inline-block rounded-lg bg-(--primary) px-6 py-2.5 font-medium text-white transition hover:bg-(--primary-dark)"
            >
              Masuk Sekarang
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <span className="text-3xl">❌</span>
            </div>
            <h2 className="text-xl font-bold text-gray-800">Gagal</h2>
            <p className="text-gray-600">{message}</p>

            {/* Resend verification form */}
            <div className="mt-4 space-y-3 border-t border-gray-100 pt-4 text-left">
              <p className="text-center text-sm text-gray-500">
                Token kedaluwarsa? Kirim ulang email verifikasi:
              </p>
              <form onSubmit={handleResend} className="flex gap-2">
                <input
                  type="email"
                  placeholder="Email kamu"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  className="flex-1 rounded-lg border px-3 py-2 text-sm focus:ring-1 focus:ring-(--primary) focus:outline-none"
                  required
                />
                <button
                  type="submit"
                  disabled={resendLoading}
                  className="rounded-lg bg-(--primary) px-4 py-2 text-sm text-white transition hover:bg-(--primary-dark) disabled:opacity-50"
                >
                  {resendLoading ? "..." : "Kirim"}
                </button>
              </form>
              {resendMsg && (
                <p
                  className={`text-center text-sm ${resendMsg.type === "success" ? "text-green-600" : "text-red-600"}`}
                >
                  {resendMsg.text}
                </p>
              )}
            </div>

            <Link
              to="/login"
              className="mt-2 inline-block rounded-lg bg-gray-200 px-6 py-2.5 font-medium text-gray-700 transition hover:bg-gray-300"
            >
              Kembali ke Halaman Masuk
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
