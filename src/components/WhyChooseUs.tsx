import { CheckCircle } from "lucide-react";

const points = [
  "Upfront Pricing — no hidden fees, ever.",
  "On-Time Execution — we start and finish as promised.",
  "Immaculate Clean-Up — we treat your home like our own.",
  "5-Year Workmanship Warranty on every job.",
];

export default function WhyChooseUs() {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <div className="overflow-hidden shadow-xl shadow-stone-200/50 bg-stone-100 transform-gpu will-change-transform">
          <img
            loading="lazy"
            decoding="async"
            src="/why-choose-us.jpg"
            alt="Why Choose Us"
            className="w-full h-80 md:h-full object-cover"
            style={{ transform: "translateZ(0)" }}
          />
        </div>

        <div>
          <h2 className="text-4xl md:text-5xl font-oswald uppercase tracking-wider font-bold text-zinc-900 mb-4">
            Built on Trust, Driven by Quality
          </h2>
          <div className="w-16 h-1 bg-crimson mb-8"></div>
          <div className="space-y-4">
            {points.map((p) => (
              <div key={p} className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-crimson shrink-0 mt-0.5" />
                <span className="text-zinc-700 text-lg font-serif">{p}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
