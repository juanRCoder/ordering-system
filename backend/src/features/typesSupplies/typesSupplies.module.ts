import { Module } from '@nestjs/common';
import { TypeSuppliesService } from './typesSupplies.service';
import { TypeSuppliesController } from './typesSupplies.controller';
import { PrismaService } from '../../prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [TypeSuppliesController],
  providers: [TypeSuppliesService, PrismaService],
})
export class TypeSuppliesModule {}
