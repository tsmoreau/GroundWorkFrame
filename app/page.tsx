import Link from "next/link";
import { PawPrint, Home, Fence, GitBranch, ArrowRight } from "lucide-react";

const CATEGORIES = [
  {
    icon: PawPrint,
    title: "Catios",
    sub: "Aerial exploration zones.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCsnanLIIcoNO9Fe-BG5XsLcrWs3Qk2oQkMIPFdbNIsnmMv-sNBGEd2iOpyh6hv2H42Kum_6AYH-SQJ8nPrnwqQ7hLUOvvVVVcfZYF-5o4g1pKd6E5ulSceNW1AgSXcONMnV10yzzaJAICxI-_tb-7e77PZcIX4PJqrEi-KCJyrcwMR8Bjfhprx1bvwShRZuJ4DbFvXtXstk2tUeGi3AWQKS96p3q-cpE-6yhovqt1UFfK43VqGzA8bKIrDCgRaLBp1KRXQl-f2U98",
    alt: "Elegant wooden catio structure attached to a modern home",
  },
  {
    icon: Home,
    title: "Dog Houses",
    sub: "Ground-level sanctuaries.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBobxB7jgoZYTf3XtqNuO-iSxhNVbfGEiM2KPc7oaCsOd-ptMngRlUq9zFz0TtiokMAc094_gWa_84qS0hoh-PEFpLRRFXZFYOCph4yb0c5xWhM1ko3gODI88mVUhJx5mfS3-VKq802p4rP1UIYBF6cXkPAw-CMTqbhmRv6_XUeeUM6taaSLR2kAhUlA33Bni4ZCnugEldMUrXbTY1rL_Y2he4V-ufCQImWjnUHPJenMCNh-jfYM5HZdrPTL88Rk4OkGNzOpqx_E5k",
    alt: "Modern architectural dog house with cedar wood siding",
  },
  {
    icon: Fence,
    title: "Kennels",
    sub: "Robust perimeter comfort.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBnEMXXycrQT8mTXandpOIWbMsSBIw1Yj4wgWu3cn1tTJr_A9g17DzqG3ANuDsUiBsoyd7e1z30YSEcF0VUOg8HbugxDToy1PliUxJNBJKFyexo2I1yFrY-iPs6ujqKdh6CMp0PS504KxCBWGJf57DlT_YKTdP06DJKNTokTuaaQBKObs8OHC_bmHljE-VCKQjLZ4ZKitoZHSgn12SjnIKYN_0olbZLcBFniBGd9YiAFKaH8cgpXmraB-RwLz5WokQU4LNaHbAX0tA",
    alt: "Spacious outdoor dog kennel with reinforced steel accents",
  },
  {
    icon: GitBranch,
    title: "Tunnels",
    sub: "Interconnected pathways.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA3gJpKo9vaQbv7pW-FE3QFlApsuSHSHi4X-UWBknK4UbH_nR-09YkP_ZFQ-PabZ4YI6L1TAqiTTVeV35dbOX84KvfzJRCHvMwQx5_KHsNaBOMsHEkGoHKteUjObapOqpXprPW8yVHLiLdYHXKWcaUxzl7i8BRT5N9YzZbpMhqlkaFQpubhsE0QtFowSE0fj1qGFm47HnTM1OlOchHarmo0QVqX7FF6TQqB1wGb7HXHMAiWcoEGaFsgFqwJo-6PMqwrKYwmMGBTHLQ",
    alt: "Wooden tunnel through a landscaped garden for small animals",
  },
];

const GALLERY = [
  {
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD_6xoOOmJB2Eoo8n2oo7oJQt84RzQe0w5gvhrLDPk5-neqVsHtCL2qo2FU6HLHLGLRKv9rDdkMEmTXYkWPN-gP00eh6wz0SMn1543i8a6aQyzsmUYDaSb7t32i6_mvy8D_JOjqEIKg-TCfkxz0f1a81g3L8MN0JRM8VqxI8vVS8PSE-3WhE1ex7jacHSx17ilavV9NdLYxioM6C5l1YHxOQGQ58Ah_pPrWCTdyYbmERdyRDgzt1qi5xW21gCD8GlS-ZQ566Tifk0Q",
    alt: "Close up of high quality wood joinery in a premium outdoor pet environment",
    aspect: "aspect-square",
  },
  {
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCMNfh34yA5fXk4N0ARYncFCliouheqfOez5CQQ8m9MXkbjlQc1MjSe0H1s1_24Z0WEzYYVb8UQvolxmDXHeWM6FRfK5K5ShfgFgkQPzqIsnQ_cAFFlbO2CpFLBvJXru6sHXoeJ_kjIjjVkfWi59ffX9maXN46q7TJ-Y7l_JI0Q_-LSiRplVbpTtRikmM1ksPCkUP9YXsx3yglUEqGrqJSvdlK_3dLSm1xxkcHCcNBuF6N1JfH757C0bMVLNRnb6FEb6f4T49BA7eY",
    alt: "A small designer dog house nestled under a large oak tree",
    aspect: "aspect-[3/4]",
  },
  {
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBsHbVfbFJoaCKK_c95mF1i0n-6kIsNresg0oArJIzDyd2ZUdLM1BqDDHlLyVZLogWH8ieFD_8gLG-UzaAd74tUfTB5jg47o6UsL2_1933XAEA3VvkYhwIs3jT697qEhJQg9F6-n2OKpyGuNr7IxY06hZh9xf0RByX5fkKVBccjICN5oHyANpEalzvGZsL1dBuXntiQ5DuCaNf2XIInOlrbZofbP_fNWwgCnSc8OVcbmgybS_8YEr2Spbl2my6qfz-_Z9XrkKpVg9Y",
    alt: "A happy dog sitting in front of its modern wooden home at dusk",
    aspect: "aspect-[4/5]",
  },
  {
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC0mdsZ0ifdm6yCesSH_Kq6Ke04eCSyZCdbHVhVGa_ijP-uFhewrgriBA_48IoyROa7Ho0dwF59aO5xY67UVXkXKPx_5WQAlUAcApO9RIOefnYY07tjrB92Ab3WgAKprfeSw-Gn6YbUG7qwReUn76kZaxvfa2j99C38g3SlUTuF2IOSSTUYlFHdqmTrtqFuSHmk5n7aRE-KD6soBQQBYiwtZestAErVQsaFO-V38uoWMYHetruW1FvaZfKFI4DB8sZUEqLEwFfLKZw",
    alt: "Minimalist cat climbing wall with natural wood finishes",
    aspect: "aspect-square",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Initial Consultation",
    body: "We assess your terrain, your pet\u2019s specific needs, and your home\u2019s aesthetic to draft the first blueprint.",
  },
  {
    num: "02",
    title: "Design & Invoicing",
    body: "Refining the 3D model. Transparent pricing and material selection before we cut a single plank.",
  },
  {
    num: "03",
    title: "Artisanal Build",
    body: "Our craftsmen assemble your project using weather-resistant, sustainable materials in our studio.",
  },
  {
    num: "04",
    title: "On-Site Fitting",
    body: "Final installation and structural anchoring. We ensure the environment is safe, stable, and ready for exploration.",
  },
];

export default function HomePage() {
  return (
    <div className="bg-surface text-on-surface">
      {/* ── Floating Nav ── */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl rounded-xl bg-surface/80 backdrop-blur-[20px] shadow-[0_20px_50px_rgba(25,28,27,0.06)] z-50 flex justify-between items-center px-8 py-3">
        <Link
          href="/"
          className="mt-1 text-[28px] font-bold font-headline text-emerald-900"
        >
          Denhaus
        </Link>
        <nav className="hidden md:flex items-center gap-10">
          <a
            href="#process"
            className="label-style text-xs font-medium text-emerald-700 hover:text-primary "
          >
            Process
          </a>
          <Link
            href="/gallery"
            className="label-style text-xs font-medium text-on-surface-variant hover:text-primary transition-colors"
          >
            Portfolio
          </Link>
          <a
            href="#collections"
            className="label-style text-xs font-medium text-on-surface-variant hover:text-primary transition-colors"
          >
            Collections
          </a>
          <Link
            href="/admin/dashboard"
            className="hidden label-style text-xs font-medium text-on-surface-variant hover:text-primary transition-colors"
          >
            Admin
          </Link>
        </nav>
        <Link
          href="/contact"
          className="bg-primary text-on-primary px-6 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 active:scale-95 transition-all duration-200"
        >
          Get Started
        </Link>
      </header>

      <main>
        {/* ── Hero ── */}
        <section className="relative min-h-screen flex items-center pt-48 pb-16 overflow-hidden">
          <div className="absolute inset-0 z-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="Luxurious modern dog house integrated into a lush forest landscape"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3Hg5tRcVOOUDZD84s7URLnJ2GxmcNVZDyMHBmrQ43T4i6HYjTNSs1f5VzZDh0E1xN4pn6Mh6Ul3eiOEpRhK5Lp_Gz2pK_99wR7IZdHOramc10eCUbdwP2UjWGcZ_t5vG-oT5yloSSvfoEqsYN6cRq46pJIGwOJBT4QhEWpX3yeWA1QCpY1okG9dFtJY05C8uucVgbLBDPlQ3EagwMpEOQ3OQX5xONYr5tEMySVcAr3Few6kn-eu2N9sRNg55ShH8KeiSQ2dDkOoM"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/60 to-transparent" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-8 w-full">
            <div className="max-w-2xl">
              <span className="hidden label-style text-primary-fixed-dim text-sm font-semibold mb-4 block">
                Denhaus Studio
              </span>
              <h1 className="text-6xl md:text-8xl text-white font-light leading-none mb-8 mt-3">
                Elevated <span className="italic">Outdoor Living</span> for Your
                Pets.
              </h1>
              <p className="text-white/80 text-xl font-light mb-10 max-w-lg leading-relaxed">
                Architectural sanctuaries crafted with sustainable timber and
                modern precision. Because nature belongs to them too.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/contact"
                  className="bg-secondary text-on-secondary px-8 py-4 rounded-lg text-lg font-medium hover:opacity-90 transition-all flex items-center justify-center"
                >
                  Start Your Project
                </Link>
                <Link
                  href="/gallery"
                  className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-lg text-lg font-medium hover:bg-white/20 transition-all flex items-center justify-center"
                >
                  Explore Designs
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Product Categories ── */}
        <section id="collections" className="py-32 bg-surface">
          <div className="max-w-7xl mx-auto px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
              <div className="max-w-xl">
                <span className="label-style text-primary text-sm font-bold mb-4 block">
                  Collections
                </span>
                <h2 className="text-5xl text-on-surface">
                  Precision Built for Every Instinct.
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {CATEGORIES.map(({ icon: Icon, title, sub, img, alt }) => (
                <div
                  key={title}
                  className="group relative aspect-[3/4] bg-surface-container overflow-hidden rounded-xl"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt={alt}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    src={img}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <Icon
                      className="w-6 h-6 text-white mb-2"
                      strokeWidth={1.5}
                    />
                    <h3 className="text-white text-2xl font-headline">
                      {title}
                    </h3>
                    <p className="text-white/60 text-sm mt-1">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Portfolio Gallery ── */}
        <section className="py-32 bg-surface-container-low">
          <div className="max-w-7xl mx-auto px-8">
            <div className="grid grid-cols-12 gap-8 items-start">
              <div className="col-span-12 lg:col-span-4 lg:sticky lg:top-32">
                <span className="label-style text-primary text-sm font-bold mb-4 block">
                  The Studio Portfolio
                </span>
                <h2 className="text-5xl mb-8">Architectural Works.</h2>
                <p className="text-on-surface-variant text-lg leading-relaxed mb-10">
                  Our projects are more than structures; they are permanent
                  installations that harmonize with your home&#39;s existing
                  architecture.
                </p>
                <Link
                  href="/gallery"
                  className="flex items-center gap-4 text-primary font-bold label-style hover:gap-6 transition-all group"
                >
                  View More Projects
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
              <div className="col-span-12 lg:col-span-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    {GALLERY.slice(0, 2).map((item) => (
                      <div
                        key={item.alt}
                        className={`bg-surface-container rounded-xl overflow-hidden ${item.aspect}`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          alt={item.alt}
                          className="w-full h-full object-cover"
                          src={item.img}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="space-y-4 pt-12">
                    {GALLERY.slice(2, 4).map((item) => (
                      <div
                        key={item.alt}
                        className={`bg-surface-container rounded-xl overflow-hidden ${item.aspect}`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          alt={item.alt}
                          className="w-full h-full object-cover"
                          src={item.img}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Process ── */}
        <section id="process" className="py-32 bg-primary text-white">
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-center max-w-2xl mx-auto mb-24">
              <span className="label-style text-primary-fixed-dim text-sm font-bold mb-4 block">
                The Blueprint
              </span>
              <h2 className="text-5xl font-light">Our Path to Quality.</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              {STEPS.map(({ num, title, body }) => (
                <div key={num} className="relative">
                  <div className="text-6xl font-headline text-white/10 absolute -top-8 -left-4 select-none">
                    {num}
                  </div>
                  <h4 className="text-xl font-headline mb-4">{title}</h4>
                  <p className="text-white/60 text-sm leading-relaxed">
                    {body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className="py-32 bg-surface overflow-hidden relative">
          <div className="max-w-7xl mx-auto px-8 text-center">
            <div className="bg-surface-container-high rounded-2xl py-24 px-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -mr-32 -mt-32" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -ml-32 -mb-32" />
              <h2 className="text-5xl md:text-6xl mb-8 max-w-2xl mx-auto relative">
                Ready to build something special?
              </h2>
              <p className="text-on-surface-variant text-xl mb-12 max-w-xl mx-auto relative">
                Serving the San Fernando Valley through Ventura County. Limited
                commissions accepted each season.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center relative">
                <Link
                  href="/contact"
                  className="bg-primary text-on-primary px-10 py-5 rounded-lg text-lg font-bold transition-all hover:scale-105 active:scale-95"
                >
                  Contact Our Studio
                </Link>
                <p className="text-on-surface-variant/60 text-sm font-medium label-style">
                  Chatsworth to Thousand Oaks
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-8 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="font-headline text-xl text-primary mb-6">
              Denhaus
            </div>
            <p className="text-on-surface-variant max-w-sm text-sm leading-relaxed mb-8">
              Design studio for outdoor pet environments. Catios, dog houses,
              kennels, and enclosures engineered for the coyote corridor.
            </p>
            <p className="text-on-surface-variant text-sm italic">
              © {new Date().getFullYear()} Denhaus LLC. All rights reserved.
            </p>
          </div>
          <div>
            <h5 className="label-style text-xs font-bold text-primary mb-6">
              Experience
            </h5>
            <ul className="space-y-4">
              <li>
                <a
                  href="#process"
                  className="text-on-surface-variant text-sm hover:text-primary underline decoration-secondary/30 transition-all"
                >
                  Process
                </a>
              </li>
              <li>
                <Link
                  href="/gallery"
                  className="text-on-surface-variant text-sm hover:text-primary underline decoration-secondary/30 transition-all"
                >
                  Portfolio
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-on-surface-variant text-sm hover:text-primary underline decoration-secondary/30 transition-all"
                >
                  Get a Quote
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="label-style text-xs font-bold text-primary mb-6">
              Admin
            </h5>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/admin/dashboard"
                  className="text-on-surface-variant text-sm hover:text-primary underline decoration-secondary/30 transition-all"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/leads"
                  className="text-on-surface-variant text-sm hover:text-primary underline decoration-secondary/30 transition-all"
                >
                  Leads
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/jobs"
                  className="text-on-surface-variant text-sm hover:text-primary underline decoration-secondary/30 transition-all"
                >
                  Jobs
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
