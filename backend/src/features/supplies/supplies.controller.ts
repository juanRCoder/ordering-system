import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SuppliesService } from './supplies.service';
import { CreateSupplyDto } from './dto/create-supply.dto';
import { AdminGuard } from '../auth/auth.guard';

@Controller('supplies')
export class SuppliesController {
  constructor(private suppliesService: SuppliesService) {}

  @Get(':type_id')
  async findByCategoryId(@Param('type_id') type_id: string) {
    return this.suppliesService.findByCategoryId(type_id);
  }

  @UseGuards(AdminGuard)
  @Post()
  async create(@Body() createSupplyDto: CreateSupplyDto) {
    return this.suppliesService.create(createSupplyDto);
  }

  @UseGuards(AdminGuard)
  @Patch(':id')
  async updateStatus(@Param('id') id: string) {
    return this.suppliesService.updateStatus(id);
  }
}
