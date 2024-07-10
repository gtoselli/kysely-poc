import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { DI_DATABASE_URI_TOKEN } from '../src/@infra';
import { ReservationService } from '../src/reservation/reservation.service';
import { ManagementService } from '../src/management/management.service';
import { EmailChannelProvider } from '../src/communication/channels/email-channel.provider';

describe('App (e2e)', () => {
  let app: INestApplication;
  let managementService: ManagementService;
  let reservationService: ReservationService;

  const EmailChannelProviderMock = { send: jest.fn() };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(DI_DATABASE_URI_TOKEN)
      .useValue(':memory:')
      .overrideProvider(EmailChannelProvider)
      .useValue(EmailChannelProviderMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    managementService = app.get(ManagementService);
    reservationService = app.get(ReservationService);
  });

  describe('Given no concerts', () => {
    describe('When create a concert', () => {
      let concertId: string;

      beforeEach(async () => {
        const { id } = await managementService.createConcert(
          'Marracash',
          '20 novembre 2024',
          'Noi, Loro, Gli Altri Tour',
          100,
        );
        concertId = id;
      });

      it('should be listed in concerts list (in management BC)', async () => {
        const concerts = await managementService.listConcerts();

        expect(concerts).toHaveLength(1);
        expect(concerts[0]).toMatchObject({
          title: 'Marracash',
        });
      });

      it('all places must be available (in reservation BC)', async () => {
        const availableSeats = await reservationService.getAvailableSeats(concertId);

        expect(availableSeats).toHaveLength(100);
      });
    });
  });

  describe('Given a scheduled concert', () => {
    let concertId: string;

    beforeEach(async () => {
      const { id } = await managementService.createConcert(
        'Marracash',
        '20 novembre 2024',
        'Noi, Loro, Gli Altri Tour',
        100,
      );
      concertId = id;
    });

    describe('When reserve seat', () => {
      beforeEach(async () => {
        await reservationService.reserveSeat(concertId, 1);
      });

      it('reserved seat must not be shown as available', async () => {
        const availableSeats = await reservationService.getAvailableSeats(concertId);

        expect(availableSeats).toHaveLength(99);
      });

      it('should send confirmation email', () => {
        expect(EmailChannelProviderMock.send).toHaveBeenCalledWith(
          'toselli.gabriele@gmail.com',
          '[CONCERTOSE] Reservation Confirmation',
          expect.stringContaining('You have successfully reserved a seat for the concert'),
        );
      });
    });
  });
});
