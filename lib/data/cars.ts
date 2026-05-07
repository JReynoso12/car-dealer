export type TrustBadge = "New" | "Certified Pre-Owned" | "Hot Deal" | "Low Mileage";

export type CarSpec = {
  engine: string;
  horsepower: string;
  torque: string;
  zeroToSixty: string;
  fuelType: string;
  seatingCapacity: string;
  color: string;
};

export type Car = {
  slug: string;
  name: string;
  price: number;
  year: number;
  drive: string;
  mileage?: number;
  badge: TrustBadge;
  warrantyIncluded?: boolean;
  stockCount: number;
  image: string;
  gallery: string[];
  shortDescription: string;
  specs: CarSpec;
};

export const cars: Car[] = [
  {
    slug: "dodge-phantom-gt",
    name: "Dodge Phantom GT",
    price: 89900,
    year: 2026,
    drive: "AWD",
    badge: "New",
    warrantyIncluded: true,
    stockCount: 3,
    image: "/car-front.jpeg",
    gallery: ["/car-front.jpeg", "/car-side.jpeg", "/car-front.jpeg", "/car-side.jpeg"],
    shortDescription:
      "A flagship grand touring coupe with aggressive styling and a comfort-focused cockpit.",
    specs: {
      engine: "3.0L Twin-Turbo V6",
      horsepower: "420 hp",
      torque: "470 lb-ft",
      zeroToSixty: "4.2 sec",
      fuelType: "Premium Gasoline",
      seatingCapacity: "5",
      color: "Onyx Black",
    },
  },
  {
    slug: "dodge-nova-rs",
    name: "Dodge Nova RS",
    price: 74500,
    year: 2025,
    drive: "RWD",
    badge: "Hot Deal",
    warrantyIncluded: true,
    stockCount: 1,
    image: "/car-side.jpeg",
    gallery: ["/car-side.jpeg", "/car-front.jpeg", "/car-side.jpeg", "/car-front.jpeg"],
    shortDescription: "Track-inspired sedan delivering sharp handling and modern tech.",
    specs: {
      engine: "2.5L Turbo I4",
      horsepower: "355 hp",
      torque: "390 lb-ft",
      zeroToSixty: "4.8 sec",
      fuelType: "Premium Gasoline",
      seatingCapacity: "5",
      color: "Graphite Silver",
    },
  },
  {
    slug: "dodge-avalon-cpo",
    name: "Dodge Avalon CPO",
    price: 52900,
    year: 2023,
    drive: "AWD",
    mileage: 24500,
    badge: "Certified Pre-Owned",
    warrantyIncluded: true,
    stockCount: 2,
    image: "/car-front.jpeg",
    gallery: ["/car-front.jpeg", "/car-side.jpeg", "/car-front.jpeg", "/car-side.jpeg"],
    shortDescription:
      "Certified pre-owned performance sedan with complete service records and inspection.",
    specs: {
      engine: "2.0L Turbo I4",
      horsepower: "310 hp",
      torque: "330 lb-ft",
      zeroToSixty: "5.3 sec",
      fuelType: "Premium Gasoline",
      seatingCapacity: "5",
      color: "Midnight Blue",
    },
  },
  {
    slug: "dodge-comet-lx",
    name: "Dodge Comet LX",
    price: 46800,
    year: 2022,
    drive: "FWD",
    mileage: 18700,
    badge: "Low Mileage",
    stockCount: 4,
    image: "/car-side.jpeg",
    gallery: ["/car-side.jpeg", "/car-front.jpeg", "/car-side.jpeg", "/car-front.jpeg"],
    shortDescription:
      "Comfort-oriented luxury trim with low mileage and premium interior appointments.",
    specs: {
      engine: "2.0L Hybrid",
      horsepower: "245 hp",
      torque: "260 lb-ft",
      zeroToSixty: "6.7 sec",
      fuelType: "Hybrid",
      seatingCapacity: "5",
      color: "Pearl White",
    },
  },
];

export function getCarBySlug(slug: string) {
  return cars.find((car) => car.slug === slug);
}

export function getRelatedCars(slug: string) {
  return cars.filter((car) => car.slug !== slug).slice(0, 3);
}
