import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateTypeSupplyDto } from './dto/create-type-supply.dto';

@Injectable()
export class TypeSuppliesService {
  constructor(private prisma: PrismaService) {}

  async create(createTypeSupplyDto: CreateTypeSupplyDto) {
    await this.prisma.typesSupplies.create({
      data: {
        name: createTypeSupplyDto.name,
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
