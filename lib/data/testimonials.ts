export type Testimonial = {
  id: string;
  rating: number;
  name: string;
  city: string;
  date: string;
  review: string;
};

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    rating: 5,
    name: "Carlos M.",
    city: "Makati",
    date: "Mar 2026",
    review:
      "The team handled everything professionally from financing to delivery. The car looked even better in person, and the test drive process was seamless. I would absolutely buy here again.",
  },
  {
    id: "t2",
    rating: 5,
    name: "Angela R.",
    city: "Pasig",
    date: "Feb 2026",
    review:
      "I loved how transparent the pricing was. No hidden charges and very responsive updates while my papers were being processed. The showroom experience felt premium and stress-free.",
  },
  {
    id: "t3",
    rating: 4,
    name: "Jerome T.",
    city: "Taguig",
    date: "Jan 2026",
    review:
      "Great quality inventory and friendly staff. They walked me through each option and gave clear advice based on my budget. Delivery took a little longer than expected but still worth it.",
  },
  {
    id: "t4",
    rating: 5,
    name: "Bea S.",
    city: "Quezon City",
    date: "Dec 2025",
    review:
      "I came in just to browse and left with my dream car reserved the same day. Their digital walkthrough and financing estimator were really helpful. Highly recommended dealership.",
  },
  {
    id: "t5",
    rating: 5,
    name: "Noel P.",
    city: "Cebu",
    date: "Nov 2025",
    review:
      "Excellent communication from start to finish. The car was exactly as advertised, and they honored every commitment they made. Service quality was consistently top tier.",
  },
  {
    id: "t6",
    rating: 4,
    name: "Kristine L.",
    city: "Davao",
    date: "Oct 2025",
    review:
      "Very smooth purchase process with clear financing options. The dealership staff made me feel comfortable asking detailed questions. Overall, one of the best buying experiences I have had.",
  },
];
