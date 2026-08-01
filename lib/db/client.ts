import { PrismaClient } from '@/prisma/generated/client';

const prismaClientSingleton = () => {
  return new PrismaClient({
    // Query logging is a development aid; in production it writes every
    // statement (and its parameters) to the server log.
    log:
      process.env.NODE_ENV === 'production'
        ? ['warn', 'error']
        : ['query', 'info', 'warn', 'error'],
  });
};

// biome-ignore lint/suspicious/noShadowRestrictedNames: i don't remember why we have to shadow this
declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;
