const team = [
  { name: "Elijah Cruz", title: "General Manager", bio: "Leads dealership operations with a focus on trust and customer experience." },
  { name: "Mara Santos", title: "Sales Director", bio: "Specializes in matching drivers with premium performance vehicles." },
  { name: "Kevin Yu", title: "Finance Lead", bio: "Designs financing plans tailored to every budget profile." },
  { name: "Angela Dizon", title: "After-Sales Manager", bio: "Ensures smooth ownership with top-tier support and maintenance." },
];

const awards = ["Certified Dealer 2024", "Customer Choice 2025", "Top Sales Partner", "Service Excellence"];

export default function AboutPage() {
  return (
    <main className="bg-[#040406] text-white">
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:px-10">
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-300">Founded 2010</p>
        <h1 className="heading-xl mt-3">CARWEB Motors</h1>
        <p className="mt-4 max-w-2xl text-zinc-300">Delivering premium vehicles with transparent deals and human-first service.</p>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:px-10">
        <div className="glass rounded-3xl p-7">
          <h2 className="heading-lg">Our story</h2>
          <div className="mt-4 space-y-4 text-zinc-300">
            <p>STREET CAR started as a small showroom built around a simple promise: premium cars should come with premium trust.</p>
            <p>Over the years, we expanded into a full-service dealership known for transparent pricing, careful inspections, and a smooth buying process for modern drivers.</p>
            <p>Today, we continue to evolve with digital tools and immersive experiences while staying committed to honest service.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:px-10">
        <div className="mobile-snap-stats">
          {[
            ["15+", "Years in business"],
            ["7,800+", "Cars sold"],
            ["6,200+", "Satisfied customers"],
            ["28", "Awards won"],
          ].map(([value, label]) => (
            <div key={label} className="glass snap-start rounded-2xl p-4 text-center">
              <p className="text-2xl font-semibold">{value}</p>
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-300">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:px-10">
        <h2 className="heading-lg">Our team</h2>
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((member) => (
            <article key={member.name} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="mb-3 h-36 rounded-xl bg-zinc-800/80" />
              <p className="font-semibold">{member.name}</p>
              <p className="text-sm text-cyan-200">{member.title}</p>
              <p className="mt-2 text-sm text-zinc-300">{member.bio}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 md:px-10">
        <h2 className="heading-lg">Awards & certifications</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {awards.map((award) => (
            <div key={award} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-6 text-center text-sm text-zinc-200">
              {award}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 pt-8 sm:px-6 md:px-10">
        <h2 className="heading-lg">Our values</h2>
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            ["Transparency", "Clear pricing, clear terms, and clear communication."],
            ["Quality", "Only vehicles that pass strict quality and service checks."],
            ["Service", "Fast response, guided process, and long-term support."],
          ].map(([title, description]) => (
            <article key={title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm text-cyan-200">●</p>
              <h3 className="mt-2 text-xl font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-zinc-300">{description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
