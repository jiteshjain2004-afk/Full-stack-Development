import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login, loading, error, setError } = useAuth();
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    const ok = await login(form);
    if (ok) navigate("/dashboard");
  }

  return (
    <AuthCard title="Welcome back" subtitle="Login to access your dashboard">
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          type="email"
          required
          placeholder="Email"
          value={form.email}
          onChange={(e) => {
            setError("");
            setForm((prev) => ({ ...prev, email: e.target.value }));
          }}
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-slate-500 dark:border-slate-700 dark:bg-slate-950"
        />
        <input
          type="password"
          required
          placeholder="Password"
          value={form.password}
          onChange={(e) => {
            setError("");
            setForm((prev) => ({ ...prev, password: e.target.value }));
          }}
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-slate-500 dark:border-slate-700 dark:bg-slate-950"
        />
        {error ? <p className="text-sm text-red-500">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-slate-900 px-3 py-2.5 text-white disabled:opacity-70 dark:bg-slate-100 dark:text-slate-950"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
        No account?{" "}
        <Link className="font-semibold text-slate-900 dark:text-slate-200" to="/signup">
          Create one
        </Link>
      </p>
    </AuthCard>
  );
}
