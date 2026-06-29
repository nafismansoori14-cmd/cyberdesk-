import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [cafeId, setCafeId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(emailOrPhone, password, cafeId);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-4xl items-center justify-center px-6 py-12">
        <div className="w-full rounded-3xl border border-slate-800 bg-slate-900/95 p-10 shadow-xl shadow-slate-950/20">
          <h1 className="text-3xl font-semibold text-white">Customer login</h1>
          <p className="mt-2 text-slate-400">
            Sign in with your email, phone, or QR token to access your account.
          </p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <label className="block text-sm text-slate-300">
              Email or phone
              <input
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none"
                required
              />
            </label>
            <label className="block text-sm text-slate-300">
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none"
                required
              />
            </label>
            <label className="block text-sm text-slate-300">
              Cafe ID
              <input
                value={cafeId}
                onChange={(e) => setCafeId(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-white outline-none"
                required
              />
            </label>
            {error && <p className="text-sm text-rose-400">{error}</p>}
            <button
              type="submit"
              className="w-full rounded-2xl bg-sky-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
          <div className="mt-6 flex flex-col gap-3 text-sm text-slate-500">
            <Link to="/signup" className="text-sky-400 hover:text-sky-300">
              Create a customer account
            </Link>
            <Link to="/qr-login" className="text-sky-400 hover:text-sky-300">
              Login with QR token
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
