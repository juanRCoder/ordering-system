import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const categories = await this.prisma.categories.findMany({
      orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
      include: {
        _count: {
          select: { supplies: true },
        },
      },
    });
    return {
      status: HttpStatus.OK,
      data: categories.map((category) => ({
        id: category.id,
        name: category.name,
        supplies_quantity: category._count.supplies,
      })),
    };
  }

  async create(createTypeSupplyDto: CreateCategoryDto) {
    await this.prisma.categories.create({
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

  async findById(id: string) {
    const category = await this.prisma.categories.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException({
        code: 'TYPE_SUPPLY_NOT_FOUND',
        message: 'The specified type supply does not exist',
      });
    }

    return {
      status: HttpStatus.OK,
      data: {
        id: category.id,
        name: category.name,
      },
    };
  }

  async update(id: string, updateTypeSupplyDto: UpdateCategoryDto) {
    const category = await this.prisma.categories.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException({
        code: 'CATEGORY_NOT_FOUND',
        message: 'The specified category does not exist',
      });
    }

    await this.prisma.categories.update({
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
