import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { EmailChannelProvider } from '../src/communication/channels/email-channel.provider';
import { GenericContainer, StartedTestContainer } from 'testcontainers';
import { ManagementController } from '../src/management/api/management.controller';
import { ReservationController } from '../src/reservation/api/reservation.controller';
import { execSync } from 'child_process';

describe('App (e2e)', () => {
  let app: INestApplication;
  let managementController: ManagementController;
  let reservationController: ReservationController;
  let postgresContainer: StartedTestContainer;

  const EmailChannelProviderMock = { send: jest.fn() };

  beforeAll(async () => {
    postgresContainer = await new GenericContainer('postgres:latest')
      .withExposedPorts({ host: 5432, container: 5432 })
      .withEnvironment({ POSTGRES_PASSWORD: 'password' })
      .start();

    execSync(`pnpm exec prisma migrate dev`, {
      stdio: 'inherit',
    });

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(EmailChannelProvider)
      .useValue(EmailChannelProviderMock)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    managementController = app.get(ManagementController);
    reservationController = app.get(ReservationController);
  });

  afterAll(async () => {
    await app.close();
    await postgresContainer.stop({ remove: true });
  });

  describe('Given no concerts', () => {
    describe('When create a concert', () => {
      let concertId: string;

      beforeEach(async () => {
        const { id } = await managementController.createConcert({
          title: 'Marracash',
          date: '20 novembre 2024',
          description: 'Noi, Loro, Gli Altri Tour',
          seatingCapacity: 100,
        });
        concertId = id;
      });

      it('should be listed in concerts list (in management BC)', async () => {
        const concerts = await managementController.getConcerts();

        expect(concerts).toHaveLength(1);
        expect(concerts[0]).toMatchObject({
          title: 'Marracash',
        });
      });

      it('all places must be available (in reservation BC)', async () => {
        const availableSeats = await reservationController.getAvailableSeats(concertId);

        expect(availableSeats).toHaveLength(100);
      });
    });
  });

  describe('Given a scheduled concert', () => {
    let concertId: string;

    beforeEach(async () => {
      const { id } = await managementController.createConcert({
        title: 'Marracash',
        date: '20 novembre 2024',
        description: 'Noi, Loro, Gli Altri Tour',
        seatingCapacity: 100,
      });
      concertId = id;
    });

    describe('When reserve seat', () => {
      beforeEach(async () => {
        await reservationController.reserveSeat(concertId, { seatNumber: 1 });
      });

      it('reserved seat must not be shown as available', async () => {
        const availableSeats = await reservationController.getAvailableSeats(concertId);

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
