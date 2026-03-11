import { MessageCircle, Send, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { api } from "../../api/client";
import { useChatSession } from "../../hooks/useChatSession";
import MessageBubble from "./MessageBubble";
import QuickActionChip from "./QuickActionChip";

export default function ChatWidget() {
  const { sessionToken, setSessionToken, config, languageHint } = useChatSession();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!config || messages.length) return;
    setMessages([
      {
        role: "bot",
        text:
          languageHint === "km"
            ? config.welcome_message_km || config.welcome_message_en || "Hello. Ask me about bank policy."
            : config.welcome_message_en || "Hello. Ask me about bank policy.",
      },
    ]);
  }, [config, languageHint, messages.length]);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  const positionClass = useMemo(() => {
    if (config?.widget_position === "left") return "left-5";
    return "right-5";
  }, [config]);

  const quickActions = config?.quick_actions || [
    "Loan policy",
    "Account opening",
    "KYC requirements",
    "Card policy",
  ];

  function getUniqueSourceTitles(sources = []) {
    return [...new Set(sources.map((source) => source.document_title))];
  }

  async function sendText(input) {
    const trimmed = input.trim();
    if (!trimmed || loading) return;
    const userMessage = { role: "user", text: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setLoading(true);
    try {
      const response = await api.sendMessage({
        session_token: sessionToken,
        message: trimmed,
        channel: "web_widget",
      });
      setSessionToken(response.session_token);
      setMessages((prev) => [...prev, { role: "bot", text: response.answer, sources: response.sources }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "I could not process your request right now. Please try again shortly.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const brandColor = config?.widget_primary_color || "#059669";

  return (
    <div className={`fixed ${positionClass} bottom-5 z-50`}>
      {open ? (
        <div className="w-[360px] max-w-[calc(100vw-24px)] rounded-[28px] border border-slate-200 shadow-2xl overflow-hidden bg-white">
          <div className="px-4 py-4 bg-slate-900 text-white flex items-center justify-between">
            <div>
              <p className="font-semibold">{config?.bot_display_name || "Bank Policy Assistant"}</p>
              <p className="text-xs text-slate-300">Khmer & English support</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div ref={scrollRef} className="p-4 space-y-3 h-[360px] overflow-y-auto bg-gradient-to-b from-white to-slate-50">
            {messages.map((item, idx) => (
              <div key={`${item.role}-${idx}`} className="space-y-1">
                <MessageBubble role={item.role === "bot" ? "assistant" : item.role} text={item.text} />
                {item.sources?.length ? (
                  <p className="text-[11px] text-slate-400 px-1">
                    Sources: {getUniqueSourceTitles(item.sources).join(", ")}
                  </p>
                ) : null}
              </div>
            ))}
            {loading ? <p className="text-xs text-slate-500">Assistant is typing...</p> : null}
          </div>

          <div className="px-4 pb-3 bg-white">
            <div className="flex flex-wrap gap-2 mb-3">
              {quickActions.slice(0, 4).map((item) => (
                <QuickActionChip key={item} label={item} onClick={(label) => sendText(label)} />
              ))}
            </div>
          </div>

          <div className="p-4 border-t border-slate-200 bg-white">
            <div className="flex gap-2">
              <input
                className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-sm"
                placeholder="Ask about loan, KYC, deposit, account opening..."
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    sendText(message);
                  }
                }}
              />
              <button
                type="button"
                onClick={() => sendText(message)}
                disabled={loading}
                className="px-4 py-3 rounded-2xl text-white font-semibold disabled:opacity-60"
                style={{ backgroundColor: brandColor }}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Answers are grounded in official bank policy documents.
            </p>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="mt-3 w-16 h-16 rounded-full shadow-2xl border-4 border-white text-white flex items-center justify-center"
        style={{ backgroundColor: brandColor }}
      >
        <MessageCircle className="w-7 h-7" />
      </button>
    </div>
  );
}
