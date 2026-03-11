import MessageBubble from "./MessageBubble";
import QuickActionChip from "./QuickActionChip";

const previewMessages = [
  {
    role: "bot",
    text: "សួស្តី! ខ្ញុំជាជំនួយការគោលការណ៍ធនាគារ។ អ្នកអាចសួរអំពីការបើកគណនី កម្ចី KYC កាត ឬថ្លៃសេវាបាន។",
  },
  { role: "user", text: "What do I need to open a savings account?" },
  {
    role: "bot",
    text: "Based on policy, savings account opening generally requires identity verification and customer information.",
  },
];

const quickActions = ["Open account", "Loan requirements", "KYC documents", "ATM card fees"];

export default function ChatPreview() {
  return (
    <div className="relative">
      <div className="rounded-[32px] border border-white/10 bg-white/10 backdrop-blur-xl p-4 shadow-2xl">
        <div className="rounded-[28px] overflow-hidden bg-white shadow-2xl border border-slate-200">
          <div className="bg-slate-950 text-white px-5 py-4 flex items-center justify-between">
            <div>
              <p className="font-semibold">Bank AI Assistant</p>
              <p className="text-xs text-slate-400">Official policy guidance</p>
            </div>
            <div className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs border border-emerald-400/20">
              Online
            </div>
          </div>

          <div className="p-4 space-y-3 h-[420px] bg-gradient-to-b from-slate-50 to-white overflow-y-auto">
            {previewMessages.map((msg, idx) => (
              <MessageBubble key={`${msg.role}-${idx}`} role={msg.role} text={msg.text} />
            ))}
          </div>

          <div className="px-4 pb-3 bg-white">
            <div className="flex flex-wrap gap-2 mb-3">
              {quickActions.map((item) => (
                <QuickActionChip key={item} label={item} />
              ))}
            </div>
          </div>

          <div className="p-4 border-t border-slate-200 bg-white">
            <div className="flex gap-2">
              <input
                className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-sm"
                placeholder="Ask about account opening, KYC, loans, cards..."
              />
              <button className="px-5 py-3 rounded-2xl bg-emerald-600 text-white font-semibold">Send</button>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Answers are based on available official bank policy documents.
            </p>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full bg-emerald-500 shadow-2xl border-4 border-white" />
    </div>
  );
}

