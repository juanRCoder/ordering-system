import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as dotenv from 'dotenv';

dotenv.config();

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.categories.createMany({
    data: [
      {
        id: 'f48a2179-ae44-4b00-88ad-9ffc1e9f8508',
        name: 'platos',
        created_at: new Date('2026-05-13T22:57:00.39Z'),
        updated_at: new Date('2026-06-13T05:57:00.39Z'),
      },
      {
        id: 'a767c232-0fd3-44df-b6a6-da25988698d1',
        name: 'bebidas',
        created_at: new Date('2026-06-13T22:57:06.665Z'),
        updated_at: new Date('2026-06-13T05:57:06.665Z'),
      },
    ],
  });

  console.log('Seed completado ✅');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
