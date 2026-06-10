import { useEffect, useState } from "react";
import api from "../api";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadCustomers = async () => {
    try {
      const response = await api.get("/customers");
      setCustomers(response.data.customers);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load customers");
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const toggleBlock = async (customerId, block) => {
    setError("");
    setSuccess("");
    try {
      await api.post(`/customers/${customerId}/${block ? "block" : "unblock"}`);
      setSuccess(`Customer ${block ? "blocked" : "unblocked"} successfully.`);
      loadCustomers();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update customer");
    }
  };

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6 shadow-xl shadow-slate-950/10">
        <h1 className="text-2xl font-semibold text-white">
          Customer management
        </h1>
        <p className="mt-2 text-slate-400">
          Review customer accounts, loyalty, and block entries quickly.
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

      <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6 shadow-xl shadow-slate-950/10">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-800 text-left text-sm text-slate-300">
            <thead>
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Spent</th>
                <th className="px-4 py-3">Membership</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {customers.map((customer) => (
                <tr
                  key={customer._id}
                  className="odd:bg-slate-900/80 even:bg-slate-950/90"
                >
                  <td className="px-4 py-3 text-white">{customer.name}</td>
                  <td className="px-4 py-3">{customer.phone}</td>
                  <td className="px-4 py-3">
                    {customer.totalSpent.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 capitalize">
                    {customer.membership || "bronze"}
                  </td>
                  <td className="px-4 py-3">
                    {customer.isBlocked ? "Blocked" : "Active"}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() =>
                        toggleBlock(customer._id, !customer.isBlocked)
                      }
                      className="rounded-2xl bg-sky-500 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
                    >
                      {customer.isBlocked ? "Unblock" : "Block"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
