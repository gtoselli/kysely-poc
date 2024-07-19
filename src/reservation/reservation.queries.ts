import { Injectable } from '@nestjs/common';
import { AvailableSeatsRepo } from './available-seats.repo';

@Injectable()
export class ReservationQueries {
  constructor(private readonly availableSeatsRepo: AvailableSeatsRepo) {}

  public async getAvailableSeats(id: string) {
    return await this.availableSeatsRepo.getByConcertId(id);
  }
}
