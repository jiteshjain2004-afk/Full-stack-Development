import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";

export default function DashboardPage() {
  const { user, token } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [health, setHealth] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;

    async function loadData() {
      try {
        const [dashboardRes, healthRes] = await Promise.all([
          api.get("/dashboard", {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }),
          api.get("/health")
        ]);
        setDashboard(dashboardRes.data);
        setHealth(healthRes.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load dashboard data.");
      }
    }
    loadData();
  }, [token]);

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm text-slate-500 dark:text-slate-400">Welcome</p>
        <h1 className="text-2xl font-bold">{user?.name}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email}</p>
      </div>

      {error ? <p className="rounded-lg bg-red-100 p-3 text-sm text-red-700 dark:bg-red-950/40">{error}</p> : null}

      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">API Health</h2>
          <p className="mt-2 text-2xl font-bold">{health?.status || "..."}</p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{health?.timestamp || "-"}</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Uptime</h2>
          <p className="mt-2 text-2xl font-bold">
            {dashboard?.uptimeSeconds ? `${Math.round(dashboard.uptimeSeconds)}s` : "..."}
          </p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{dashboard?.appName || "-"}</p>
        </article>
      </div>
    </section>
  );
}
