import { Inject } from '@nestjs/common';

const DI_DATABASE_TOKEN = 'DATABASE';

export const InjectDatabase = () => Inject(DI_DATABASE_TOKEN);
export const getDatabaseToken = () => DI_DATABASE_TOKEN;
