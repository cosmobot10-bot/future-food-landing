export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#04030a] text-white">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      <div className="cosmos-bg" aria-hidden />
      <div className="cosmos-stars" aria-hidden />
      <div className="cosmos-grid" aria-hidden />

      <main
        id="main-content"
        className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl items-center px-6 py-16 md:px-10"
      >
        <section className="w-full text-center">
          <p className="mx-auto mb-6 inline-flex rounded-full border border-violet-300/35 bg-violet-300/12 px-4 py-1 text-xs uppercase tracking-[0.22em] text-violet-100/90">
            Future Food Club • Private Beta
          </p>

          <h1 className="mx-auto max-w-4xl text-balance text-5xl font-semibold leading-[0.97] tracking-tight sm:text-6xl lg:text-7xl">
            The future of not paying for food is here
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-blue-100/90 sm:text-lg">
            A space-age membership for premium local meals. Complete missions, unlock partner drops, and eat like a
            member—not a customer.
          </p>

          <div className="mt-10">
            <a
              href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-primary"
            >
              Launch Mission
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
