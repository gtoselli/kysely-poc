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

export type ManagementConcert = {
  id: string;
  title: string;
  description: string;
  date: string;
  seatingCapacity?: number;
};

export type DB = {
  available_seats: AvailableSeat;
  concerts: Concert;
  management_concerts: ManagementConcert;
};
