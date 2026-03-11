import StatusBadge from "./StatusBadge";

export default function DocumentTable({ documents, onDelete, onReindex, onToggle }) {
  if (!documents.length) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-500">
        No policy documents uploaded yet.
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr className="text-left text-slate-500">
              <th className="px-4 py-3 font-semibold">Document</th>
              <th className="px-4 py-3 font-semibold">Type</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold">Version</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Indexing</th>
              <th className="px-4 py-3 font-semibold">Chunks</th>
              <th className="px-4 py-3 font-semibold">Updated</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.id} className="border-b border-slate-100">
                <td className="px-4 py-4">
                  <p className="font-semibold text-slate-900">{doc.title}</p>
                  <p className="text-xs text-slate-400">{doc.original_filename}</p>
                </td>
                <td className="px-4 py-4 uppercase">{doc.file_type}</td>
                <td className="px-4 py-4">{doc.category || "-"}</td>
                <td className="px-4 py-4">{doc.version}</td>
                <td className="px-4 py-4">
                  <StatusBadge value={doc.status} />
                </td>
                <td className="px-4 py-4">
                  <StatusBadge value={doc.indexing_status} />
                </td>
                <td className="px-4 py-4">{doc.chunk_count}</td>
                <td className="px-4 py-4">{new Date(doc.updated_at).toLocaleString()}</td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => onReindex(doc.id)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium"
                    >
                      Re-index
                    </button>
                    <button
                      type="button"
                      onClick={() => onToggle(doc.id, !doc.is_active)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium"
                    >
                      {doc.is_active ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(doc.id)}
                      className="px-3 py-1.5 rounded-lg border border-rose-200 text-rose-700 text-xs font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

