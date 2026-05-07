"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const inventory = [
  {
    name: "Dodge Phantom GT",
    price: "$89,900",
    year: "2026",
    drive: "AWD",
    image: "/car-front.jpeg",
  },
  {
    name: "Dodge Nova RS",
    price: "$74,500",
    year: "2025",
    drive: "RWD",
    image: "/car-side.jpeg",
  },
];

export default function Home() {
  const scrubSectionRef = useRef<HTMLElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const frameListRef = useRef<string[]>([]);
  const targetFrameRef = useRef(0);
  const currentFrameRef = useRef(0);
  const activeFrameRef = useRef("/car-front.jpeg");
  const [scrollPercent, setScrollPercent] = useState(0);
  const [activeFrameSrc, setActiveFrameSrc] = useState<string>("/car-front.jpeg");
  const [framesReady, setFramesReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadFrameManifest = async () => {
      try {
        const res = await fetch("/api/frames", { cache: "no-store" });
        const data = (await res.json()) as { frames?: string[] };
        const frames = data.frames ?? [];

        if (!mounted || frames.length === 0) return;

        const preloadResults = await Promise.all(
          frames.map(
            (src) =>
              new Promise<boolean>((resolve) => {
                const img = new window.Image();
                img.onload = () => resolve(true);
                img.onerror = () => resolve(false);
                img.src = src;
              }),
          ),
        );

        const readyFrames = frames.filter((_, idx) => preloadResults[idx]);
        if (!mounted || readyFrames.length === 0) return;

        frameListRef.current = readyFrames;
        targetFrameRef.current = 0;
        currentFrameRef.current = 0;
        activeFrameRef.current = readyFrames[0];
        setActiveFrameSrc(readyFrames[0]);
        setFramesReady(true);
      } catch {
        // Keep fallback still image when frames cannot be loaded.
      }
    };

    loadFrameManifest();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const animate = () => {
      const frames = frameListRef.current;
      if (frames.length > 0) {
        // Lerp toward the frame target with capped step for luxury-grade smoothness.
        const delta = targetFrameRef.current - currentFrameRef.current;
        const easedStep = delta * 0.06;
        const maxStep = 1.2;
        const clampedStep = Math.sign(easedStep) * Math.min(Math.abs(easedStep), maxStep);
        currentFrameRef.current += clampedStep;

        if (Math.abs(delta) < 0.05) {
          currentFrameRef.current = targetFrameRef.current;
        }

        const frameIndex = Math.max(
          0,
          Math.min(frames.length - 1, Math.round(currentFrameRef.current)),
        );
        const src = frames[frameIndex];
        if (src && src !== activeFrameRef.current) {
          activeFrameRef.current = src;
          setActiveFrameSrc(src);
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    const updateScroll = () => {
      document.documentElement.style.setProperty(
        "--scroll-y",
        String(window.scrollY),
      );

      const section = scrubSectionRef.current;
      const frames = frameListRef.current;
      if (!section || frames.length === 0) return;

      const rect = section.getBoundingClientRect();
      const total = Math.max(section.offsetHeight - window.innerHeight, 1);
      const progressed = Math.min(Math.max(-rect.top / total, 0), 1);
      targetFrameRef.current = progressed * (frames.length - 1);

      setScrollPercent(progressed * 100);
    };

    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("resize", updateScroll);

    return () => {
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", updateScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <main className="bg-[#040406] text-white">
      <section
        ref={scrubSectionRef}
        className="relative h-[340vh]"
      >
        <div className="sticky top-0 h-screen overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={activeFrameSrc}
            alt="Car sequence frame"
            className="absolute inset-0 h-full w-full object-cover opacity-60"
            loading="eager"
          />
          <div className="hero-glow absolute inset-0" />
          {!framesReady ? (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/35">
              <p className="rounded-full border border-white/35 px-5 py-2 text-xs uppercase tracking-[0.2em] text-zinc-200">
                Loading animation frames...
              </p>
            </div>
          ) : null}
        </div>
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-screen w-full">
          <div className="mx-auto flex h-full max-w-6xl flex-col justify-between px-6 py-12 md:px-10">
          <header className="flex items-center justify-between">
            <p className="text-sm tracking-[0.35em] text-zinc-300">CARWEB</p>
            <a className="rounded-full border border-white/40 px-5 py-2 text-sm transition hover:bg-white hover:text-black" href="#inventory">
              View Inventory
            </a>
          </header>

          <div className="max-w-3xl">
            <p className="mb-5 text-sm uppercase tracking-[0.3em] text-zinc-300">
              Premium Car Dealer Experience
            </p>
            <h1 className="text-5xl font-semibold leading-tight md:text-7xl">
              Scroll. Drive. Feel Every Curve In 3D.
            </h1>
            <p className="mt-6 max-w-xl text-base text-zinc-200 md:text-lg">
              Explore elite performance cars through a cinematic, immersive
              website powered by React and Next.js.
            </p>
            <p className="mt-4 text-sm uppercase tracking-[0.25em] text-zinc-300">
              Scroll Progress: {scrollPercent.toFixed(0)}%
            </p>
          </div>

          <div className="grid max-w-xl grid-cols-3 gap-4 text-center">
            <div className="glass rounded-2xl p-4">
              <p className="text-2xl font-semibold">120+</p>
              <p className="text-xs uppercase tracking-widest text-zinc-300">
                Cars Ready
              </p>
            </div>
            <div className="glass rounded-2xl p-4">
              <p className="text-2xl font-semibold">4.9/5</p>
              <p className="text-xs uppercase tracking-widest text-zinc-300">
                Dealer Rating
              </p>
            </div>
            <div className="glass rounded-2xl p-4">
              <p className="text-2xl font-semibold">24H</p>
              <p className="text-xs uppercase tracking-widest text-zinc-300">
                VIP Support
              </p>
            </div>
          </div>
        </div>
        </div>
      </section>

      <section className="perspective-wrapper relative min-h-[140vh] px-6 py-24 md:px-10">
        <div className="mx-auto grid max-w-6xl items-center gap-14 md:grid-cols-2">
          <div className="space-y-5">
            <p className="text-sm uppercase tracking-[0.3em] text-zinc-400">
              Scroll Driven Story
            </p>
            <h2 className="text-4xl leading-tight md:text-5xl">
              Motion Reacts To Every Scroll
            </h2>
            <p className="max-w-xl text-zinc-300">
              This experience uses layered depth, cinematic gradients, and
              dynamic transforms to create an immersive 3D showroom feel while
              you move through the page.
            </p>
          </div>

          <div className="relative h-[500px]">
            <div className="scroll-card card-back absolute left-10 top-8 h-[300px] w-[220px] overflow-hidden rounded-2xl">
              <Image
                src="/car-side.jpeg"
                alt="Car side profile"
                fill
                sizes="220px"
                className="object-cover"
              />
            </div>
            <div className="scroll-card card-front absolute right-0 top-24 h-[360px] w-[270px] overflow-hidden rounded-2xl">
              <Image
                src="/car-front.jpeg"
                alt="Car front profile"
                fill
                sizes="270px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="inventory" className="mx-auto max-w-6xl px-6 py-20 md:px-10">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-zinc-400">
              Featured Inventory
            </p>
            <h3 className="mt-3 text-4xl font-semibold">Available Now</h3>
          </div>
          <a className="text-sm text-zinc-300 underline underline-offset-4" href="#">
            Schedule Test Drive
          </a>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {inventory.map((car) => (
            <article key={car.name} className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5">
              <div className="relative h-72 w-full">
                <Image
                  src={car.image}
                  alt={car.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="space-y-4 p-6">
                <h4 className="text-2xl font-semibold">{car.name}</h4>
                <div className="flex justify-between text-zinc-300">
                  <span>{car.year}</span>
                  <span>{car.drive}</span>
                  <span className="font-medium text-white">{car.price}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
