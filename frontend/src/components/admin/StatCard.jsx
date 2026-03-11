export default function StatCard({ label, value, helper }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="text-3xl font-bold text-slate-900 mt-2">{value}</p>
      {helper ? <p className="text-xs text-slate-400 mt-2">{helper}</p> : null}
    </div>
  );
}

