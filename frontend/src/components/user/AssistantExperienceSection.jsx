export default function AssistantExperienceSection() {
  return (
    <section id="assistant" className="max-w-7xl mx-auto px-6 py-16 md:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div>
          <p className="text-emerald-700 font-medium">Customer assistant experience</p>
          <h3 className="text-3xl md:text-4xl font-bold mt-3">Designed to feel easy, warm, and trustworthy</h3>
          <p className="text-slate-600 mt-5 leading-8">
            The interface reduces confusion, helps customers ask better questions, and presents policy-based answers
            in a clean conversational format.
          </p>

          <div className="mt-8 space-y-4">
            {[
              "Floating chatbot button fixed at the website corner",
              "Full chat panel with welcome message and quick actions",
              "Readable layout for Khmer and English text",
              "Safe fallback when official information is unavailable",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-2xl bg-white border border-slate-200 p-4">
                <div className="w-6 h-6 rounded-full bg-emerald-100 mt-0.5" />
                <p className="text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative min-h-[520px] rounded-[36px] bg-slate-100 border border-slate-200 overflow-hidden p-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.16),_transparent_38%)]" />
          <div className="relative h-full">
            <div className="absolute bottom-0 right-0 w-[360px] max-w-full rounded-[28px] border border-slate-200 bg-white shadow-2xl overflow-hidden">
              <div className="px-4 py-4 bg-slate-950 text-white flex items-center justify-between">
                <div>
                  <p className="font-semibold">Ask our AI Assistant</p>
                  <p className="text-xs text-slate-400">Fast help for bank policy questions</p>
                </div>
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <div className="p-4 h-[320px] bg-slate-50">
                <div className="rounded-2xl bg-white border border-slate-200 px-4 py-3 text-sm text-slate-700 max-w-[88%] shadow-sm">
                  Hello! I can help explain official bank policies in Khmer and English.
                </div>
              </div>
              <div className="p-4 border-t border-slate-200 bg-white">
                <div className="flex gap-2">
                  <input
                    className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
                    placeholder="Type your question..."
                  />
                  <button className="px-5 py-3 rounded-2xl bg-emerald-600 text-white font-medium">Send</button>
                </div>
              </div>
            </div>

            <div className="absolute bottom-4 right-4 w-16 h-16 rounded-full bg-emerald-600 shadow-2xl ring-8 ring-white flex items-center justify-center text-white text-xl font-bold">
              AI
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

