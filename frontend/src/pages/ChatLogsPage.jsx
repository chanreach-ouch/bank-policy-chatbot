import { useEffect, useMemo, useState } from "react";

import { api } from "../api/client";
import AdminHeader from "../components/admin/AdminHeader";
import ChatLogTable from "../components/admin/ChatLogTable";
import { useAuth } from "../context/AuthContext";

export default function ChatLogsPage() {
  const { token } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [filters, setFilters] = useState({ search: "", language: "" });

  async function loadChats() {
    if (!token) return;
    const rows = await api.listChats(token, {
      search: filters.search,
      language: filters.language || undefined,
      limit: 100,
    });
    setSessions(rows);
    setSelectedSession((prev) => prev && rows.find((item) => item.id === prev.id));
  }

  useEffect(() => {
    loadChats();
  }, [token]);

  const fallbackCount = useMemo(() => {
    if (!selectedSession) return 0;
    return selectedSession.messages.filter((item) => item.is_fallback).length;
  }, [selectedSession]);

  return (
    <div className="space-y-5">
      <AdminHeader title="Chat Logs" subtitle="Inspect conversations, sources, and fallback behavior." />

      <section className="rounded-3xl border border-slate-200 bg-white p-5 grid grid-cols-1 md:grid-cols-3 gap-3">
        <label className="space-y-2">
          <span className="text-xs text-slate-500">Search messages</span>
          <input
            value={filters.search}
            onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value }))}
            className="w-full rounded-xl border border-slate-200 px-3 py-2"
          />
        </label>
        <label className="space-y-2">
          <span className="text-xs text-slate-500">Language</span>
          <select
            value={filters.language}
            onChange={(event) => setFilters((prev) => ({ ...prev, language: event.target.value }))}
            className="w-full rounded-xl border border-slate-200 px-3 py-2"
          >
            <option value="">All</option>
            <option value="en">English</option>
            <option value="km">Khmer</option>
          </select>
        </label>
        <div className="flex items-end">
          <button type="button" onClick={loadChats} className="px-4 py-2.5 rounded-xl bg-slate-900 text-white text-sm">
            Apply Filters
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-5">
        <ChatLogTable sessions={sessions} selectedId={selectedSession?.id} onSelect={setSelectedSession} />
        <div className="rounded-3xl border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-semibold text-slate-900">Conversation Details</h3>
          {selectedSession ? (
            <div className="mt-4 space-y-3">
              <p className="text-xs text-slate-500">
                Session: {selectedSession.session_token}
                <br />
                Language: {selectedSession.user_language.toUpperCase()} • Fallbacks: {fallbackCount}
              </p>
              <div className="max-h-[520px] overflow-y-auto space-y-3 pr-1">
                {selectedSession.messages.map((message) => (
                  <div key={message.id} className="rounded-2xl border border-slate-200 p-3">
                    <p className="text-xs uppercase tracking-wide text-slate-500">{message.role}</p>
                    <p className="text-sm text-slate-800 mt-1">{message.text}</p>
                    {message.sources?.length ? (
                      <p className="text-[11px] text-slate-400 mt-2">
                        Sources: {message.sources.map((source) => source.document_title).join(", ")}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500 mt-3">Select a session to inspect details.</p>
          )}
        </div>
      </section>
    </div>
  );
}

