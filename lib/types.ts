export type SeatStatus =
  | "tersedia"
  | "digunakan"
  | "ditinggalkan";

export type Seat = {
  id: string;
  number: number;
  status: SeatStatus;
};

export type Venue = {
  id: string;
  name: string;
  category: string;
  location: string;
  description: string;
  totalSeats: number;
  seats: Seat[];
};