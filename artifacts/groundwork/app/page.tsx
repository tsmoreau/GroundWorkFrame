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
          <div
            className="w-7 h-7 rounded-md flex items-center justify-center"
            style={{ backgroundColor: "#C8A548" }}
          >
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

      {/* Hero — split layout */}
      <section className="max-w-6xl mx-auto px-8 pb-16 pt-8">
        <div className="grid grid-cols-2 gap-12 items-center min-h-[480px]">
          {/* Text side */}
          <div>
            <p
              className="text-xs font-semibold tracking-widest uppercase mb-5"
              style={{ color: "#C8A548" }}
            >
              Los Angeles · Outdoor Pet Environments
            </p>
            <h1 className="text-5xl font-bold leading-[1.1] mb-6" style={{ color: "#1C1208" }}>
              A space your pet deserves.<br />
              A structure you'll be proud of.
            </h1>
            <p className="text-lg leading-relaxed mb-10" style={{ color: "#6B5B4A" }}>
              Denhaus builds custom catios, dog houses, and outdoor enclosures
              for pets and the people who love them. Every project is designed
              for your yard and built to last.
            </p>
            <div className="flex items-center gap-5">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#2E1A0E" }}
              >
                Get a Free Quote
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                href="/gallery"
                className="text-sm font-medium transition-colors"
                style={{ color: "#6B5B4A" }}
              >
                View our work →
              </Link>
            </div>
          </div>
          {/* Photo side */}
          <div className="relative h-[480px] rounded-2xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1574158622682-e40e69881006?w=900&q=80"
              alt="Cat sunbathing in outdoor enclosure"
              className="w-full h-full object-cover"
            />
            {/* Subtle warm vignette at bottom */}
            <div
              className="absolute bottom-0 left-0 right-0 h-24"
              style={{
                background: "linear-gradient(to top, rgba(46,26,14,0.18), transparent)",
              }}
            />
          </div>
        </div>
      </section>

      {/* Gallery Teaser */}
      <section className="max-w-6xl mx-auto px-8 py-16 border-t" style={{ borderColor: "#E5D8C4" }}>
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#A09070" }}>
              Portfolio
            </p>
            <h2 className="text-3xl font-bold" style={{ color: "#1C1208" }}>Recent builds</h2>
          </div>
          <Link
            href="/gallery"
            className="text-sm font-medium flex items-center gap-1 hover:underline"
            style={{ color: "#2E1A0E" }}
          >
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

      {/* Features — light warm section */}
      <section style={{ backgroundColor: "#EDE5D4" }}>
        <div className="max-w-6xl mx-auto px-8 py-20">
          <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#A09070" }}>
            Why Denhaus
          </p>
          <h2 className="text-3xl font-bold mb-12" style={{ color: "#1C1208" }}>
            Built to a higher standard
          </h2>
          <div className="grid grid-cols-3 gap-10">
            {FEATURES.map(({ icon: Icon, title, body }) => (
              <div key={title}>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: "#C8A54828" }}
                >
                  <Icon className="w-5 h-5" style={{ color: "#C8A548" }} />
                </div>
                <h3 className="font-semibold text-lg mb-2" style={{ color: "#1C1208" }}>
                  {title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#6B5B4A" }}>
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-8 py-24 text-center">
        <h2 className="text-3xl font-bold mb-4" style={{ color: "#1C1208" }}>
          Ready to build something beautiful?
        </h2>
        <p className="mb-8 max-w-lg mx-auto" style={{ color: "#6B5B4A" }}>
          We do free site visits in the greater LA area. Send us a message and we'll
          get back to you within one business day.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#2E1A0E" }}
        >
          Get in Touch
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t px-8 py-8" style={{ borderColor: "#E5D8C4" }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <p className="text-xs" style={{ color: "#A09070" }}>© 2025 Denhaus LLC · Los Angeles, CA</p>
          <div className="flex gap-5 text-xs" style={{ color: "#A09070" }}>
            <Link href="/gallery" className="hover:text-[#1C1208]">Gallery</Link>
            <Link href="/contact" className="hover:text-[#1C1208]">Contact</Link>
            <Link href="/admin/dashboard" className="hover:text-[#1C1208]">Admin</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
