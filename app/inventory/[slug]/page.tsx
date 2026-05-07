import { notFound } from "next/navigation";
import { InventoryDetailClient } from "@/components/inventory-detail-client";
import { getCarBySlug, getRelatedCars } from "@/lib/data/cars";

type InventoryDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function InventoryDetailPage({ params }: InventoryDetailPageProps) {
  const { slug } = await params;
  const car = getCarBySlug(slug);
  if (!car) notFound();

  const relatedCars = getRelatedCars(slug);
  return <InventoryDetailClient car={car} relatedCars={relatedCars} />;
}
