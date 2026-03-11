import ChatPreview from "./ChatPreview";
import Navbar from "./Navbar";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-900 text-white">
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_#34d399,_transparent_35%)]" />
      <div className="max-w-7xl mx-auto px-6 py-6 relative z-10">
        <Navbar />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center py-16 md:py-24">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-sm text-emerald-200">
              Fluent Khmer & English Banking Support
            </div>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mt-6 leading-tight">
              Smart bank policy help for every customer.
            </h2>
            <p className="mt-6 text-slate-200 text-lg max-w-xl leading-8">
              A friendly AI assistant that helps users understand official bank policies, account rules, KYC
              requirements, loan information, and service guidance directly from the website.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#assistant" className="px-6 py-3 rounded-2xl bg-emerald-500 text-slate-950 font-semibold shadow-lg">
                Ask the Assistant
              </a>
              <a href="#services" className="px-6 py-3 rounded-2xl border border-white/20 bg-white/5 text-white font-medium">
                View Services
              </a>
            </div>

            <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div className="rounded-2xl bg-white/10 border border-white/10 p-4">
                <p className="text-slate-300">Response Style</p>
                <p className="font-semibold mt-1">Natural & Professional</p>
              </div>
              <div className="rounded-2xl bg-white/10 border border-white/10 p-4">
                <p className="text-slate-300">Languages</p>
                <p className="font-semibold mt-1">Khmer + English</p>
              </div>
              <div className="rounded-2xl bg-white/10 border border-white/10 p-4 col-span-2 md:col-span-1">
                <p className="text-slate-300">Powered By</p>
                <p className="font-semibold mt-1">RAG + Gemini</p>
              </div>
            </div>
          </div>

          <ChatPreview />
        </div>
      </div>
    </section>
  );
}

