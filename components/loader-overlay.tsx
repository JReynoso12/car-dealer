"use client";

import { useEffect, useMemo, useState } from "react";

type LoaderOverlayProps = {
  isMobile: boolean;
};

export function LoaderOverlay({ isMobile }: LoaderOverlayProps) {
  const [hidden, setHidden] = useState(() => {
    if (typeof window === "undefined") return true;
    return sessionStorage.getItem("hasLoaded") === "true";
  });
  const [progress, setProgress] = useState(0);
  const [showSkip, setShowSkip] = useState(false);

  const totalDuration = useMemo(() => (isMobile ? 1200 : 1800), [isMobile]);

  useEffect(() => {
    if (hidden) return;

    const startedAt = performance.now();
    const skipTimer = window.setTimeout(() => setShowSkip(true), 800);

    const raf = () => {
      const elapsed = performance.now() - startedAt;
      const next = Math.min(100, (elapsed / 1500) * 100);
      setProgress(next);

      if (elapsed >= totalDuration) {
        sessionStorage.setItem("hasLoaded", "true");
        setHidden(true);
        return;
      }

      requestAnimationFrame(raf);
    };

    const rafId = requestAnimationFrame(raf);
    return () => {
      window.clearTimeout(skipTimer);
      cancelAnimationFrame(rafId);
    };
  }, [hidden, totalDuration]);

  if (hidden) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[120] flex items-center justify-center bg-[#05070e]"
    >
      <div className="w-[min(92vw,480px)] text-center">
        <p className="animate-pulse text-sm tracking-[0.35em] text-zinc-100">CARWEB</p>
        <div className="mt-8 h-1 w-full overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-cyan-300 transition-[width] duration-150" style={{ width: `${progress}%` }} />
        </div>
        {showSkip ? (
          <button
            className="mt-6 inline-flex min-h-11 items-center rounded-full border border-white/30 px-5 text-xs uppercase tracking-[0.2em] text-zinc-100"
            onClick={() => {
              sessionStorage.setItem("hasLoaded", "true");
              setHidden(true);
            }}
          >
            Skip
          </button>
        ) : null}
      </div>
    </div>
  );
}
