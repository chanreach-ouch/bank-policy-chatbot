import { Lock, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [form, setForm] = useState({ username: "admin", password: "admin1234" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await api.adminLogin(form);
      login(response.access_token, response.admin);
      navigate(location.state?.from || "/admin");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50">
      <section className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-900 text-white p-10">
        <div>
          <p className="text-emerald-300 font-semibold">Bank Policy AI</p>
          <h1 className="text-4xl font-bold mt-4 leading-tight">Secure admin workspace for policy chatbot operations.</h1>
        </div>
        <div className="space-y-4 text-sm text-slate-200">
          <p className="rounded-2xl bg-white/10 border border-white/10 p-4">
            Manage policy files, indexing jobs, grounded responses, chat quality, and assistant behavior from one secure dashboard.
          </p>
          <p className="rounded-2xl bg-emerald-500/20 border border-emerald-300/20 p-4">
            Built for Khmer + English banking support and compliance-safe operations.
          </p>
        </div>
      </section>

      <section className="flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white shadow-soft-xl p-8">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-emerald-700" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mt-5">Admin Login</h2>
          <p className="text-sm text-slate-500 mt-2">Sign in to manage policy knowledge and chatbot settings.</p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <label className="space-y-2 block">
              <span className="text-sm text-slate-600">Username</span>
              <input
                value={form.username}
                onChange={(event) => setForm((prev) => ({ ...prev, username: event.target.value }))}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5"
                required
              />
            </label>
            <label className="space-y-2 block">
              <span className="text-sm text-slate-600">Password</span>
              <input
                type="password"
                value={form.password}
                onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                className="w-full rounded-xl border border-slate-200 px-3 py-2.5"
                required
              />
            </label>
            <div className="flex items-center justify-between text-sm">
              <label className="inline-flex items-center gap-2 text-slate-600">
                <input type="checkbox" />
                Remember me
              </label>
              <button type="button" className="text-emerald-700 font-semibold">
                Forgot password
              </button>
            </div>
            {error ? <p className="text-sm text-rose-600">{error}</p> : null}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold disabled:opacity-60"
            >
              <Lock className="w-4 h-4" />
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

