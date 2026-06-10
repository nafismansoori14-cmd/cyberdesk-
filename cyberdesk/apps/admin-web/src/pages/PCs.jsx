import { useEffect, useState } from "react";
import api from "../api";

const statusOptions = ["free", "active", "locked", "maintenance", "offline"];

export default function PCs() {
  const [pcs, setPcs] = useState([]);
  const [label, setLabel] = useState("");
  const [status, setStatus] = useState("free");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchPCs = async () => {
    try {
      const response = await api.get("/pcs");
      setPcs(response.data.pcs);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load PCs");
    }
  };

  useEffect(() => {
    fetchPCs();
  }, []);

  const handleCreate = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    try {
      await api.post("/pcs", { label, status });
      setLabel("");
      setStatus("free");
      setSuccess("PC added successfully.");
      fetchPCs();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to add PC");
    }
  };

  const updatePCStatus = async (pcId, nextStatus) => {
    setError("");
    setSuccess("");
    try {
      await api.post(`/pcs/${pcId}/status`, { status: nextStatus });
      setSuccess("PC status updated.");
      fetchPCs();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update PC status");
    }
  };

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6 shadow-xl shadow-slate-950/10">
        <h1 className="text-2xl font-semibold text-white">PC Management</h1>
        <p className="mt-2 text-slate-400">
          Add new workstations and manage current machine availability.
        </p>
      </div>

      {error && (
        <div className="rounded-3xl border border-rose-500/20 bg-rose-500/5 p-4 text-rose-200">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-emerald-200">
          {success}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <section className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6">
          <h2 className="text-lg font-semibold text-white">Add new PC</h2>
          <form onSubmit={handleCreate} className="mt-6 space-y-4">
            <label className="block text-sm text-slate-300">
              Label
              <input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                required
                className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-900/90 px-4 py-3 text-white outline-none"
              />
            </label>
            <label className="block text-sm text-slate-300">
              Initial status
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-900/90 px-4 py-3 text-white outline-none"
              >
                {statusOptions.map((option) => (
                  <option
                    key={option}
                    value={option}
                    className="bg-slate-950 text-white"
                  >
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <button className="w-full rounded-2xl bg-sky-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400">
              Add PC
            </button>
          </form>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6">
          <h2 className="text-lg font-semibold text-white">Workstations</h2>
          <div className="mt-6 space-y-4">
            {pcs.length ? (
              pcs.map((pc) => (
                <div
                  key={pc._id}
                  className="rounded-3xl border border-slate-800 bg-slate-900/80 p-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-base font-semibold text-white">
                        {pc.label}
                      </p>
                      <p className="mt-1 text-sm text-slate-400">
                        Status: {pc.status}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {statusOptions.map((option) => (
                        <button
                          type="button"
                          key={option}
                          onClick={() => updatePCStatus(pc._id, option)}
                          className="rounded-2xl border border-slate-700 bg-slate-800/90 px-3 py-2 text-sm text-slate-200 transition hover:border-slate-500"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No PCs configured yet.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
