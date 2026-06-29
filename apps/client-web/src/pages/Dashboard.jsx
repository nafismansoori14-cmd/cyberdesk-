import { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../AuthContext";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState("");
  const [cafe, setCafe] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [profileResponse, sessionsResponse, cafeResponse] =
          await Promise.all([
            api.get("/auth/client/me"),
            api.get("/auth/client/me/sessions"),
            api.get("/cafe"),
          ]);
        setSessions(sessionsResponse.data.sessions);
        setCafe(cafeResponse.data.cafe);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load dashboard");
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-950/90 p-8 shadow-xl shadow-slate-950/10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-sky-400/80">
              Welcome
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-white">
              {user?.name}
            </h1>
            <p className="mt-2 text-slate-400">
              Your customer portal for {cafe?.name || "CyberDesk"}.
            </p>
          </div>
          <button
            onClick={logout}
            className="rounded-2xl bg-slate-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Sign out
          </button>
        </div>

        {error && (
          <div className="rounded-3xl border border-rose-500/20 bg-rose-500/5 p-4 text-rose-200">
            {error}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6 shadow-xl shadow-slate-950/10">
            <h2 className="text-xl font-semibold text-white">Profile</h2>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <p>
                <span className="font-semibold text-white">Name: </span>
                {user?.name}
              </p>
              <p>
                <span className="font-semibold text-white">Phone: </span>
                {user?.phone}
              </p>
              <p>
                <span className="font-semibold text-white">Email: </span>
                {user?.email || "Not provided"}
              </p>
              <p>
                <span className="font-semibold text-white">Membership: </span>
                {user?.membership || "bronze"}
              </p>
              <p>
                <span className="font-semibold text-white">
                  Loyalty points:{" "}
                </span>
                {user?.loyaltyPoints ?? 0}
              </p>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6 shadow-xl shadow-slate-950/10">
            <h2 className="text-xl font-semibold text-white">Quick access</h2>
            <div className="mt-4 space-y-4 text-sm text-slate-300">
              <div>
                <p className="font-semibold text-slate-100">Cafe</p>
                <p>{cafe?.name || "Loading..."}</p>
              </div>
              <div>
                <p className="font-semibold text-slate-100">Cafe ID</p>
                <p>{cafe?._id || "Unknown"}</p>
              </div>
              <div>
                <p className="font-semibold text-slate-100">QR token</p>
                <p className="break-all rounded-3xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-slate-200">
                  {user?.qrToken || "Not available"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-950/90 p-6 shadow-xl shadow-slate-950/10">
          <h2 className="text-xl font-semibold text-white">Recent sessions</h2>
          {sessions.length ? (
            <div className="mt-6 space-y-4">
              {sessions.map((session) => (
                <div
                  key={session._id}
                  className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="font-semibold text-white">
                      PC: {session.pcId}
                    </p>
                    <span className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-400">
                      {session.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-400">
                    Pricing: {session.pricingType} • Amount:{" "}
                    {session.amount?.toFixed(2) ?? "--"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-500">
              No recent sessions available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
