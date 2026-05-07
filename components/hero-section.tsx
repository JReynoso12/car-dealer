"use client";

import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";

type HeroSectionProps = {
  showLoader: boolean;
};

const HERO_CROP_ZOOM = 1.03;
const HERO_FOCAL_X = 0.44;
const HERO_FOCAL_Y = 0.46;
const DETAIL_TRANSITION_MS = 1080;
const RENDER_DPR_MULTIPLIER = 1.2;
const MAX_RENDER_DPR = 3;
const FRAME_DAMPING_DESKTOP = 0.14;
const FRAME_DAMPING_MOBILE = 0.18;

type FrameDetail = {
  id: string;
  kicker: string;
  title: string;
  description: string;
  specs: [string, string][];
  startPercent: number;
  endPercent: number;
};

const FRAME_DETAILS: FrameDetail[] = [
  {
    id: "front-design",
    kicker: "Aero Front",
    title: "Aggressive Front Design",
    description: "The wide grille and hood lines establish the Dodge performance identity instantly.",
    specs: [
      ["Airflow Focus", "Dual intake channels"],
      ["Visual Character", "Sculpted hood line"],
    ],
    startPercent: 0,
    endPercent: 16,
  },
  {
    id: "lighting-signature",
    kicker: "Signature Lights",
    title: "Precision LED Expression",
    description: "LED accents sharpen the front identity while improving nighttime visibility.",
    specs: [
      ["Light Design", "Performance DRL pattern"],
      ["Night Presence", "High-contrast beam shape"],
    ],
    startPercent: 16,
    endPercent: 32,
  },
  {
    id: "side-muscle",
    kicker: "Body Line",
    title: "Muscular Side Profile",
    description: "Strong proportions and sharp character lines emphasize a planted, athletic silhouette.",
    specs: [
      ["Stance", "Wide and road-planted"],
      ["Profile", "Long shoulder contour"],
    ],
    startPercent: 32,
    endPercent: 48,
  },
  {
    id: "wheel-presence",
    kicker: "Performance Wheels",
    title: "Wheel And Brake Presence",
    description: "Wheel fitment and brake details reinforce control, grip, and performance intent.",
    specs: [
      ["Grip Focus", "Performance tire setup"],
      ["Brake Feel", "Responsive stopping power"],
    ],
    startPercent: 48,
    endPercent: 64,
  },
  {
    id: "rear-signature",
    kicker: "Rear Design",
    title: "Signature Rear Presence",
    description: "Distinctive rear lighting and stance create a memorable, performance-focused finish.",
    specs: [
      ["Rear Identity", "Continuous light signature"],
      ["Road Stance", "Lower visual center"],
    ],
    startPercent: 64,
    endPercent: 82,
  },
  {
    id: "performance-finish",
    kicker: "Final Reveal",
    title: "Performance In Every Angle",
    description: "From start to finish, the rotation highlights the car's power, balance, and craftsmanship.",
    specs: [
      ["Engineering Feel", "Track-inspired dynamics"],
      ["Craft Detail", "Precision exterior finishes"],
    ],
    startPercent: 82,
    endPercent: 101,
  },
];

export function HeroSection({ showLoader }: HeroSectionProps) {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const scrubSectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const scrollRafRef = useRef<number | null>(null);
  const frameListRef = useRef<string[]>([]);
  const preloadedImagesRef = useRef<HTMLImageElement[]>([]);
  const targetFrameRef = useRef(0);
  const currentFrameRef = useRef(0);
  const activeFrameRef = useRef(0);
  const [scrollPercent, setScrollPercent] = useState(0);
  const [activeDetail, setActiveDetail] = useState<FrameDetail>(FRAME_DETAILS[0]);
  const [showDetail, setShowDetail] = useState(true);
  const detailTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const heroMoveRatio = Math.min(1, Math.max(0, scrollPercent / 100));
  const heroTextTravel = (heroMoveRatio - 0.5) * (isMobile ? 32 : 72);
  const heroTextOpacity = Math.max(1.18, 1 - Math.abs(heroMoveRatio - 1.5) * 1.35);
  const activeDetailIndex = Math.max(
    0,
    FRAME_DETAILS.findIndex((detail) => detail.id === activeDetail.id),
  );

  const drawFrameToCanvas = (img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(MAX_RENDER_DPR, (window.devicePixelRatio || 1) * RENDER_DPR_MULTIPLIER);
    const targetWidth = Math.max(1, Math.round(rect.width * dpr));
    const targetHeight = Math.max(1, Math.round(rect.height * dpr));
    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

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

    // Gentle zoom/crop to keep edge watermark regions out of frame.
    const zoomedSw = sw / HERO_CROP_ZOOM;
    const zoomedSh = sh / HERO_CROP_ZOOM;
    const focalSx = sx + (sw - zoomedSw) * HERO_FOCAL_X;
    const focalSy = sy + (sh - zoomedSh) * HERO_FOCAL_Y;
    sx = Math.min(Math.max(0, focalSx), img.naturalWidth - zoomedSw);
    sy = Math.min(Math.max(0, focalSy), img.naturalHeight - zoomedSh);
    sw = zoomedSw;
    sh = zoomedSh;

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
        const damping = isMobile ? FRAME_DAMPING_MOBILE : FRAME_DAMPING_DESKTOP;
        currentFrameRef.current += delta * damping;
        if (Math.abs(delta) < 0.02) currentFrameRef.current = targetFrameRef.current;
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

    const scheduleScrollUpdate = () => {
      if (scrollRafRef.current !== null) return;
      scrollRafRef.current = requestAnimationFrame(() => {
        scrollRafRef.current = null;
        updateScroll();
      });
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
    window.addEventListener("scroll", scheduleScrollUpdate, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", scheduleScrollUpdate);
      window.removeEventListener("resize", handleResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (scrollRafRef.current !== null) cancelAnimationFrame(scrollRafRef.current);
    };
  }, [isMobile]);

  useEffect(() => {
    const nextDetail =
      FRAME_DETAILS.find(
        (detail) => scrollPercent >= detail.startPercent && scrollPercent < detail.endPercent,
      ) ?? FRAME_DETAILS[FRAME_DETAILS.length - 1];
    if (nextDetail.id === activeDetail.id) return;

    const hideDetailTimer = setTimeout(() => {
      setShowDetail(false);
    }, 0);
    if (detailTimerRef.current) clearTimeout(detailTimerRef.current);
    detailTimerRef.current = setTimeout(() => {
      setActiveDetail(nextDetail);
      setShowDetail(true);
    }, DETAIL_TRANSITION_MS);

    return () => {
      clearTimeout(hideDetailTimer);
    };
  }, [activeDetail.id, scrollPercent]);

  useEffect(() => {
    return () => {
      if (detailTimerRef.current) clearTimeout(detailTimerRef.current);
    };
  }, []);

  return (
    <section ref={scrubSectionRef} className={`relative ${isMobile ? "h-[240dvh]" : "h-[200vh]"}`}>
      <div className="sticky top-0 h-[100dvh] overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full opacity-80" aria-label="Car frame sequence" />
      </div>

      <div className="pointer-events-none absolute left-0 top-0 z-10 h-[100dvh] w-full">
        <div
          className="mx-auto flex h-full max-w-6xl flex-col justify-between px-4 py-10 sm:px-6 md:px-10"
          style={{
            transform: `translateY(${heroMoveRatio * 86}px) scale(${1 - heroMoveRatio * 0.06})`,
            transformOrigin: "center top",
          }}
        >
          <div
            className="max-w-3xl pt-24 transition-all duration-500 ease-out md:pt-32"
            style={{
              opacity: heroTextOpacity,
              transform: `translateX(${heroTextTravel}px)`,
            }}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-300">Premium Car Dealer Experience</p>
            <h1 className="heading-xl mt-3 text-white">Scroll. Drive. Feel Every Curve Of Dodge.</h1>
            <p className="mt-3 max-w-xl text-sm text-zinc-200 md:text-base">
              Explore elite performance cars through a cinematic, immersive showcasing powered by Dodge.
            </p>
            {showLoader ? null : (
              <p className="mt-2 text-xs text-zinc-400">Power, Elegance and Performance.</p>
            )}
          </div>

          <div
            className="max-w-xl rounded-2xl border border-white/20 bg-black/35 p-3 backdrop-blur-md md:p-5"
            style={{
              opacity: showDetail ? 1 : 0,
              transform: `translateY(${showDetail ? 0 : 12}px)`,
              transition: `opacity ${DETAIL_TRANSITION_MS}ms ease, transform ${DETAIL_TRANSITION_MS}ms ease`,
            }}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-[10px] uppercase tracking-[0.28em] text-zinc-300">Frame Detail</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">
                {activeDetailIndex + 1}/{FRAME_DETAILS.length}
              </p>
            </div>
            <p className="mt-2 text-xs uppercase tracking-[0.22em] text-zinc-300">{activeDetail.kicker}</p>
            <h3 className="mt-2 text-sm font-semibold text-white md:text-xl">{activeDetail.title}</h3>
            <p className="mt-2 text-xs text-zinc-200 md:text-base">{activeDetail.description}</p>
            <div className="mt-3 grid gap-2 md:grid-cols-2">
              {activeDetail.specs.map(([label, value]) => (
                <div key={label} className="rounded-xl border border-white/10 bg-black/25 px-3 py-2">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-400">{label}</p>
                  <p className="mt-1 text-xs text-zinc-200">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mobile-snap-stats pb-5 md:pb-8">
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
