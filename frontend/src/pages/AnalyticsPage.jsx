import { useEffect, useState } from "react";

import { api } from "../api/client";
import AdminHeader from "../components/admin/AdminHeader";
import StatCard from "../components/admin/StatCard";
import { useAuth } from "../context/AuthContext";

function TrendPlaceholder({ title }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5">
      <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
      <div className="mt-4 h-40 rounded-2xl bg-gradient-to-r from-emerald-100 via-emerald-50 to-slate-100 border border-slate-200" />
    </div>
  );
}

export default function AnalyticsPage() {
  const { token } = useAuth();
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    async function load() {
      if (!token) return;
      const response = await api.getAnalytics(token);
      setAnalytics(response);
    }
    load();
  }, [token]);

  return (
    <div className="space-y-5">
      <AdminHeader title="Analytics" subtitle="Track usage trends, fallback rates, and policy coverage quality." />

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Total Chats Today" value={analytics?.chats_today ?? "-"} />
        <StatCard label="Fallback Rate" value={analytics ? `${analytics.fallback_rate}%` : "-"} />
        <StatCard
          label="Khmer vs English"
          value={
            analytics
              ? `${analytics.language_usage.khmer}/${analytics.language_usage.english}`
              : "-"
          }
        />
        <StatCard label="Most Referenced Docs" value={analytics?.most_referenced_documents?.length ?? "-"} />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <TrendPlaceholder title="Total Chats Over Time" />
        <TrendPlaceholder title="Fallback Rate Trend" />
        <div className="rounded-3xl border border-slate-200 bg-white p-5">
          <h3 className="text-sm font-semibold text-slate-700">Top Asked Topics</h3>
          <div className="mt-3 space-y-2">
            {(analytics?.top_questions || []).map((item) => (
              <div key={item.question} className="rounded-2xl bg-slate-50 border border-slate-200 p-3 text-sm">
                <p className="font-medium text-slate-800">{item.question}</p>
                <p className="text-xs text-slate-500 mt-1">{item.count} times</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5">
          <h3 className="text-sm font-semibold text-slate-700">Most Referenced Policies</h3>
          <div className="mt-3 space-y-2">
            {(analytics?.most_referenced_documents || []).map((item) => (
              <div key={item.document_title} className="rounded-2xl bg-slate-50 border border-slate-200 p-3 text-sm">
                <p className="font-medium text-slate-800">{item.document_title}</p>
                <p className="text-xs text-slate-500 mt-1">{item.count} references</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

