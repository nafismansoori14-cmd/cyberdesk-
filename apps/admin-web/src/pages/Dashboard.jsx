import { useEffect, useMemo, useState } from "react";
import api from "../api";
import StatCard from "../components/StatCard";

const statusLabel = {
  free: "Free",
  active: "Active",
  locked: "Locked",
  maintenance: "Maintenance",
  offline: "Offline",
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [activeSessions, setActiveSessions] = useState([]);
  const [pcs, setPcs] = useState([]);
  const [cafe, setCafe] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [pcsResponse, sessionsResponse, cafeResponse] = await Promise.all(
          [api.get("/pcs"), api.get("/sessions/active"), api.get("/cafe")],
        );
        setPcs(pcsResponse.data.pcs);
        setActiveSessions(sessionsResponse.data.sessions);
        setCafe(cafeResponse.data.cafe);
        setStats({
          totalPCs: pcsResponse.data.pcs.length,
          activeSessions: sessionsResponse.data.sessions.length,
          freePCs: pcsResponse.data.pcs.filter((pc) => pc.status === "free")
            .length,
          lockedPCs: pcsResponse.data.pcs.filter((pc) => pc.status === "locked")
            .length,
        });
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load dashboard");
      }
    };
    load();
  }, []);

  const latestActive = useMemo(
    () => activeSessions.slice(0, 5),
    [activeSessions],
  );

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-8 shadow-xl shadow-slate-950/10">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-sky-400/90">
              Dashboard
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-white">
              Welcome back{cafe ? ` to ${cafe.name}` : ""}
            </h1>
            <p className="mt-2 text-slate-400">
              Live cafe operations, sessions, and PC tracking in one view.
            </p>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 px-5 py-4 text-sm text-slate-300">
            <p>Timezone</p>
            <p className="mt-1 font-semibold text-slate-100">
              {cafe?.timezone || "Loading..."}
            </p>
          </div>
        </div>
      </div>

      {error ? (
        <div className="rounded-3xl border border-rose-500/20 bg-rose-500/5 p-5 text-rose-200">
          {error}
        </div>
      ) : null}

      <div className="grid gap-6 md:grid-cols-4">
        <StatCard title="Total PCs" value={stats?.totalPCs ?? "--"} />
        <StatCard
          title="Active sessions"
          value={stats?.activeSessions ?? "--"}
        />
        <StatCard title="Free PCs" value={stats?.freePCs ?? "--"} />
        <StatCard title="Locked PCs" value={stats?.lockedPCs ?? "--"} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6 shadow-xl shadow-slate-950/10">
          <h2 className="text-xl font-semibold text-white">Live PC status</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {pcs.map((pc) => (
              <div
                key={pc._id}
                className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4"
              >
                <p className="text-sm text-slate-400">{pc.label}</p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {statusLabel[pc.status] || pc.status}
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  {pc.specs?.cpu || "No specs"}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6 shadow-xl shadow-slate-950/10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">
              Active sessions
            </h2>
            <span className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-300">
              {activeSessions.length}
            </span>
          </div>
          <div className="mt-6 space-y-4">
            {latestActive.length ? (
              latestActive.map((session) => (
                <div
                  key={session._id}
                  className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-white">
                      {session.customerName}
                    </p>
                    <span className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-400">
                      {session.pricingType}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-400">
                    PC: {session.pcId}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">
                No active sessions at the moment.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
