const topics = [
  "Loan Policy",
  "Savings Account",
  "KYC Verification",
  "Cards & ATM",
  "Deposit Rules",
  "Fees & Charges",
];

export default function TopicsSection() {
  return (
    <section className="bg-white border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="text-emerald-700 font-medium">Popular banking topics</p>
            <h3 className="text-3xl font-bold mt-2">Quick access to common questions</h3>
          </div>
          <button className="px-5 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-sm font-medium w-fit">
            Browse All Topics
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-10">
          {topics.map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 text-center font-medium text-slate-700"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

