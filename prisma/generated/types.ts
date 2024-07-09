import type { ColumnType } from 'kysely';

export type Generated<T> =
  T extends ColumnType<infer S, infer I, infer U>
    ? ColumnType<S, I | undefined, U>
    : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

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
