import { Outlet, useNavigate } from "react-router-dom";

import Sidebar from "../components/admin/Sidebar";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function AdminLayout() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      if (token) {
        await api.adminLogout(token);
      }
    } finally {
      logout();
      navigate("/admin/login");
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-[280px_1fr] gap-5">
        <div className="space-y-3">
          <Sidebar />
          <button
            type="button"
            onClick={handleLogout}
            className="w-full rounded-2xl bg-white border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700"
          >
            Logout
          </button>
        </div>
        <main className="space-y-5">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

