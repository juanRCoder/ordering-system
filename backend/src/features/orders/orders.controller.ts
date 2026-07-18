import {
  Body,
  Controller,
  MessageEvent,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Sse,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ConfirmOrderDto } from './dto/confirm-order.dto';
import { AdminGuard } from '../auth/auth.guard';
import { CurrentAdmin } from '../../common/decorators/current-admin.decorator';
import { map, Observable } from 'rxjs';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @UseGuards(AdminGuard)
  @Get()
  async findAll(@CurrentAdmin() admin: { sub: string }) {
    return this.ordersService.findAll(admin.sub);
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

  @Sse('stream/:slug')
  getStream(@Param('slug') slug: string): Observable<MessageEvent> {
    return this.ordersService.getOrdersStream(slug).pipe(
      map(() => ({
        data: { updated: true }, // no importa el contenido, solo es el "aviso"
      }))
    );
  }

  @UseGuards(AdminGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @CurrentAdmin() admin: { sub: string }
  ) {
    return this.ordersService.update(id, updateOrderDto, admin.sub);
  }

  @UseGuards(AdminGuard)
  @Patch(':id/confirm')
  async confirm(
    @Param('id') id: string,
    @Body() confirmOrderDto: ConfirmOrderDto,
    @CurrentAdmin() admin: { sub: string }
  ) {
    return this.ordersService.confirm(id, confirmOrderDto, admin.sub);
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.ordersService.delete(id);
  }
}
