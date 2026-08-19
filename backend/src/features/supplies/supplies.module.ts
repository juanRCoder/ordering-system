import { Module } from '@nestjs/common';
import { SuppliesService } from './supplies.service';
import { SuppliesController } from './supplies.controller';
import { AuthModule } from '../auth/auth.module';
import { CloudinaryModule } from '../../cloudinary/cloudinary.module';

@Module({
  imports: [AuthModule, CloudinaryModule],
  controllers: [SuppliesController],
  providers: [SuppliesService],
})
export class SuppliesModule {}
