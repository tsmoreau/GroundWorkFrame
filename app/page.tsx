import Link from "next/link";

const GALLERY_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80",
    alt: "Close up of high quality wood joinery in a premium outdoor pet environment",
    aspect: "aspect-square",
  },
  {
    src: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&q=80",
    alt: "A small designer dog house nestled under a large oak tree in a sunny backyard",
    aspect: "aspect-[3/4]",
  },
  {
    src: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&q=80",
    alt: "A happy dog sitting in front of its modern wooden home at dusk with warm interior lighting",
    aspect: "aspect-[4/5]",
  },
  {
    src: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&q=80",
    alt: "Minimalist cat climbing wall with natural wood finishes in a garden setting",
    aspect: "aspect-square",
  },
];

export default function HomePage() {
  return (
    <div className="bg-surface text-on-surface">
      {/* TopNavBar */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl rounded-xl bg-stone-50/80 backdrop-blur-md shadow-[0_20px_50px_rgba(25,28,27,0.06)] z-50 flex justify-between items-center px-8 py-4 transition-all duration-300">
        <div className="text-2xl font-bold font-headline text-primary">Groundwork</div>
        <nav className="hidden md:flex items-center space-x-10">
          <a href="#process" className="text-primary/70 hover:text-primary transition-colors label-style text-xs font-medium">Process</a>
          <a href="#portfolio" className="text-primary/70 hover:text-primary transition-colors label-style text-xs font-medium">Portfolio</a>
          <a href="#materials" className="text-primary/70 hover:text-primary transition-colors label-style text-xs font-medium">Materials</a>
          <a href="#faq" className="text-primary/70 hover:text-primary transition-colors label-style text-xs font-medium">FAQ</a>
        </nav>
        <div className="flex items-center gap-4">
          <Link
            href="/contact"
            className="bg-primary text-on-primary px-6 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 active:scale-95 transition-all duration-200"
          >
            Get Started
          </Link>
          <Link
            href="/admin/dashboard"
            className="text-xs font-medium text-primary/50 hover:text-primary transition-colors label-style"
          >
            Admin
          </Link>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              alt="Luxurious modern dog house integrated into a lush forest landscape"
              className="w-full h-full object-cover"
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/60 to-transparent" />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-8 w-full">
            <div className="max-w-2xl">
              <span className="label-style text-primary-fixed-dim text-sm font-semibold mb-4 block">
                Groundwork Studio
              </span>
              <h1 className="text-6xl md:text-8xl text-white font-light leading-tight mb-8">
                Elevated <span className="italic">Outdoor Living</span> for Your Pets.
              </h1>
              <p className="text-white/80 text-xl font-light mb-10 max-w-lg leading-relaxed">
                Architectural sanctuaries crafted with sustainable timber and modern precision. Because nature belongs to them too.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/contact"
                  className="bg-secondary text-on-secondary px-8 py-4 rounded-lg text-lg font-medium hover:opacity-90 transition-all flex items-center justify-center"
                >
                  Start Your Project
                </Link>
                <Link
                  href="#portfolio"
                  className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-lg text-lg font-medium hover:bg-white/20 transition-all flex items-center justify-center"
                >
                  Explore Designs
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Product Categories */}
        <section className="py-32 bg-surface">
          <div className="max-w-7xl mx-auto px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
              <div className="max-w-xl">
                <span className="label-style text-primary text-sm font-bold mb-4 block">Collections</span>
                <h2 className="text-5xl text-on-surface font-headline">Precision Built for Every Instinct.</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="group relative aspect-[3/4] bg-surface-container overflow-hidden rounded-xl">
                <img
                  alt="Elegant wooden catio structure attached to a modern home"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  src="https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&q=80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="material-symbols-outlined text-white mb-2 block">pets</span>
                  <h3 className="text-white text-2xl font-headline">Catios</h3>
                  <p className="text-white/60 text-sm mt-1">Aerial exploration zones.</p>
                </div>
              </div>

              <div className="group relative aspect-[3/4] bg-surface-container overflow-hidden rounded-xl">
                <img
                  alt="Modern architectural dog house with cedar wood siding on a manicured lawn"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&q=80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="material-symbols-outlined text-white mb-2 block">home</span>
                  <h3 className="text-white text-2xl font-headline">Dog Houses</h3>
                  <p className="text-white/60 text-sm mt-1">Ground-level sanctuaries.</p>
                </div>
              </div>

              <div className="group relative aspect-[3/4] bg-surface-container overflow-hidden rounded-xl">
                <img
                  alt="Spacious secure outdoor dog kennel with reinforced steel accents"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&q=80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="material-symbols-outlined text-white mb-2 block">fence</span>
                  <h3 className="text-white text-2xl font-headline">Kennels</h3>
                  <p className="text-white/60 text-sm mt-1">Robust perimeter comfort.</p>
                </div>
              </div>

              <div className="group relative aspect-[3/4] bg-surface-container overflow-hidden rounded-xl">
                <img
                  alt="Artistic wooden tunnel through a landscaped garden for small animals"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&q=80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="material-symbols-outlined text-white mb-2 block">park</span>
                  <h3 className="text-white text-2xl font-headline">Tunnels</h3>
                  <p className="text-white/60 text-sm mt-1">Interconnected pathways.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Portfolio Gallery */}
        <section id="portfolio" className="py-32 bg-surface-container-low">
          <div className="max-w-7xl mx-auto px-8">
            <div className="grid grid-cols-12 gap-8 items-start">
              <div className="col-span-12 lg:col-span-4 lg:sticky lg:top-32">
                <span className="label-style text-primary text-sm font-bold mb-4 block">The Studio Portfolio</span>
                <h2 className="text-5xl mb-8 font-headline">Architectural Works.</h2>
                <p className="text-on-surface-variant text-lg leading-relaxed mb-10">
                  Our projects are more than structures; they are permanent installations that harmonize with your home's existing architecture.
                </p>
                <Link
                  href="/contact"
                  className="flex items-center gap-4 text-primary font-bold label-style hover:gap-6 transition-all group"
                >
                  View More Projects
                  <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
                </Link>
              </div>
              <div className="col-span-12 lg:col-span-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="bg-surface-container rounded-xl overflow-hidden aspect-square">
                      <img alt={GALLERY_IMAGES[0].alt} className="w-full h-full object-cover" src={GALLERY_IMAGES[0].src} />
                    </div>
                    <div className="bg-surface-container rounded-xl overflow-hidden aspect-[3/4]">
                      <img alt={GALLERY_IMAGES[1].alt} className="w-full h-full object-cover" src={GALLERY_IMAGES[1].src} />
                    </div>
                  </div>
                  <div className="space-y-4 pt-12">
                    <div className="bg-surface-container rounded-xl overflow-hidden aspect-[4/5]">
                      <img alt={GALLERY_IMAGES[2].alt} className="w-full h-full object-cover" src={GALLERY_IMAGES[2].src} />
                    </div>
                    <div className="bg-surface-container rounded-xl overflow-hidden aspect-square">
                      <img alt={GALLERY_IMAGES[3].alt} className="w-full h-full object-cover" src={GALLERY_IMAGES[3].src} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section id="process" className="py-32 bg-primary text-white">
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-center max-w-2xl mx-auto mb-24">
              <span className="label-style text-primary-fixed-dim text-sm font-bold mb-4 block">The Blueprint</span>
              <h2 className="text-5xl font-light font-headline">Our Path to Quality.</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              {[
                {
                  n: "01",
                  title: "Initial Consultation",
                  body: "We assess your terrain, your pet's specific needs, and your home's aesthetic to draft the first blueprint.",
                },
                {
                  n: "02",
                  title: "Design & Invoicing",
                  body: "Refining the 3D model. Transparent pricing and material selection before we cut a single plank.",
                },
                {
                  n: "03",
                  title: "Artisanal Build",
                  body: "Our craftsmen assemble your project using weather-resistant, sustainable materials in our studio.",
                },
                {
                  n: "04",
                  title: "On-Site Fitting",
                  body: "Final installation and structural anchoring. We ensure the environment is safe, stable, and ready for exploration.",
                },
              ].map((step) => (
                <div key={step.n} className="relative">
                  <div className="text-6xl font-headline text-white/10 absolute -top-8 -left-4 select-none">{step.n}</div>
                  <h4 className="text-xl font-headline mb-4">{step.title}</h4>
                  <p className="text-white/60 text-sm leading-relaxed">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-32 bg-surface overflow-hidden relative">
          <div className="max-w-7xl mx-auto px-8 text-center">
            <div className="bg-surface-container-high rounded-2xl py-24 px-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -mr-32 -mt-32" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -ml-32 -mb-32" />
              <h2 className="text-5xl md:text-6xl mb-8 max-w-2xl mx-auto font-headline">
                Ready to build something special?
              </h2>
              <p className="text-on-surface-variant text-xl mb-12 max-w-xl mx-auto">
                Join the waiting list for our next design window. Limited commissions accepted each season.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href="/contact"
                  className="bg-primary text-on-primary px-10 py-5 rounded-lg text-lg font-bold transition-all hover:scale-105 active:scale-95"
                >
                  Contact Our Studio
                </Link>
                <p className="text-on-surface-variant/60 text-sm font-medium label-style">Est. Project Start: Spring 2025</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-stone-100 mt-32">
        <div className="max-w-7xl mx-auto px-8 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="font-headline text-xl text-primary mb-6">Groundwork</div>
            <p className="text-stone-600 max-w-sm text-sm leading-relaxed mb-8">
              Crafting architectural outdoor habitats for domestic animals. We believe high-end design should extend beyond the four walls of your home.
            </p>
            <p className="text-stone-600 text-sm italic">© 2025 Groundwork Studio. All rights reserved. Crafted for the Architectural Naturalist.</p>
          </div>
          <div>
            <h5 className="label-style text-xs font-bold text-primary mb-6">Experience</h5>
            <ul className="space-y-4">
              <li><a href="#process" className="text-stone-600 text-sm hover:text-primary transition-colors">Process</a></li>
              <li><a href="#portfolio" className="text-stone-600 text-sm hover:text-primary transition-colors">Portfolio</a></li>
              <li><Link href="/contact" className="text-stone-600 text-sm hover:text-primary transition-colors">Get Started</Link></li>
              <li><Link href="/admin/dashboard" className="text-stone-600 text-sm hover:text-primary transition-colors">Admin</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="label-style text-xs font-bold text-primary mb-6">Philosophy</h5>
            <ul className="space-y-4">
              <li><a href="#" className="text-stone-600 text-sm hover:text-primary transition-colors">Environmental Impact</a></li>
              <li><a href="#" className="text-stone-600 text-sm hover:text-primary transition-colors">Material Sourcing</a></li>
              <li><a href="#" className="text-stone-600 text-sm hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-stone-600 text-sm hover:text-primary transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
