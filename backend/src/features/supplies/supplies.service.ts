import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateSupplyDto } from './dto/create-supply.dto';
import { StatusSupply } from '../../generated/prisma/enums';

@Injectable()
export class SuppliesService {
  constructor(private prisma: PrismaService) {}

  async create(createSupplyDto: CreateSupplyDto) {
    const { name, description, price, image_url, type_supply_id, status } =
      createSupplyDto;

    const category = await this.prisma.typesSupplies.findUnique({
      where: { id: type_supply_id },
    });

    if (!category) {
      throw new BadRequestException({
        code: 'CATEGORY_NOT_FOUND',
        message: 'The specified category does not exist',
      });
    }

    await this.prisma.supplies.create({
      data: {
        name,
        description,
        price,
        imagen_url: image_url || null,
        type_supply_id,
        status,
      },
    });

    return {
      status: HttpStatus.CREATED,
      data: {
        ok: true,
      },
    };
  }

  async findByCategoryId(type_id: string) {
    if (type_id === 'all') {
      const supplies = await this.prisma.supplies.findMany({
        orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
        select: {
          id: true,
          imagen_url: true,
          name: true,
          description: true,
          price: true,
          status: true,
        },
      });

      return {
        status: HttpStatus.OK,
        data: supplies.map((s) => ({
          id: s.id,
          image_url: s.imagen_url,
          name: s.name,
          description: s.description,
          price: Number(s.price),
          status: s.status,
        })),
      };
    }

    const category = await this.prisma.typesSupplies.findUnique({
      where: { id: type_id },
    });

    if (!category) {
      throw new BadRequestException({
        code: 'CATEGORY_NOT_FOUND',
        message: 'The specified category does not exist',
      });
    }

    const supplies = await this.prisma.supplies.findMany({
      where: { type_supply_id: type_id },
      orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
      select: {
        id: true,
        imagen_url: true,
        name: true,
        description: true,
        price: true,
        status: true,
      },
    });

    return {
      status: HttpStatus.OK,
      data: supplies.map((s) => ({
        id: s.id,
        image_url: s.imagen_url,
        name: s.name,
        description: s.description,
        price: Number(s.price),
        status: s.status,
      })),
    };
  }

  async updateStatus(id: string) {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new BadRequestException({
        code: 'INVALID_ID',
        message: 'The specified ID is not a valid UUID',
      });
    }

    const supply = await this.prisma.supplies.findUnique({
      where: { id },
    });

    if (!supply) {
      throw new NotFoundException({
        code: 'SUPPLY_NOT_FOUND',
        message: 'The specified supply does not exist',
      });
    }

    const newStatus =
      supply.status === StatusSupply.AVAILABLE
        ? StatusSupply.UNAVAILABLE
        : StatusSupply.AVAILABLE;

    const updatedSupply = await this.prisma.supplies.update({
      where: { id },
      data: { status: newStatus },
    });

    return {
      status: HttpStatus.OK,
      data: {
        name: updatedSupply.name,
        status: updatedSupply.status,
      },
    };
  }
}
