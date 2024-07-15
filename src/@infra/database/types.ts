export type ReservationConcert = {
  id: string;
  seats: string;
};

export type AvailableSeat = {
  id: string;
  concertId: string;
  seatNumber: number;
};

export type ManagementConcert = {
  id: string;
  title: string;
  description: string;
  date: string;
  seatingCapacity?: number;
};

export type DB = {
  ['reservation__available_seats']: AvailableSeat;
  ['reservation__concerts']: ReservationConcert;
  ['management__concerts']: ManagementConcert;
};
