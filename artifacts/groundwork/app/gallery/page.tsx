import Link from "next/link";
import { PawPrint, ChevronRight } from "lucide-react";

const PROJECTS = [
  {
    id: 1,
    title: "Los Feliz Catio — 10×6",
    type: "Catio",
    client: "D.C.",
    description: "Cedar-framed standard enclosure with an 8-foot window tunnel attachment. The cats can access it from the second bedroom.",
    images: [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80",
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&q=80",
      "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&q=80",
    ],
    tags: ["Catio", "Cedar", "Window Tunnel"],
  },
  {
    id: 2,
    title: "Silver Lake Catio — 14×8",
    type: "Catio",
    client: "A.F.",
    description: "Large-format catio with a double-door access panel and integrated shade sail. Three cats, plenty of climbing platforms.",
    images: [
      "https://images.unsplash.com/photo-1583336663277-620dc1996580?w=800&q=80",
      "https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?w=800&q=80",
    ],
    tags: ["Catio", "Large Format", "Shade Integration"],
  },
  {
    id: 3,
    title: "Echo Park Dog Run",
    type: "Kennel",
    client: "M.K.",
    description: "Freestanding kennel with covered run, elevated deck platform, and galvanized hardware cloth on all sides.",
    images: [
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80",
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80",
    ],
    tags: ["Dog", "Kennel", "Elevated Deck"],
  },
  {
    id: 4,
    title: "Atwater Ranch House",
    type: "Dog House",
    client: "B.L.",
    description: "Custom ranch-style dog house with cedar shingle roof and full interior insulation for summer heat. Built for a 90-pound German Shepherd.",
    images: [
      "https://images.unsplash.com/photo-1560807707-8cc77767d783?w=800&q=80",
    ],
    tags: ["Dog House", "Ranch Style", "Insulated"],
  },
];

export default function GalleryPage() {
  return (
    <div style={{ backgroundColor: "#f8f6f2", minHeight: "100vh" }}>
      {/* Nav */}
      <nav className="px-8 py-5 flex items-center justify-between max-w-6xl mx-auto border-b border-[#e8e4dc]">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ backgroundColor: "#c8a55a" }}>
            <PawPrint className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-[#1a1a18] tracking-tight">Denhaus</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/gallery" className="text-sm font-medium text-[#1a1a18]">Gallery</Link>
          <Link href="/contact" className="text-sm text-[#5c5c54] hover:text-[#1a1a18]">Get a Quote</Link>
          <Link href="/admin/dashboard" className="text-xs font-medium px-3 py-1.5 rounded-lg border border-[#e0dbd0] text-[#5c5c54] hover:bg-white">Admin</Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-8 py-16">
        <div className="mb-12">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#a09890] mb-2">Portfolio</p>
          <h1 className="text-4xl font-bold text-[#1a1a18]">Our work</h1>
          <p className="mt-4 text-[#5c5c54] max-w-lg">
            Every project is photographed with client permission. These are real builds, real yards, real pets.
          </p>
        </div>

        <div className="space-y-16">
          {PROJECTS.map((project, i) => (
            <div key={project.id} className={`grid grid-cols-2 gap-10 items-start ${i % 2 === 1 ? "direction-rtl" : ""}`}>
              {/* Image Grid */}
              <div className={`grid gap-3 ${i % 2 === 1 ? "order-2" : ""}`}>
                <div className="aspect-[4/3] rounded-xl overflow-hidden bg-[#e8e4dc]">
                  <img
                    src={project.images[0]}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                {project.images.length > 1 && (
                  <div className="grid grid-cols-2 gap-3">
                    {project.images.slice(1, 3).map((img, j) => (
                      <div key={j} className="aspect-square rounded-xl overflow-hidden bg-[#e8e4dc]">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Text */}
              <div className={`py-4 ${i % 2 === 1 ? "order-1" : ""}`}>
                <div className="flex items-center gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <span key={tag} className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#e8e4dc] text-[#5c5c54]">
                      {tag}
                    </span>
                  ))}
                </div>
                <h2 className="text-2xl font-bold text-[#1a1a18] mb-3">{project.title}</h2>
                <p className="text-[#5c5c54] leading-relaxed mb-6">{project.description}</p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 text-sm font-medium text-[#1c3829] hover:underline"
                >
                  Build something like this
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <h2 className="text-2xl font-bold text-[#1a1a18] mb-4">Want to see something custom?</h2>
          <p className="text-[#5c5c54] mb-8">We're happy to share more photos or sketch out ideas for your space before you commit to anything.</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm text-white"
            style={{ backgroundColor: "#1c3829" }}
          >
            Start a Conversation
          </Link>
        </div>
      </div>

      <footer className="border-t border-[#e8e4dc] px-8 py-8 mt-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <p className="text-xs text-[#a09890]">© 2025 Denhaus LLC · Los Angeles, CA</p>
          <div className="flex gap-5 text-xs text-[#a09890]">
            <Link href="/" className="hover:text-[#1a1a18]">Home</Link>
            <Link href="/contact" className="hover:text-[#1a1a18]">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
