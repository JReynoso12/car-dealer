"use client";

import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";

type HeroSectionProps = {
  showLoader: boolean;
};

export function HeroSection({ showLoader }: HeroSectionProps) {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const scrubSectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const frameListRef = useRef<string[]>([]);
  const preloadedImagesRef = useRef<HTMLImageElement[]>([]);
  const targetFrameRef = useRef(0);
  const currentFrameRef = useRef(0);
  const activeFrameRef = useRef(0);
  const [scrollPercent, setScrollPercent] = useState(0);

  const drawFrameToCanvas = (img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const targetWidth = Math.max(1, Math.round(rect.width * dpr));
    const targetHeight = Math.max(1, Math.round(rect.height * dpr));
    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imageRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = targetWidth / targetHeight;
    let sx = 0;
    let sy = 0;
    let sw = img.naturalWidth;
    let sh = img.naturalHeight;

    if (imageRatio > canvasRatio) {
      sw = img.naturalHeight * canvasRatio;
      sx = (img.naturalWidth - sw) / 2;
    } else {
      sh = img.naturalWidth / canvasRatio;
      sy = (img.naturalHeight - sh) / 2;
    }

    ctx.clearRect(0, 0, targetWidth, targetHeight);
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, targetWidth, targetHeight);
  };

  useEffect(() => {
    let mounted = true;
    const loadFrames = async () => {
      try {
        const res = await fetch("/api/frames", { cache: "no-store" });
        const data = (await res.json()) as { frames?: string[] };
        const frames = data.frames ?? [];
        if (!mounted || frames.length === 0) return;

        const preload = await Promise.all(
          frames.map(
            (src) =>
              new Promise<HTMLImageElement | null>((resolve) => {
                const img = new window.Image();
                img.onload = () => resolve(img);
                img.onerror = () => resolve(null);
                img.src = src;
              }),
          ),
        );
        const images = preload.filter((img): img is HTMLImageElement => img !== null);
        if (!mounted || images.length === 0) return;
        frameListRef.current = frames.slice(0, images.length);
        preloadedImagesRef.current = images;
        drawFrameToCanvas(images[0]);
      } catch {
        // keep hero fallback visuals
      }
    };
    loadFrames();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const animate = () => {
      const images = preloadedImagesRef.current;
      if (images.length > 0) {
        const delta = targetFrameRef.current - currentFrameRef.current;
        const easedStep = delta * (isMobile ? 0.09 : 0.06);
        const maxStep = isMobile ? 1.5 : 1.2;
        currentFrameRef.current +=
          Math.sign(easedStep) * Math.min(Math.abs(easedStep), maxStep);
        if (Math.abs(delta) < 0.05) currentFrameRef.current = targetFrameRef.current;
        const idx = Math.max(
          0,
          Math.min(images.length - 1, Math.round(currentFrameRef.current)),
        );
        if (idx !== activeFrameRef.current) {
          activeFrameRef.current = idx;
          drawFrameToCanvas(images[idx]);
        }
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    const updateScroll = () => {
      const section = scrubSectionRef.current;
      if (!section || frameListRef.current.length === 0) return;
      const rect = section.getBoundingClientRect();
      const total = Math.max(section.offsetHeight - window.innerHeight, 1);
      const progress = Math.min(Math.max(-rect.top / total, 0), 1);
      targetFrameRef.current = progress * (frameListRef.current.length - 1);
      setScrollPercent(progress * 100);
      document.documentElement.style.setProperty("--scroll-y", String(window.scrollY));
    };

    const handleResize = () => {
      updateScroll();
      const images = preloadedImagesRef.current;
      if (images.length > 0) {
        const idx = Math.max(0, Math.min(images.length - 1, Math.round(currentFrameRef.current)));
        drawFrameToCanvas(images[idx]);
      }
    };

    updateScroll();
    rafRef.current = requestAnimationFrame(animate);
    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", handleResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isMobile]);

  return (
    <section ref={scrubSectionRef} className={`relative ${isMobile ? "h-[280vh]" : "h-[340vh]"}`}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-60" aria-label="Car frame sequence" />
        <div className="hero-glow absolute inset-0" />
      </div>

      <div className="pointer-events-none absolute left-0 top-0 z-10 h-screen w-full">
        <div className="mx-auto flex h-full max-w-6xl flex-col justify-between px-6 py-12 md:px-10">
          <div className="max-w-3xl pt-24 md:pt-32">
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-300">Premium Car Dealer Experience</p>
            <h1 className="heading-xl mt-4 text-white">Scroll. Drive. Feel Every Curve In 3D.</h1>
            <p className="mt-4 max-w-xl text-zinc-200">
              Explore elite performance cars through a cinematic, immersive website powered by React and Next.js.
            </p>
            <p className="mt-4 text-xs uppercase tracking-[0.25em] text-zinc-300">Scroll Progress: {scrollPercent.toFixed(0)}%</p>
            {showLoader ? null : (
              <p className="mt-2 text-xs text-zinc-400">Frame sequence optimized for desktop scrubbing.</p>
            )}
          </div>

          <div className="mobile-snap-stats pb-8">
            {[
              ["120+", "Cars Ready"],
              ["4.9/5", "Dealer Rating"],
              ["24H", "VIP Support"],
            ].map(([value, label]) => (
              <div key={label} className="glass snap-start rounded-2xl p-4 text-center">
                <p className="text-2xl font-semibold">{value}</p>
                <p className="text-xs uppercase tracking-widest text-zinc-300">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
