import { Module } from '@nestjs/common';
import { TypeSuppliesService } from './typesSupplies.service';
import { TypeSuppliesController } from './typesSupplies.controller';
import { PrismaService } from '../../prisma.service';

@Module({
  controllers: [TypeSuppliesController],
  providers: [TypeSuppliesService, PrismaService],
})
export class TypeSuppliesModule {}
