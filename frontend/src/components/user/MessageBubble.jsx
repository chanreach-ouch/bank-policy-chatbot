export default function MessageBubble({ role, text }) {
  return (
    <div className={`flex ${role === "user" ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[84%] px-4 py-3 rounded-2xl text-sm leading-6 ${
          role === "user"
            ? "bg-emerald-600 text-white rounded-br-md"
            : "bg-white border border-slate-200 text-slate-800 rounded-bl-md shadow-sm"
        }`}
      >
        {text}
      </div>
    </div>
  );
}

