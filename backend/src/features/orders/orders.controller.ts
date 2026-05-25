import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('api/orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  async findAll() {
    return this.ordersService.findAll();
  }

  @Patch(':id')
  @HttpCode(HttpStatus.CREATED)
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto
  ) {
    return this.ordersService.update(id, updateOrderDto);
  }
}
