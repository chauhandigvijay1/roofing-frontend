import { Shield, HardHat, Clock } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Licensed Experts",
    desc: "Fully insured and certified contractors with decades of combined experience in residential roofing.",
  },
  {
    icon: HardHat,
    title: "Quality Materials",
    desc: "We source only the best shingles, metal panels, and underlayment from trusted American manufacturers.",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    desc: "Emergency repairs available around the clock. We respond within 2 hours, no matter the weather.",
  },
];

export default function FeatureCards() {
  return (
    <section className="relative z-20 max-w-7xl mx-auto px-6 -mt-24 pb-16">
      <div className="grid md:grid-cols-3 gap-8">
        {features.map((f) => (
          <div
            key={f.title}
            className="bg-white p-8 shadow-xl shadow-stone-200/50 border border-stone-100 border-t-4 border-t-crimson transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer transform-gpu will-change-transform"
          >
            <div className="w-14 h-14 bg-crimson/10 flex items-center justify-center mb-6">
              <f.icon className="w-7 h-7 text-crimson" />
            </div>
            <h3 className="text-xl font-oswald uppercase tracking-wider font-bold text-zinc-900 mb-3">{f.title}</h3>
            <p className="text-zinc-600 leading-relaxed font-serif">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
