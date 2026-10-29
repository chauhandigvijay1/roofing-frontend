import { useBrand } from "../BrandContext";

export default function Gallery() {
  const brand = useBrand();

  const jimGallery = [
    {
      img: "https://irp.cdn-website.com/960cfd5a/dms3rep/multi/opt/shutterstock_1202910862-1920w.jpg",
      title: "Storm Leak Restoration",
      tag: "140+ MPH Architectural Shingles",
    },
    {
      img: "https://irp.cdn-website.com/960cfd5a/dms3rep/multi/opt/shutterstock_1231407160-1920w.jpg",
      title: "Complete Reroof Installation",
      tag: "Duval County Hurricane Fastening",
    },
    {
      img: "https://irp.cdn-website.com/960cfd5a/dms3rep/multi/opt/shutterstock_2447926003-1920w.jpg",
      title: "Worthouse Metal Tile Assembly",
      tag: "High-Tensile Florida Storm Protection",
    },
    {
      img: "https://irp.cdn-website.com/960cfd5a/dms3rep/multi/opt/shutterstock_2467902073-1920w.jpg",
      title: "Commercial TPO & Silicone Coatings",
      tag: "Jacksonville Commercial Facilities",
    },
  ];

  return (
    <section id="gallery" className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-oswald uppercase tracking-wider font-bold text-zinc-900">
            {brand.isJim ? "Ready Roofing Completed Transformations" : "See the Transformation"}
          </h2>
          <div className="w-16 h-1 bg-crimson mx-auto mt-4 mb-8"></div>
          <p className="text-zinc-600 text-lg max-w-xl mx-auto font-serif">
            {brand.isJim
              ? "Authentic project craftsmanship across Jacksonville, St. Augustine, Orange Park, and Palm Coast."
              : "Real results from real projects in your community."}
          </p>
        </div>

        {brand.isJim ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {jimGallery.map((item, idx) => (
              <div key={idx} className="group overflow-hidden border border-stone-200 shadow-lg bg-stone-50">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-4">
                    <span className="text-xs text-crimson font-oswald uppercase tracking-wider font-bold">
                      {item.tag}
                    </span>
                    <span className="text-white font-oswald uppercase tracking-wider font-bold text-base">
                      {item.title}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="relative overflow-hidden shadow-xl bg-stone-100">
              <img src="/before-roof.jpg" alt="Before" className="w-full h-80 md:h-96 object-cover" />
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-6 text-white font-oswald uppercase font-bold">
                The Damage
              </div>
            </div>
            <div className="relative overflow-hidden shadow-xl bg-stone-100">
              <img src="/after-roof.jpg" alt="After" className="w-full h-80 md:h-96 object-cover" />
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-6 text-white font-oswald uppercase font-bold">
                The {brand.name} Solution
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
