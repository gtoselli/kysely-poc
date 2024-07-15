import { Inject } from '@nestjs/common';

export const DI_DATABASE_TOKEN = 'DATABASE';

export const InjectDatabase = () => Inject(DI_DATABASE_TOKEN);
