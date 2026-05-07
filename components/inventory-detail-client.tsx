"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Car } from "@/lib/data/cars";

type InventoryDetailClientProps = {
  car: Car;
  relatedCars: Car[];
};

export function InventoryDetailClient({ car, relatedCars }: InventoryDetailClientProps) {
  const [selectedImage, setSelectedImage] = useState(car.gallery[0] ?? car.image);
  const [compareAdded, setCompareAdded] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [downPayment, setDownPayment] = useState(10000);
  const [term, setTerm] = useState(60);
  const [interestRate, setInterestRate] = useState(7.2);

  const monthlyPayment = useMemo(() => {
    const principal = Math.max(0, car.price - downPayment);
    const monthlyRate = interestRate / 100 / 12;
    if (monthlyRate === 0) return principal / term;
    const numerator = principal * monthlyRate * (1 + monthlyRate) ** term;
    const denominator = (1 + monthlyRate) ** term - 1;
    return numerator / denominator;
  }, [car.price, downPayment, interestRate, term]);

  const handleCompare = () => {
    const key = "compareCars";
    const raw = localStorage.getItem(key);
    const list: string[] = raw ? JSON.parse(raw) : [];
    if (!list.includes(car.slug)) {
      list.push(car.slug);
      localStorage.setItem(key, JSON.stringify(list));
    }
    setCompareAdded(true);
  };

  return (
    <main className="bg-[#040406] text-white">
      <section className="relative mx-auto max-w-7xl px-4 pb-10 pt-10 sm:px-6 md:px-10 md:pb-12 md:pt-12">
        <div className="relative h-[42vh] min-h-[320px] w-full overflow-hidden rounded-3xl border border-white/10">
          <Image src={selectedImage} alt={car.name} fill sizes="100vw" className="object-cover" />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 md:gap-3">
          {car.gallery.map((img) => (
            <button
              key={img}
              className={`relative h-16 overflow-hidden rounded-xl border ${selectedImage === img ? "border-cyan-300" : "border-white/20"}`}
              onClick={() => setSelectedImage(img)}
            >
              <Image src={img} alt={car.name} fill sizes="120px" className="object-cover" />
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-16 sm:px-6 md:grid-cols-2 md:px-10 md:pb-20">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-zinc-400">{car.year}</p>
          <h1 className="heading-lg mt-2">{car.name}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-cyan-300/40 bg-cyan-400/15 px-3 py-1 text-xs">{car.drive}</span>
            <span className="text-2xl font-semibold">${car.price.toLocaleString()}</span>
          </div>

          <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full text-sm">
              <tbody>
                {Object.entries(car.specs).map(([key, value]) => (
                  <tr key={key} className="border-b border-white/10 last:border-0">
                    <td className="px-4 py-3 capitalize text-zinc-400">{key.replace(/([A-Z])/g, " $1")}</td>
                    <td className="px-4 py-3 text-right text-zinc-100">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex min-h-11 items-center rounded-full bg-cyan-400 px-5 text-sm font-semibold text-black"
            >
              Book a Test Drive
            </button>
            <button
              onClick={handleCompare}
              className="inline-flex min-h-11 items-center rounded-full border border-white/30 px-5 text-sm"
            >
              {compareAdded ? "Added to Compare" : "Compare"}
            </button>
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h2 className="text-xl font-semibold">Monthly Payment Estimator</h2>
          <div className="mt-4 space-y-4 text-sm">
            <label className="block">
              Down payment
              <input
                type="number"
                value={downPayment}
                onChange={(e) => setDownPayment(Number(e.target.value))}
                className="mt-1 h-11 w-full rounded-lg border border-white/20 bg-black/30 px-3"
              />
            </label>
            <label className="block">
              Loan term
              <select
                value={term}
                onChange={(e) => setTerm(Number(e.target.value))}
                className="mt-1 h-11 w-full rounded-lg border border-white/20 bg-black/30 px-3"
              >
                {[24, 36, 48, 60, 72].map((option) => (
                  <option key={option} value={option}>
                    {option} months
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              Interest rate (%)
              <input
                type="number"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="mt-1 h-11 w-full rounded-lg border border-white/20 bg-black/30 px-3"
              />
            </label>
          </div>
          <p className="mt-5 text-3xl font-semibold">${monthlyPayment.toFixed(0)}<span className="text-sm font-normal text-zinc-300"> / month</span></p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 md:px-10">
        <h2 className="heading-lg">Related Cars</h2>
        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
          {relatedCars.map((related) => (
            <Link key={related.slug} href={`/inventory/${related.slug}`} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-lg font-semibold">{related.name}</p>
              <p className="text-sm text-zinc-300">{related.year} · {related.drive}</p>
              <p className="mt-3 text-xl font-semibold">${related.price.toLocaleString()}</p>
            </Link>
          ))}
        </div>
      </section>

      {showModal ? (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0a0f18] p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Book a Test Drive</h3>
              <button className="min-h-11 min-w-11 rounded-lg border border-white/20" onClick={() => setShowModal(false)}>
                X
              </button>
            </div>
            <div className="space-y-3">
              <input className="h-11 w-full rounded-lg border border-white/20 bg-black/30 px-3" placeholder="Full name" />
              <input className="h-11 w-full rounded-lg border border-white/20 bg-black/30 px-3" placeholder="Email" />
              <input className="h-11 w-full rounded-lg border border-white/20 bg-black/30 px-3" placeholder="Phone" />
              <button className="mt-2 inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-cyan-400 text-sm font-semibold text-black">
                Submit Booking
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
