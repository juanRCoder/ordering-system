import { Body, Controller, Post } from '@nestjs/common';
import { TypeSuppliesService } from './typesSupplies.service';
import { CreateTypeSupplyDto } from './dto/create-type-supply.dto';

@Controller('api/types-supplies')
export class TypeSuppliesController {
  constructor(private typeSuppliesService: TypeSuppliesService) {}

  @Post()
  async create(@Body() createTypeSupplyDto: CreateTypeSupplyDto) {
    return this.typeSuppliesService.create(createTypeSupplyDto);
  }
}
