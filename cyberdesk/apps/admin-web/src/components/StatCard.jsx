export default function StatCard({ title, value, subtitle }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6 shadow-xl shadow-slate-950/10">
      <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
        {title}
      </p>
      <p className="mt-3 text-4xl font-semibold text-white">{value}</p>
      {subtitle && <p className="mt-2 text-sm text-slate-400">{subtitle}</p>}
    </div>
  );
}
