import { useBrand } from "../BrandContext";
import { Shield, HardHat, Heart } from "lucide-react";

const values = [
  { icon: Shield, label: "Community Trusted", desc: "Decades of serving local families." },
  { icon: HardHat, label: "Expert Craftsmanship", desc: "Certified and continuously trained." },
  { icon: Heart, label: "Neighborhood Pride", desc: "We live and work right here." },
];

export default function LocalExperts() {
  const { city, name } = useBrand();

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto text-center">
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-oswald uppercase tracking-wider font-bold text-zinc-900 mb-4">
            Meet the {name} Crew
          </h2>
          <div className="w-16 h-1 bg-crimson mx-auto mt-4 mb-8"></div>
          <p className="text-zinc-600 text-lg max-w-2xl mx-auto font-serif">
            We&apos;re not just contractors — we&apos;re your neighbors in {city}. Every roof we build
            strengthens the community we call home.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {values.map((v) => (
            <div
              key={v.label}
              className="bg-stone-50 p-8 border border-stone-200 border-t-4 border-t-crimson hover:shadow-xl hover:shadow-stone-200/50 transition-shadow transform-gpu will-change-transform"
            >
              <div className="w-14 h-14 bg-crimson/10 flex items-center justify-center mx-auto mb-5">
                <v.icon className="w-7 h-7 text-crimson" />
              </div>
              <h3 className="text-lg font-oswald uppercase tracking-wider font-bold text-zinc-900 mb-2">{v.label}</h3>
              <p className="text-zinc-600 text-sm font-serif">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
