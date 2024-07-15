import { ConcertsRepo } from './concerts.repo';
import { Injectable } from '@nestjs/common';
import { ConcertAggregate } from './domain/concert.aggregate';
import { AvailableSeatsRepo } from './available-seats.repo';
import { ManagementConcert } from '../@infra';
import { CommunicationService } from '../communication/communication.service';

@Injectable()
export class ReservationService {
  constructor(
    private readonly repo: ConcertsRepo,
    private readonly availableSeatsRepo: AvailableSeatsRepo,
    private readonly communicationService: CommunicationService,
  ) {
    this.repo.setTransactionalHook(async (trx, concertModel) => {
      await this.availableSeatsRepo.onConcertSaved(trx, concertModel);
    });
  }

  public async reserveSeat(id: string, seatNumber: number) {
    const concert = await this.getById(id);

    concert.reserveSeat(seatNumber);
    await this.repo.saveAndSerialize(concert);

    await this.communicationService.onConcertSeatReserved(concert.id, seatNumber);
  }

  public async getAvailableSeats(id: string) {
    return await this.availableSeatsRepo.getByConcertId(id);
  }

  public async onConcertCreated(concert: ManagementConcert) {
    await this.create(concert.id, concert.seatingCapacity);
  }

  private async getById(id: string) {
    const concert = await this.repo.getByIdAndDeserialize(id);
    if (!concert) throw new Error(`Concert ${id} not found`);
    return concert;
  }

  private async create(concertId: string, seatingCapacity: number) {
    const concert = ConcertAggregate.factory(concertId, seatingCapacity);

    await this.repo.saveAndSerialize(concert);
    return { id: concert.id };
  }
}
