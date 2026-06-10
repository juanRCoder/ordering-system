import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateTypeSupplyDto } from './dto/create-type-supply.dto';
import { UpdateTypeSupplyDto } from './dto/update-type-supply.dto';
import { LayoutType } from '../../generated/prisma/enums';

@Injectable()
export class TypeSuppliesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const typesSupplies = await this.prisma.typesSupplies.findMany({
      include: {
        _count: {
          select: { supplies: true },
        },
      },
    });
    return {
      status: HttpStatus.OK,
      data: typesSupplies.map((type) => ({
        id: type.id,
        name: type.name,
        layout: type.layout,
        supplies_quantity: type._count.supplies,
      })),
    };
  }

  async create(createTypeSupplyDto: CreateTypeSupplyDto) {
    await this.prisma.typesSupplies.create({
      data: {
        name: createTypeSupplyDto.name,
        layout: createTypeSupplyDto.layout || LayoutType.FULL,
      },
    });

    return {
      status: HttpStatus.CREATED,
      data: {
        ok: true,
      },
    };
  }

  async findById(id: string) {
    const typeSupply = await this.prisma.typesSupplies.findUnique({
      where: { id },
    });

    if (!typeSupply) {
      throw new NotFoundException({
        code: 'TYPE_SUPPLY_NOT_FOUND',
        message: 'The specified type supply does not exist',
      });
    }

    return {
      status: HttpStatus.OK,
      data: {
        id: typeSupply.id,
        name: typeSupply.name,
      },
    };
  }

  async update(id: string, updateTypeSupplyDto: UpdateTypeSupplyDto) {
    const typeSupply = await this.prisma.typesSupplies.findUnique({
      where: { id },
    });

    if (!typeSupply) {
      throw new NotFoundException({
        code: 'TYPE_SUPPLY_NOT_FOUND',
        message: 'The specified type supply does not exist',
      });
    }

    await this.prisma.typesSupplies.update({
      where: { id },
      data: { name: updateTypeSupplyDto.name },
    });

    return {
      status: HttpStatus.OK,
      data: {
        ok: true,
      },
    };
  }
}
