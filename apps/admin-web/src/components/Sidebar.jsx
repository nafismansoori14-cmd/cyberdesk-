import { NavLink } from "react-router-dom";
import { useAuth } from "../AuthContext";

const navItems = [
  { path: "/dashboard", label: "Dashboard" },
  { path: "/pcs", label: "PC Management" },
  { path: "/customers", label: "Customers" },
  { path: "/settings", label: "Cafe Settings" },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="w-full max-w-xs rounded-3xl border border-slate-800 bg-slate-950/90 p-6 shadow-2xl shadow-slate-950/30">
      <div className="mb-8">
        <p className="text-sm uppercase text-sky-400/80">CyberDesk Admin</p>
        <h2 className="mt-2 text-2xl font-semibold text-white">{user?.name}</h2>
        <p className="mt-1 text-sm text-slate-400">{user?.role}</p>
      </div>
      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `block rounded-2xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-slate-800 text-white"
                  : "text-slate-300 hover:bg-slate-900/90"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <button
        onClick={logout}
        className="mt-8 w-full rounded-2xl bg-slate-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-600"
      >
        Log out
      </button>
    </aside>
  );
}
