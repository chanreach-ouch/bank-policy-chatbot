import { Bell, Search } from "lucide-react";

import { useAuth } from "../../context/AuthContext";

export default function AdminHeader({ title, subtitle }) {
  const { admin } = useAuth();
  return (
    <header className="bg-white border border-slate-200 rounded-3xl px-5 py-4 flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        {subtitle ? <p className="text-sm text-slate-500 mt-1">{subtitle}</p> : null}
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200">
          <Search className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-500">Search...</span>
        </div>
        <button className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
          <Bell className="w-4 h-4 text-slate-600" />
        </button>
        <div className="px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-100 text-sm">
          <p className="font-semibold text-emerald-700">{admin?.username || "admin"}</p>
        </div>
      </div>
    </header>
  );
}

