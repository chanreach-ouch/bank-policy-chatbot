import { BarChart3, FileText, LayoutDashboard, MessageSquareText, Settings, ShieldCheck } from "lucide-react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard },
  { to: "/admin/documents", label: "Documents", icon: FileText },
  { to: "/admin/chats", label: "Chat Logs", icon: MessageSquareText },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/settings", label: "Settings", icon: Settings },
  { to: "/admin/users", label: "Admin Users", icon: ShieldCheck },
];

export default function Sidebar() {
  return (
    <aside className="w-full md:w-72 bg-slate-900 text-white rounded-3xl p-5 md:sticky md:top-6 h-fit">
      <div className="mb-6">
        <p className="text-emerald-300 text-sm font-semibold">Bank Policy Assistant</p>
        <h2 className="text-xl font-bold mt-1">Admin Console</h2>
      </div>
      <nav className="space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/admin"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition ${
                  isActive ? "bg-emerald-600 text-white" : "bg-slate-800 text-slate-100 hover:bg-slate-700"
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

