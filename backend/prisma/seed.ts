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
        createdAt: new Date('2026-05-13T22:57:00.39Z'),
        updatedAt: new Date('2026-06-13T05:57:00.39Z'),
      },
      {
        id: 'a767c232-0fd3-44df-b6a6-da25988698d1',
        name: 'bebidas',
        createdAt: new Date('2026-06-13T22:57:06.665Z'),
        updatedAt: new Date('2026-06-13T05:57:06.665Z'),
      },
    ],
  });

  await prisma.supplies.createMany({
    data: [
      {
        id: 'fc54b998-49da-46bf-9800-7f6807be999a',
        name: 'Combinado de Pescado',
        description:
          'Contiene tallarines rojos, huancaina, arroz con pollo, ceviche, chaufanita',
        price: 10,
        category_id: 'f48a2179-ae44-4b00-88ad-9ffc1e9f8508',
      },
      {
        id: '420fc1f6-1a94-490f-aa2d-b641903a03a1',
        name: 'Lomo Saltado',
        price: 12,
        category_id: 'f48a2179-ae44-4b00-88ad-9ffc1e9f8508',
      },
      {
        id: '3672f504-7348-4014-9747-8c42b4d42d3d',
        name: 'Chicha Morada 1L',
        price: 4,
        category_id: 'a767c232-0fd3-44df-b6a6-da25988698d1',
      },
    ],
  });

  console.log('Seed completado ✅');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
