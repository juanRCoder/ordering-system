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
import { UpdateSupplyDto } from './dto/update-supply.dto';
import { AdminGuard } from '../auth/auth.guard';

@Controller('supplies')
export class SuppliesController {
  constructor(private suppliesService: SuppliesService) {}

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.suppliesService.findById(id);
  }

  @Get('category/:type_id')
  async findByCategoryId(@Param('type_id') type_id: string) {
    return this.suppliesService.findByCategoryId(type_id);
  }

  @UseGuards(AdminGuard)
  @Post()
  async create(@Body() createSupplyDto: CreateSupplyDto) {
    return this.suppliesService.create(createSupplyDto);
  }

  @UseGuards(AdminGuard)
  @Patch(':id/status')
  async updateStatus(@Param('id') id: string) {
    return this.suppliesService.updateStatus(id);
  }

  @UseGuards(AdminGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSupplyDto: UpdateSupplyDto
  ) {
    return this.suppliesService.update(id, updateSupplyDto);
  }
}
