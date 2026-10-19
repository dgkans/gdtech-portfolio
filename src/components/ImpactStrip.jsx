const IMPACTS = [
  {
    value: "5M+",
    label: "messages/day",
    sub: "Real-time market-data pipelines on Kafka, Redis & Solace",
  },
  {
    value: "Sub-ms",
    label: "pipeline latency",
    sub: "Tuned for the trading & broking portal's decision speed",
  },
  {
    value: "100K+",
    label: "daily transactions",
    sub: "Order-execution & risk APIs in C#, Java, Go",
  },
  {
    value: "3.94",
    label: "M.S. CS GPA",
    sub: "Master's in Computer Science · Algorithms, ML, Software Eng.",
  },
];

export const ImpactStrip = () => {
  return (
    <section
      aria-label="Impact at a glance"
      className="px-4 -mt-2 md:-mt-4"
    >
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {IMPACTS.map((m) => (
            <div
              key={m.label}
              className="group relative rounded-xl border border-black/10 dark:border-white/10
                         bg-white/60 dark:bg-white/[0.03] backdrop-blur-sm
                         px-4 py-5 text-center
                         hover:-translate-y-0.5 hover:border-blue-500/40 transition-all"
            >
              <div className="text-3xl md:text-4xl font-bold tabular-nums bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent leading-none">
                {m.value}
              </div>
              <div className="mt-2 text-[11px] uppercase tracking-[0.18em] text-gray-600 dark:text-gray-300 font-semibold">
                {m.label}
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 leading-snug">
                {m.sub}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
