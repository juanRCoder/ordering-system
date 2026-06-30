import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AdminGuard } from '../auth/auth.guard';
import { CurrentAdmin } from '../../common/decorators/current-admin.decorator';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @UseGuards(AdminGuard)
  @Get()
  async findAll(@CurrentAdmin() adminId: string) {
    return this.ordersService.findAll(adminId);
  }

  @UseGuards(AdminGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Post(':slug')
  async create(
    @Param('slug') slug: string,
    @Body() createOrderDto: CreateOrderDto
  ) {
    return this.ordersService.create(slug, createOrderDto);
  }

  @UseGuards(AdminGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto
  ) {
    return this.ordersService.update(id, updateOrderDto);
  }
}
