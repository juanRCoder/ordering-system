import { Module } from '@nestjs/common';
import { AdminSuppliesService } from './admin-supplies.service';
import { AdminSuppliesController } from './admin-supplies.controller';
import { PrismaService } from '../../prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [AdminSuppliesController],
  providers: [AdminSuppliesService, PrismaService],
})
export class AdminSuppliesModule {}
