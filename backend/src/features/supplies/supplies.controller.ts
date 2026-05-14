import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SuppliesService } from './supplies.service';
import { CreateSupplyDto } from './dto/create-supply.dto';

@Controller('api/supplies')
export class SuppliesController {
  constructor(private suppliesService: SuppliesService) {}

  @Post()
  async create(@Body() createSupplyDto: CreateSupplyDto) {
    return this.suppliesService.create(createSupplyDto);
  }

  @Get(':type_id')
  async findByCategoryId(@Param('type_id') type_id: string) {
    return this.suppliesService.findByCategoryId(type_id);
  }
}
