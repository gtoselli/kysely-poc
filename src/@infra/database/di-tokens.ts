import { Inject } from '@nestjs/common';

export const DI_DATABASE_TOKEN = 'DATABASE';
export const DI_DATABASE_URI_TOKEN = 'DATABASE_URI';

export const InjectDatabase = () => Inject(DI_DATABASE_TOKEN);
