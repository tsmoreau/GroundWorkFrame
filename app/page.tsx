import Link from "next/link";

export default function HomePage() {
  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col">
      {/* ── Nav ── */}
      <header className="w-full max-w-3xl mx-auto px-8 pt-8 pb-4">
        <nav className="flex justify-between items-center">
          <Link
            href="/"
            className="text-3xl pl-4 font-semibold font-headline text-primary"
          >
            Denhaus
          </Link>
          <Link
            href="/contact"
            className="hidden bg-primary text-on-primary px-5 py-2 rounded text-sm font-medium hover:opacity-90 transition-all active:scale-95"
          >
            Get in Touch
          </Link>
        </nav>
      </header>

      {/* ── Hero ── */}
      <main className="flex-1 flex items-center justify-center px-8">
        <div className="max-w-2xl w-full pt-32 pb-16 md:py-0">
          <h1 className="text-5xl md:text-7xl font-headline font-light text-primary leading-[1.1] mb-8">
            Outdoor pet
            <br />
            <span className="italic">environments,</span>
            <br />
            designed &amp; built.
          </h1>

          <p className="text-on-surface-variant text-lg md:text-xl font-light leading-relaxed max-w-lg mb-4">
            Catios, dog houses, kennels, enclosures, and more. Desgined and
            built for<span className="italic"> your </span> home and{" "}
            <span className="italic">your</span> space.
          </p>

          <p className="text-on-surface-variant/60 text-sm label-style font-semibold">
            Chatsworth&ensp;·&ensp;West
            Hills&ensp;·&ensp;Calabasas&ensp;·&ensp;Thousand Oaks
          </p>

          <Link
            href="/contact"
            className="mt-8 inline-flex items-center gap-3 bg-primary text-on-primary px-8 py-4 rounded text-base font-medium hover:opacity-90 transition-all active:scale-95"
          >
            Start a Project
          </Link>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="px-8 py-8">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-sm text-on-surface-variant/60">
          <p>© {new Date().getFullYear()} Denhaus</p>
          <p>San Fernando Valley&ensp;·&ensp;Ventura County</p>
        </div>
      </footer>
    </div>
  );
}
