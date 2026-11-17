import { useBrand } from "../BrandContext";

export default function Gallery() {
  const brand = useBrand();

  const galleryItems = [
    {
      img: "https://irp.cdn-website.com/960cfd5a/dms3rep/multi/opt/shutterstock_1202910862-1920w.jpg",
      title: "Storm Leak & Structural Restoration",
      tag: "Architectural Shingles",
    },
    {
      img: "https://irp.cdn-website.com/960cfd5a/dms3rep/multi/opt/shutterstock_1231407160-1920w.jpg",
      title: "Complete Precision Tear-Off & Installation",
      tag: "50-Year Non-Prorated Warranty",
    },
    {
      img: "https://irp.cdn-website.com/960cfd5a/dms3rep/multi/opt/shutterstock_2447926003-1920w.jpg",
      title: "Engineered Metal Tile & Standing Seam",
      tag: "High-Tensile Storm Protection",
    },
    {
      img: "https://irp.cdn-website.com/960cfd5a/dms3rep/multi/opt/shutterstock_2467902073-1920w.jpg",
      title: "Commercial Single-Ply TPO & Coatings",
      tag: "Commercial & Retail Facilities",
    },
  ];

  return (
    <section id="gallery" className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-oswald uppercase tracking-widest text-crimson font-bold">
            Project Showcase
          </span>
          <h2 className="text-4xl md:text-5xl font-oswald uppercase tracking-wider font-bold text-zinc-900 mt-2">
            Completed Project Transformations by {brand.name}
          </h2>
          <div className="w-16 h-1 bg-crimson mx-auto mt-4 mb-8"></div>
          <p className="text-zinc-600 text-lg max-w-xl mx-auto font-serif">
            Authentic craftsmanship and verified transformations across {brand.city} and surrounding communities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {galleryItems.map((item, idx) => (
            <div key={idx} className="group overflow-hidden border border-stone-200 shadow-lg bg-stone-50">
              <div className="relative h-64 overflow-hidden">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent flex flex-col justify-end p-4">
                  <span className="text-xs text-crimson font-oswald uppercase tracking-wider font-bold">
                    {item.tag}
                  </span>
                  <span className="text-white font-oswald uppercase tracking-wider font-bold text-base mt-0.5">
                    {item.title}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
