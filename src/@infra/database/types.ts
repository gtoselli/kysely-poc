import { PrismaClient } from '@prisma/client';
import * as runtime from '@prisma/client/runtime/library';

export type Database = PrismaClient;
export type Transaction = Omit<PrismaClient, runtime.ITXClientDenyList>;
