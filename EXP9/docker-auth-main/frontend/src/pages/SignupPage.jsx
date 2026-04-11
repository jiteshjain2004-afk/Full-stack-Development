import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthCard from "../components/AuthCard";
import { useAuth } from "../context/AuthContext";

export default function SignupPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const { signup, loading, error, setError } = useAuth();
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    const ok = await signup(form);
    if (ok) navigate("/dashboard");
  }

  return (
    <AuthCard title="Create account" subtitle="Secure signup with JWT authentication">
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          type="text"
          required
          placeholder="Full name"
          value={form.name}
          onChange={(e) => {
            setError("");
            setForm((prev) => ({ ...prev, name: e.target.value }));
          }}
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-slate-500 dark:border-slate-700 dark:bg-slate-950"
        />
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
          minLength={6}
          placeholder="Password (min 6 chars)"
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
          {loading ? "Creating account..." : "Sign Up"}
        </button>
      </form>
      <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
        Already have an account?{" "}
        <Link className="font-semibold text-slate-900 dark:text-slate-200" to="/login">
          Login
        </Link>
      </p>
    </AuthCard>
  );
}
