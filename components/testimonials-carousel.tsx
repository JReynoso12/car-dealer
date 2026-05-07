"use client";

import { useEffect, useMemo, useState } from "react";
import { testimonials } from "@/lib/data/testimonials";

export function TestimonialsCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = testimonials.length;

  const active = useMemo(() => testimonials[index], [index]);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % count);
    }, 3500);
    return () => clearInterval(timer);
  }, [count, paused]);

  const prev = () => setIndex((i) => (i - 1 + count) % count);
  const next = () => setIndex((i) => (i + 1) % count);

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:px-10 md:py-20">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="heading-lg text-white">What our customers say</h2>
          <p className="mt-2 text-zinc-300">4.9/5 from 312 reviews</p>
        </div>
        <a href="#" className="text-sm text-zinc-300 underline underline-offset-4">Read all reviews</a>
      </div>

      <div
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-6"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="transition duration-500">
          <article className="mx-auto max-w-3xl px-10 sm:px-12">
            <p className="text-amber-300">{"★".repeat(active.rating)}{"☆".repeat(5 - active.rating)}</p>
            <p className="mt-4 text-base text-zinc-100 sm:text-lg">{active.review}</p>
            <div className="mt-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-cyan-500/30 text-sm font-semibold">
                {active.name
                  .split(" ")
                  .map((chunk) => chunk[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{active.name}</p>
                <p className="text-xs text-zinc-400">{active.city} · {active.date}</p>
              </div>
            </div>
          </article>
        </div>

        <button
          onClick={prev}
          className="absolute left-3 top-1/2 inline-flex min-h-11 min-w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40"
          aria-label="Previous testimonial"
        >
          ←
        </button>
        <button
          onClick={next}
          className="absolute right-3 top-1/2 inline-flex min-h-11 min-w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40"
          aria-label="Next testimonial"
        >
          →
        </button>
      </div>

      <div className="mt-5 flex items-center justify-center gap-2">
        {testimonials.map((item, dotIdx) => (
          <button
            key={item.id}
            onClick={() => setIndex(dotIdx)}
            aria-label={`Go to review ${dotIdx + 1}`}
            className={`min-h-3 min-w-3 rounded-full transition ${dotIdx === index ? "bg-white w-7" : "bg-white/35 w-3"}`}
          />
        ))}
      </div>
    </section>
  );
}
