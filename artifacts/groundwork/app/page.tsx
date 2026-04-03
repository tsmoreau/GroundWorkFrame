import Link from "next/link";
import { PawPrint, ChevronRight, Leaf, Shield, Star } from "lucide-react";

const GALLERY_PREVIEW = [
  {
    src: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&q=80",
    alt: "Cat enjoying outdoor catio enclosure",
  },
  {
    src: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&q=80",
    alt: "Cat sunbathing in garden enclosure",
  },
  {
    src: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&q=80",
    alt: "Cat portrait in natural light",
  },
  {
    src: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&q=80",
    alt: "Dog resting in shaded outdoor space",
  },
  {
    src: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&q=80",
    alt: "Dogs playing in structured outdoor area",
  },
  {
    src: "https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?w=600&q=80",
    alt: "Pet in natural outdoor environment",
  },
];

const FEATURES = [
  {
    icon: Leaf,
    title: "Natural Materials",
    body: "Cedar, Douglas fir, and sustainably sourced lumber — built to weather the California seasons and look better with age.",
  },
  {
    icon: Shield,
    title: "Predator Proof",
    body: "14-gauge galvanized hardware cloth, fully framed corners, and secure latching systems. Your pets stay in. Everything else stays out.",
  },
  {
    icon: Star,
    title: "Custom Designed",
    body: "Every build starts with a site visit. No templates — just structures that fit your yard, your pets, and your aesthetic.",
  },
];

export default function HomePage() {
  return (
    <div style={{ backgroundColor: "#F5F0E8", minHeight: "100vh" }}>
      {/* Nav */}
      <nav className="px-8 py-5 flex items-center justify-between max-w-6xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ backgroundColor: "#C8A548" }}>
            <PawPrint className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-[#1C1208] tracking-tight">Denhaus</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/gallery" className="text-sm text-[#6B5B4A] hover:text-[#1C1208] transition-colors">
            Gallery
          </Link>
          <Link href="/contact" className="text-sm text-[#6B5B4A] hover:text-[#1C1208] transition-colors">
            Get a Quote
          </Link>
          <Link
            href="/admin/dashboard"
            className="text-xs font-medium px-3 py-1.5 rounded-lg border border-[#DDD0B8] text-[#6B5B4A] hover:bg-white transition-colors"
          >
            Admin
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{ backgroundColor: "#2E1A0E" }}
      >
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url(https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=1600&q=60)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative max-w-6xl mx-auto px-8 py-28">
          <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "#C8A548" }}>
            Los Angeles · Outdoor Pet Environments
          </p>
          <h1 className="text-5xl font-bold text-white leading-tight max-w-2xl">
            A space your pet deserves.<br />
            A structure you'll be proud of.
          </h1>
          <p className="mt-6 text-lg max-w-xl leading-relaxed" style={{ color: "#C8B8A0" }}>
            Denhaus builds custom catios, dog houses, and outdoor enclosures for pets
            and the people who love them. Every project is designed for your yard and built to last.
          </p>
          <div className="mt-10 flex items-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-[#2E1A0E] transition-colors hover:opacity-90"
              style={{ backgroundColor: "#C8A548" }}
            >
              Get a Free Quote
              <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              href="/gallery"
              className="text-sm font-medium text-white hover:text-[#C8A548] transition-colors"
            >
              View our work →
            </Link>
          </div>
        </div>
      </section>

      {/* Gallery Teaser */}
      <section className="max-w-6xl mx-auto px-8 py-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-[#A09070] mb-2">Portfolio</p>
            <h2 className="text-3xl font-bold text-[#1C1208]">Recent builds</h2>
          </div>
          <Link href="/gallery" className="text-sm font-medium text-[#2E1A0E] hover:underline flex items-center gap-1">
            See all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {GALLERY_PREVIEW.slice(0, 6).map((img, i) => (
            <div
              key={i}
              className="aspect-[4/3] rounded-xl overflow-hidden bg-[#E8D8C4]"
              style={{ gridRow: i === 0 ? "span 2" : undefined }}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ backgroundColor: "#2E1A0E" }}>
        <div className="max-w-6xl mx-auto px-8 py-20">
          <div className="grid grid-cols-3 gap-10">
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <div key={title}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: "#C8A54822" }}>
                  <Icon className="w-5 h-5" style={{ color: "#C8A548" }} />
                </div>
                <h3 className="font-semibold text-white text-lg mb-2">{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#A89878" }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-8 py-20 text-center">
        <h2 className="text-3xl font-bold text-[#1C1208] mb-4">
          Ready to build something beautiful?
        </h2>
        <p className="text-[#6B5B4A] mb-8 max-w-lg mx-auto">
          We do free site visits in the greater LA area. Send us a message and we'll get back to you within one business day.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm text-white"
          style={{ backgroundColor: "#2E1A0E" }}
        >
          Get in Touch
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E8D8C4] px-8 py-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <p className="text-xs text-[#A09070]">© 2025 Denhaus LLC · Los Angeles, CA</p>
          <div className="flex gap-5 text-xs text-[#A09070]">
            <Link href="/gallery" className="hover:text-[#1C1208]">Gallery</Link>
            <Link href="/contact" className="hover:text-[#1C1208]">Contact</Link>
            <Link href="/admin/dashboard" className="hover:text-[#1C1208]">Admin</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
