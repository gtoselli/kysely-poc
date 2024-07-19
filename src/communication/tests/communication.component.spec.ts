import { Test, TestingModule } from '@nestjs/testing';
import { EmailChannelProvider } from '../channels/email-channel.provider';
import { CommunicationCommandBus } from '../communication.command-bus';
import { SendReservationConfirmationCommand } from '../commands/send-reservation-confirmation.command';
import { SendReservationConfirmationCommandHandler } from '../commands/send-reservation-confirmation.command-handler';

describe('Communication', () => {
  let module: TestingModule;
  let communicationCommandBus: CommunicationCommandBus;

  const EmailChannelProviderMock = {
    send: jest.fn(),
  };

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [],
      providers: [
        CommunicationCommandBus,
        { provide: EmailChannelProvider, useValue: EmailChannelProviderMock },
        SendReservationConfirmationCommandHandler,
      ],
    }).compile();

    await module.init();

    communicationCommandBus = module.get(CommunicationCommandBus);
  });

  afterAll(async () => {
    await module.close();
  });

  describe('sendReservationConfirmation', () => {
    it('should send a reservation confirmation email', async () => {
      await communicationCommandBus.send(new SendReservationConfirmationCommand({ concertTitle: 'Tailor Swift' }));

      expect(EmailChannelProviderMock.send).toBeCalledWith(
        'toselli.gabriele@gmail.com',
        '[CONCERTOSE] Reservation Confirmation',
        'You have successfully reserved a seat for the concert Tailor Swift',
      );
    });
  });
});
