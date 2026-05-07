import { InventoryCard } from "@/components/inventory-card";
import { cars } from "@/lib/data/cars";

export default function InventoryPage() {
  return (
    <main className="mx-auto max-w-6xl bg-[#040406] px-4 py-16 text-white sm:px-6 md:px-10">
      <p className="text-xs uppercase tracking-[0.3em] text-zinc-300">Inventory</p>
      <h1 className="heading-lg mt-3">All Cars</h1>
      <p className="mt-3 max-w-2xl text-zinc-300">
        Explore our current lineup of premium performance vehicles.
      </p>
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        {cars.map((car) => (
          <InventoryCard key={car.slug} car={car} />
        ))}
      </div>
    </main>
  );
}
