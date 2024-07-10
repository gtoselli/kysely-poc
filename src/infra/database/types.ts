export type Concert = {
  id: string;
  seats: string;
};

export type AvailableSeat = {
  id: string;
  concertId: string;
  seatNumber: number;
  concertTitle: string;
};

export type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'concert' | 'show';
  seatingCapacity?: number;
};

export type DB = {
  available_seats: AvailableSeat;
  concerts: Concert;
  events: Event;
};
