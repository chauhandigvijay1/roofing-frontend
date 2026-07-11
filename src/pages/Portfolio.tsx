import { useBrand } from "../BrandContext";

const projects = [
  { title: "Modern Farmhouse", location: "Austin, TX", img: "/after-roof.jpg" },
  { title: "Colonial Restoration", location: "Dallas, TX", img: "/before-roof.jpg" },
  { title: "Commercial Strip Mall", location: "Houston, TX", img: "/service-commercial.jpg" },
  { title: "Custom Metal Roof", location: "San Antonio, TX", img: "/service-metal.jpg" },
  { title: "Storm Recovery", location: "Fort Worth, TX", img: "/service-storm.jpg" },
  { title: "Luxury Shingle Estate", location: "Plano, TX", img: "/service-shingle.jpg" },
];

export default function Portfolio() {
  const { name } = useBrand();

  return (
    <section className="pt-36 pb-24 px-6 bg-stone-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-oswald uppercase tracking-wider font-bold text-zinc-900">Our Work</h1>
          <div className="w-16 h-1 bg-crimson mx-auto mt-4 mb-8"></div>
          <p className="text-zinc-600 text-lg max-w-xl mx-auto font-serif">
            Every project tells a story. Here are some of our favorites from around Texas.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" style={{ contentVisibility: "auto" }}>
          {projects.map((p) => (
            <div
              key={p.title}
              className="bg-white overflow-hidden shadow-lg border-t-4 border-t-crimson transition-all duration-300 hover:-translate-y-2 hover:shadow-xl transform-gpu will-change-transform"
            >
              <div className="overflow-hidden bg-stone-100 h-56">
                <img loading="lazy" decoding="async" src={p.img} alt={p.title} className="w-full h-full object-cover" style={{ transform: "translateZ(0)" }} />
              </div>
              <div className="p-8">
                <h3 className="text-lg font-oswald uppercase tracking-wider font-bold text-zinc-900">{p.title}</h3>
                <p className="text-sm text-zinc-500 font-serif">{p.location}</p>
                <p className="text-xs text-zinc-400 mt-1 font-serif">A {name} project</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
