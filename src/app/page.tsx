export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-[#04030a] text-white">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      <div className="cosmos-bg" aria-hidden />
      <div className="cosmos-stars" aria-hidden />
      <div className="cosmos-grid" aria-hidden />

      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 md:px-10">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full border border-cyan-300/70 bg-cyan-300/20 shadow-[0_0_24px_rgba(34,211,238,0.45)]" />
          <span className="text-xs tracking-[0.2em] text-cyan-100/90 sm:text-sm sm:tracking-[0.28em]">FUTURE FOOD CLUB</span>
        </div>
        <a href="#join-form" className="chip-link">
          Join Waitlist
        </a>
      </header>

      <main id="main-content">
        <section className="relative mx-auto max-w-6xl px-6 pb-20 pt-8 md:px-10 md:pb-28 md:pt-16">
          <p className="mb-5 inline-flex rounded-full border border-violet-300/35 bg-violet-300/12 px-4 py-1 text-xs uppercase tracking-[0.22em] text-violet-100/90">
            Private Beta • Metro Access
          </p>

          <h1 className="max-w-4xl text-balance text-5xl font-semibold leading-[0.97] tracking-tight sm:text-6xl lg:text-7xl">
            The future of not paying for food is here
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-relaxed text-blue-100/90 sm:text-lg">
            Earn meals through presence, community missions, and smart local partnerships. Orbit through premium spots,
            unlock daily drops, and eat like a member—not a customer.
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
            <a href="#join-form" className="cta-primary">
              Join Now
            </a>
            <a href="#how" className="cta-secondary">
              Explore How It Works
            </a>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {[
              ['57+', 'Partner kitchens'],
              ['4.9', 'Member experience score'],
              ['24/7', 'Drop windows in major zones'],
            ].map(([value, label]) => (
              <div key={label} className="glass-panel">
                <p className="text-2xl font-semibold text-cyan-100">{value}</p>
                <p className="mt-1 text-sm text-blue-100/85">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-10 md:px-10" id="concept">
          <div className="section-title-wrap">
            <p className="section-kicker">Concept</p>
            <h2 className="section-title">A premium food protocol for the social era</h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              {
                title: 'Presence Rewards',
                body: 'Check in, attend pop-up moments, and convert movement into meal credit in real time.',
              },
              {
                title: 'Local Luxury Partners',
                body: 'From craft bowls to chef-led tasting counters, curated by city and community demand.',
              },
              {
                title: 'Mission Economy',
                body: 'Complete social and neighborhood missions to unlock higher-tier menus and surprise drops.',
              },
            ].map((item) => (
              <article key={item.title} className="feature-card">
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-14 md:px-10" id="how">
          <div className="section-title-wrap">
            <p className="section-kicker">How it works</p>
            <h2 className="section-title">Three steps to your first free plate</h2>
          </div>
          <div className="timeline mt-9">
            {[
              ['01', 'Reserve Access', 'Secure your city pass and pick your food districts.'],
              ['02', 'Complete Missions', 'Earn meal credits through events, referrals, and local actions.'],
              ['03', 'Claim Drops', 'Use credits at partner venues and premium pop-ups instantly.'],
            ].map(([step, title, desc]) => (
              <div key={step} className="timeline-item">
                <span>{step}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-24 pt-8 md:px-10" id="join">
          <div className="join-panel">
            <p className="section-kicker">Limited seats</p>
            <h2>Join Now</h2>
            <p>
              Early members get priority partner access, boosted mission multipliers, and city founder perks.
            </p>
            <form id="join-form" className="join-form" action="#" method="post">
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Enter your email"
              />
              <button type="submit" className="cta-primary" aria-label="Join Now with your email">
                Join Now
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
