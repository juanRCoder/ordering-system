import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateSupplyDto } from './dto/create-supply.dto';

@Injectable()
export class SuppliesService {
  constructor(private prisma: PrismaService) {}

  async create(createSupplyDto: CreateSupplyDto) {
    const { name, description, price, image_url, type_supply_id } =
      createSupplyDto;

    // Validate category exists
    const category = await this.prisma.typesSupplies.findUnique({
      where: { id: type_supply_id },
    });

    if (!category) {
      throw new BadRequestException({
        code: 'CATEGORY_NOT_FOUND',
        message: 'La categoría especificada no existe',
      });
    }

    await this.prisma.supplies.create({
      data: {
        name,
        description,
        price,
        imagen_url: image_url,
        type_supply_id,
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
    // Validate category exists
    const category = await this.prisma.typesSupplies.findUnique({
      where: { id: type_id },
    });

    if (!category) {
      throw new BadRequestException({
        code: 'CATEGORY_NOT_FOUND',
        message: 'La categoría especificada no existe',
      });
    }

    const supplies = await this.prisma.supplies.findMany({
      where: { type_supply_id: type_id },
      select: {
        id: true,
        imagen_url: true,
        name: true,
        description: true,
        price: true,
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
      })),
    };
  }
}
