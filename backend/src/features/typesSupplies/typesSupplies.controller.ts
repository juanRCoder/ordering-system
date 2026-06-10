import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TypeSuppliesService } from './typesSupplies.service';
import { CreateTypeSupplyDto } from './dto/create-type-supply.dto';
import { UpdateTypeSupplyDto } from './dto/update-type-supply.dto';
import { AdminGuard } from '../auth/auth.guard';

@Controller('types-supplies')
export class TypeSuppliesController {
  constructor(private typeSuppliesService: TypeSuppliesService) {}

  @Get()
  async findAll() {
    return this.typeSuppliesService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.typeSuppliesService.findById(id);
  }

  @UseGuards(AdminGuard)
  @Post()
  async create(@Body() createTypeSupplyDto: CreateTypeSupplyDto) {
    return this.typeSuppliesService.create(createTypeSupplyDto);
  }

  @UseGuards(AdminGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTypeSupplyDto: UpdateTypeSupplyDto
  ) {
    return this.typeSuppliesService.update(id, updateTypeSupplyDto);
  }
}
