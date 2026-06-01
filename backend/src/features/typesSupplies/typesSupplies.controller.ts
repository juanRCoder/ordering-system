import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { TypeSuppliesService } from './typesSupplies.service';
import { CreateTypeSupplyDto } from './dto/create-type-supply.dto';
import { AdminGuard } from '../auth/auth.guard';

@Controller('types-supplies')
export class TypeSuppliesController {
  constructor(private typeSuppliesService: TypeSuppliesService) {}

  @Get()
  async findAll() {
    return this.typeSuppliesService.findAll();
  }

  @UseGuards(AdminGuard)
  @Post()
  async create(@Body() createTypeSupplyDto: CreateTypeSupplyDto) {
    return this.typeSuppliesService.create(createTypeSupplyDto);
  }
}
