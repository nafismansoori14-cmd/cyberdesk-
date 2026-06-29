import { useEffect, useState } from "react";
import api from "../api";

export default function Settings() {
  const [cafe, setCafe] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    name: "",
    address: "",
    currency: "INR",
    timezone: "Asia/Kolkata",
    logoUrl: "",
    taxPercent: 18,
    soundAlerts: true,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get("/cafe");
        setCafe(response.data.cafe);
        setForm({
          name: response.data.cafe.name || "",
          address: response.data.cafe.address || "",
          currency: response.data.cafe.currency || "INR",
          timezone: response.data.cafe.timezone || "Asia/Kolkata",
          logoUrl: response.data.cafe.logoUrl || "",
          taxPercent: response.data.cafe.settings?.taxPercent ?? 18,
          soundAlerts: response.data.cafe.settings?.soundAlerts ?? true,
        });
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load cafe settings");
      }
    };
    load();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    try {
      const payload = {
        name: form.name,
        address: form.address,
        currency: form.currency,
        timezone: form.timezone,
        logoUrl: form.logoUrl,
        settings: {
          taxPercent: Number(form.taxPercent),
          soundAlerts: form.soundAlerts,
        },
      };
      await api.put("/cafe", payload);
      setSuccess("Cafe profile updated successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update cafe settings");
    }
  };

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6 shadow-xl shadow-slate-950/10">
        <h1 className="text-2xl font-semibold text-white">Cafe settings</h1>
        <p className="mt-2 text-slate-400">
          Update your cafe profile, timezone, currency, and tax settings.
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

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-2">
        <label className="block text-sm text-slate-300">
          Cafe name
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-900/90 px-4 py-3 text-white outline-none"
          />
        </label>
        <label className="block text-sm text-slate-300">
          Address
          <input
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-900/90 px-4 py-3 text-white outline-none"
          />
        </label>
        <label className="block text-sm text-slate-300">
          Currency
          <input
            value={form.currency}
            onChange={(e) => setForm({ ...form, currency: e.target.value })}
            className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-900/90 px-4 py-3 text-white outline-none"
          />
        </label>
        <label className="block text-sm text-slate-300">
          Timezone
          <input
            value={form.timezone}
            onChange={(e) => setForm({ ...form, timezone: e.target.value })}
            className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-900/90 px-4 py-3 text-white outline-none"
          />
        </label>
        <label className="block text-sm text-slate-300">
          Logo URL
          <input
            value={form.logoUrl}
            onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
            className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-900/90 px-4 py-3 text-white outline-none"
          />
        </label>
        <div className="grid gap-4">
          <label className="block text-sm text-slate-300">
            Tax percent
            <input
              type="number"
              value={form.taxPercent}
              onChange={(e) => setForm({ ...form, taxPercent: e.target.value })}
              className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-900/90 px-4 py-3 text-white outline-none"
            />
          </label>
          <label className="flex items-center gap-3 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={form.soundAlerts}
              onChange={(e) =>
                setForm({ ...form, soundAlerts: e.target.checked })
              }
              className="h-5 w-5 rounded border-slate-700 bg-slate-900 text-sky-500"
            />
            Enable sound alerts
          </label>
        </div>
        <div className="lg:col-span-2">
          <button className="rounded-2xl bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400">
            Save changes
          </button>
        </div>
      </form>
    </div>
  );
}
