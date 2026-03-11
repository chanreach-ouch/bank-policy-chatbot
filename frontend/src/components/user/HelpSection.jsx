export default function HelpSection() {
  return (
    <section id="help" className="bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-6 py-16 md:py-20 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div>
          <p className="text-emerald-300 font-medium">Need more support?</p>
          <h3 className="text-3xl md:text-4xl font-bold mt-3">Talk to the assistant first, then connect to staff if needed.</h3>
          <p className="text-slate-300 mt-5 leading-8 max-w-xl">
            When a question is outside the available policy knowledge, the interface gently guides the customer to
            contact a bank officer or customer support.
          </p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <div className="space-y-4 text-sm">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
              <p className="text-slate-300">Fallback Example</p>
              <p className="mt-2 leading-7">
                I do not have enough official policy information to answer that confidently. Please contact a bank
                officer or customer support for official confirmation.
              </p>
            </div>
            <div className="rounded-2xl bg-emerald-500/10 border border-emerald-400/20 p-4 text-emerald-100">
              Designed for trust, clarity, and bilingual customer experience.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

