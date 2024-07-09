export type AvailableSeat = {
  id: string;
  concertId: string;
  seatNumber: number;
};

export type Concert = {
  id: string;
  title: string;
  seats: string;
};

export type DB = {
  available_seats: AvailableSeat;
  concerts: Concert;
};
