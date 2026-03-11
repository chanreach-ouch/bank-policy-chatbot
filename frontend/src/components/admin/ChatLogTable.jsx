export default function ChatLogTable({ sessions, selectedId, onSelect }) {
  if (!sessions.length) {
    return <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-500">No chat logs found.</div>;
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
            <tr className="text-left">
              <th className="px-4 py-3 font-semibold">Session</th>
              <th className="px-4 py-3 font-semibold">Language</th>
              <th className="px-4 py-3 font-semibold">Messages</th>
              <th className="px-4 py-3 font-semibold">Updated</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((session) => (
              <tr
                key={session.id}
                onClick={() => onSelect(session)}
                className={`border-b border-slate-100 cursor-pointer ${
                  session.id === selectedId ? "bg-emerald-50/60" : "hover:bg-slate-50"
                }`}
              >
                <td className="px-4 py-4">
                  <p className="font-semibold text-slate-900">{session.session_token.slice(0, 10)}...</p>
                  <p className="text-xs text-slate-400">{session.channel}</p>
                </td>
                <td className="px-4 py-4 uppercase">{session.user_language}</td>
                <td className="px-4 py-4">{session.messages.length}</td>
                <td className="px-4 py-4">{new Date(session.updated_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

