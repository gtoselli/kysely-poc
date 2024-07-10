import { Test, TestingModule } from '@nestjs/testing';
import { CommunicationService } from '../communication.service';
import { EmailChannelProvider } from '../channels/email-channel.provider';

describe('Communication', () => {
  let module: TestingModule;
  let service: CommunicationService;

  const EmailChannelProviderMock = {
    send: jest.fn(),
  };

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [],
      providers: [CommunicationService, { provide: EmailChannelProvider, useValue: EmailChannelProviderMock }],
    }).compile();

    await module.init();

    service = module.get(CommunicationService);
  });

  afterAll(async () => {
    await module.close();
  });

  describe('sendReservationConfirmation', () => {
    it('should send a reservation confirmation email', async () => {
      await service.sendReservationConfirmation('Tailor Swift');

      expect(EmailChannelProviderMock.send).toBeCalledWith(
        'toselli.gabriele@gmail.com',
        '[CONCERTOSE] Reservation Confirmation',
        'You have successfully reserved a seat for the concert Tailor Swift',
      );
    });
  });
});
