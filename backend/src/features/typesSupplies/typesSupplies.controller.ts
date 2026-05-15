import { Body, Controller, Get, Post } from '@nestjs/common';
import { TypeSuppliesService } from './typesSupplies.service';
import { CreateTypeSupplyDto } from './dto/create-type-supply.dto';

@Controller('api/types-supplies')
export class TypeSuppliesController {
  constructor(private typeSuppliesService: TypeSuppliesService) {}

  @Get()
  async findAll() {
    return this.typeSuppliesService.findAll();
  }

  @Post()
  async create(@Body() createTypeSupplyDto: CreateTypeSupplyDto) {
    return this.typeSuppliesService.create(createTypeSupplyDto);
  }
}
