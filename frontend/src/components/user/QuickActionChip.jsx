export default function QuickActionChip({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(label)}
      className="px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 text-xs font-medium text-slate-700"
    >
      {label}
    </button>
  );
}

