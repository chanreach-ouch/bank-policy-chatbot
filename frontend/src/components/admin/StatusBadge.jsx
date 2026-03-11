const styleMap = {
  active: "bg-emerald-50 text-emerald-700 border border-emerald-100",
  draft: "bg-amber-50 text-amber-700 border border-amber-100",
  archived: "bg-slate-100 text-slate-600 border border-slate-200",
  indexed: "bg-emerald-50 text-emerald-700 border border-emerald-100",
  indexing: "bg-blue-50 text-blue-700 border border-blue-100",
  pending: "bg-amber-50 text-amber-700 border border-amber-100",
  failed: "bg-rose-50 text-rose-700 border border-rose-100",
};

export default function StatusBadge({ value }) {
  const key = String(value || "").toLowerCase();
  const styles = styleMap[key] || "bg-slate-100 text-slate-700 border border-slate-200";
  return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${styles}`}>{value}</span>;
}

