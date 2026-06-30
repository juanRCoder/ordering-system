import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class AdminSuppliesService {
  constructor(private prisma: PrismaService) {}

  async findBySlug(slug: string, categoryId: string) {
    const admin = await this.prisma.users.findUnique({
      where: { slug },
    });
    if (!admin) {
      throw new NotFoundException({
        code: 'ADMIN_NOT_FOUND',
        message: `The business with slug "${slug}" does not exist`,
      });
    }

    const category = await this.prisma.categories.findUnique({
      where: { id: categoryId },
    });
    if (!category) {
      throw new BadRequestException({
        code: 'CATEGORY_NOT_FOUND',
        message: 'The specified category does not exist',
      });
    }

    const adminSupplies = await this.prisma.adminSupplies.findMany({
      where: {
        admin_id: admin.id,
        // status: 'AVAILABLE',
        supply: {
          category_id: categoryId,
        },
      },
      select: {
        id: true,
        price: true,
        description: true,
        status: true,
        supply: {
          select: {
            name: true,
            image_url: true,
          },
        },
      },
    });

    return {
      status: HttpStatus.OK,
      data: adminSupplies.map((as) => ({
        id: as.id,
        name: as.supply.name,
        image_url: as.supply.image_url,
        description: as.description,
        price: as.price.toNumber(),
      })),
    };
  }
}
