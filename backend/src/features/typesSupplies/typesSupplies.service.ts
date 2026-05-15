import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateTypeSupplyDto } from './dto/create-type-supply.dto';
import { LayoutType } from '../../generated/prisma/enums';

@Injectable()
export class TypeSuppliesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const typesSupplies = await this.prisma.typesSupplies.findMany();
    return {
      status: HttpStatus.OK,
      data: typesSupplies.map((type) => ({
        id: type.id,
        name: type.name,
        layout: type.layout,
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
}
