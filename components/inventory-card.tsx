"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Car, TrustBadge } from "@/lib/data/cars";

const badgeClasses: Record<TrustBadge, string> = {
  New: "bg-blue-500/90 text-white",
  "Certified Pre-Owned": "bg-emerald-500/90 text-white",
  "Hot Deal": "bg-red-500/90 text-white",
  "Low Mileage": "bg-amber-500/90 text-black",
};

type InventoryCardProps = {
  car: Car;
  priority?: boolean;
};

export function InventoryCard({ car, priority = false }: InventoryCardProps) {
  const [saved, setSaved] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(`fav-${car.slug}`) === "true";
  });

  const toggleSaved = () => {
    const next = !saved;
    setSaved(next);
    localStorage.setItem(`fav-${car.slug}`, String(next));
  };

  return (
    <article className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5">
      <div className="relative h-72 w-full">
        <Image
          src={car.image}
          alt={car.name}
          fill
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${badgeClasses[car.badge]}`}>
          {car.badge}
        </span>
        <button
          onClick={toggleSaved}
          aria-label="Toggle favorite"
          className="absolute right-3 top-3 inline-flex min-h-11 min-w-11 items-center justify-center rounded-full bg-black/55 text-white"
        >
          {saved ? "♥" : "♡"}
        </button>
      </div>

      <div className="space-y-3 p-5">
        <Link href={`/inventory/${car.slug}`} className="text-2xl font-semibold hover:text-cyan-200">
          {car.name}
        </Link>
        <p className="text-sm text-zinc-300">{car.shortDescription}</p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-zinc-300">
          <span>{car.year}</span>
          <span>{car.drive}</span>
          {car.mileage ? <span>{car.mileage.toLocaleString()} mi</span> : null}
          <span className="font-semibold text-white">${car.price.toLocaleString()}</span>
        </div>
        {car.warrantyIncluded ? (
          <p className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-500/15 px-3 py-1 text-xs text-emerald-300">
            Warranty Included
          </p>
        ) : null}
        {car.stockCount === 1 ? (
          <p className="inline-flex rounded-full border border-red-400/30 bg-red-500/15 px-3 py-1 text-xs text-red-200">
            Limited
          </p>
        ) : null}
      </div>
    </article>
  );
}
