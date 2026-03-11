import { useEffect, useState } from "react";

import { api } from "../api/client";
import AdminHeader from "../components/admin/AdminHeader";
import StatCard from "../components/admin/StatCard";
import { useAuth } from "../context/AuthContext";

export default function AdminDashboard() {
  const { token } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!token) return;
      setLoading(true);
      try {
        const [analyticsData, docsData, chatsData] = await Promise.all([
          api.getAnalytics(token),
          api.listDocuments(token),
          api.listChats(token, { limit: 6 }),
        ]);
        if (!mounted) return;
        setAnalytics(analyticsData);
        setDocuments(docsData.slice(0, 5));
        setChats(chatsData.slice(0, 5));
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [token]);

  const stats = [
    { label: "Documents", value: analytics?.total_documents ?? "-" },
    { label: "Active Policies", value: analytics?.active_policies ?? "-" },
    { label: "Chats Today", value: analytics?.chats_today ?? "-" },
    { label: "Fallback Rate", value: analytics ? `${analytics.fallback_rate}%` : "-" },
    { label: "Indexed Chunks", value: analytics?.indexed_chunks ?? "-" },
    { label: "Khmer Queries", value: analytics?.language_usage?.khmer ?? "-" },
  ];

  return (
    <div className="space-y-5">
      <AdminHeader
        title="Dashboard Overview"
        subtitle="Monitor policy indexing, chat quality, and assistant safety at a glance."
      />

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {stats.map((item) => (
          <StatCard key={item.label} label={item.label} value={item.value} />
        ))}
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <div className="rounded-3xl border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-semibold text-slate-900">Recent Uploads</h3>
          {loading ? (
            <p className="text-sm text-slate-500 mt-3">Loading...</p>
          ) : (
            <div className="mt-4 space-y-3">
              {documents.map((doc) => (
                <div key={doc.id} className="rounded-2xl border border-slate-200 p-4">
                  <p className="font-semibold text-slate-900">{doc.title}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {doc.file_type.toUpperCase()} • {doc.category || "General"} • {doc.indexing_status}
                  </p>
                </div>
              ))}
              {!documents.length ? <p className="text-sm text-slate-500">No documents yet.</p> : null}
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-semibold text-slate-900">Recent Chat Activity</h3>
          {loading ? (
            <p className="text-sm text-slate-500 mt-3">Loading...</p>
          ) : (
            <div className="mt-4 space-y-3">
              {chats.map((chat) => (
                <div key={chat.id} className="rounded-2xl border border-slate-200 p-4">
                  <p className="font-semibold text-slate-900">Session {chat.session_token.slice(0, 10)}...</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {chat.messages.length} messages • Language: {chat.user_language.toUpperCase()}
                  </p>
                </div>
              ))}
              {!chats.length ? <p className="text-sm text-slate-500">No chats yet.</p> : null}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

