const featureCards = [
  {
    title: "Ask About Policies",
    desc: "Get quick answers about loan rules, account opening, KYC, cards, deposits, and other bank policies.",
  },
  {
    title: "Khmer & English Support",
    desc: "Customers can ask naturally in Khmer or English and receive clear responses in the same language.",
  },
  {
    title: "Safe Official Answers",
    desc: "Responses are grounded in official bank policy documents and avoid unsupported answers.",
  },
];

export default function FeaturesSection() {
  return (
    <section id="services" className="max-w-7xl mx-auto px-6 py-16 md:py-24">
      <div className="text-center max-w-3xl mx-auto">
        <p className="text-emerald-700 font-medium">What customers can do</p>
        <h3 className="text-3xl md:text-4xl font-bold mt-3">Simple, trusted help on the bank website</h3>
        <p className="text-slate-600 mt-4 leading-8">
          Customers can browse bank services and instantly ask policy questions without searching through long
          documents.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        {featureCards.map((card) => (
          <div key={card.title} className="rounded-3xl bg-white border border-slate-200 shadow-sm p-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 mb-4" />
            <h4 className="text-xl font-semibold">{card.title}</h4>
            <p className="text-slate-600 mt-3 leading-7">{card.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

