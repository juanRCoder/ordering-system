import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateSupplyDto } from './dto/create-supply.dto';
import { UpdateSupplyDto } from './dto/update-supply.dto';
import { CloudinaryService } from '../../cloudinary/cloudinary.service';
import { StatusSupply } from '../../generated/prisma/enums';

@Injectable()
export class SuppliesService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService
  ) {}

  private rootFolder = 'ordering-system';

  async create(createSupplyDto: CreateSupplyDto, file?: Express.Multer.File) {
    const { name, category_id } = createSupplyDto;

    let imageUrl: string | null = null;
    let imagePublicId: string | null = null;

    if (file) {
      const uploadResult = await this.cloudinary.uploadFile(
        file,
        `${this.rootFolder}/supplies`
      );
      imageUrl = uploadResult.secure_url;
      imagePublicId = uploadResult.public_id;
    }

    const category = await this.prisma.categories.findUnique({
      where: { id: category_id },
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
        image_url: imageUrl,
        image_public_id: imagePublicId,
        category_id,
      },
    });

    return {
      status: HttpStatus.CREATED,
      data: {
        ok: true,
      },
    };
  }

  async findBySlug(slug: string, categoryId: string) {
    const admin = await this.prisma.users.findUnique({ where: { slug } });
    if (!admin) {
      throw new NotFoundException({
        code: 'ADMIN_NOT_FOUND',
        message: `The business with slug "${slug}" does not exist`,
      });
    }
    return this.findSuppliesForAdmin(admin.id, categoryId);
  }

  async findByAdminId(adminId: string, categoryId: string) {
    return this.findSuppliesForAdmin(adminId, categoryId);
  }

  private async findSuppliesForAdmin(adminId: string, categoryId: string) {
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
        admin_id: adminId,
        supply: { category_id: categoryId },
      },
      orderBy: [{ created_at: 'desc' }, { id: 'desc' }],
      select: {
        id: true,
        price: true,
        description: true,
        status: true,
        supply: { select: { name: true, image_url: true, origin: true } },
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
        status: as.status,
        origin: as.supply.origin,
      })),
    };
  }

  async findById(id: string) {
    const adminSupply = await this.prisma.adminSupplies.findUnique({
      where: { id },
      select: {
        id: true,
        price: true,
        description: true,
        supply: {
          select: {
            name: true,
            image_url: true,
            category_id: true,
            image_public_id: true,
          },
        },
      },
    });

    if (!adminSupply) {
      throw new NotFoundException({
        code: 'SUPPLY_NOT_FOUND',
        message: 'The specified supply does not exist',
      });
    }

    return {
      status: HttpStatus.OK,
      data: {
        id: adminSupply.id,
        name: adminSupply.supply.name,
        image_url: adminSupply.supply.image_url,
        description: adminSupply.description,
        price: adminSupply.price.toNumber(),
        category_id: adminSupply.supply.category_id,
        image_public_id: adminSupply.supply.image_public_id,
      },
    };
  }

  async updateStatus(id: string, adminId: string) {
    const adminSupply = await this.prisma.adminSupplies.findUnique({
      where: { id, admin_id: adminId },
    });

    if (!adminSupply) {
      throw new NotFoundException({
        code: 'ADMIN_SUPPLY_NOT_FOUND',
        message: 'The specified supply does not exist',
      });
    }

    const newStatus =
      adminSupply.status === StatusSupply.AVAILABLE
        ? StatusSupply.UNAVAILABLE
        : StatusSupply.AVAILABLE;

    const updatedSupply = await this.prisma.adminSupplies.update({
      where: { id },
      data: { status: newStatus },
      select: {
        status: true,
        supply: {
          select: {
            name: true,
          },
        },
      },
    });

    return {
      status: HttpStatus.OK,
      data: {
        name: updatedSupply.supply.name,
        status: updatedSupply.status,
      },
    };
  }

  async update(
    id: string,
    updateSupplyDto: UpdateSupplyDto,
    file?: Express.Multer.File,
    adminId?: string
  ) {
    const supply = await this.prisma.adminSupplies.findUnique({
      where: { id, admin_id: adminId },
    });

    if (!supply) {
      throw new NotFoundException({
        code: 'SUPPLY_NOT_FOUND',
        message: 'The specified supply does not exist',
      });
    }

    const { price } = updateSupplyDto;

    // let image_url: string | undefined | null = imageUrl;
    // let image_public_id: string | undefined | null = imagePublicId;

    // if (file) {
    //   const uploadResult = await this.cloudinary.uploadFile(
    //     file,
    //     `${this.rootFolder}/supplies`,
    //     imagePublicId
    //   );
    //   image_url = uploadResult.secure_url;
    //   image_public_id = uploadResult.public_id;
    // }

    // if (category_id) {
    //   const category = await this.prisma.categories.findUnique({
    //     where: { id: category_id },
    //   });

    //   if (!category) {
    //     throw new BadRequestException({
    //       code: 'CATEGORY_NOT_FOUND',
    //       message: 'The specified category does not exist',
    //     });
    //   }
    // }

    await this.prisma.adminSupplies.update({
      where: { id },
      data: {
        price,
      },
    });

    return {
      status: HttpStatus.OK,
      data: {
        ok: true,
      },
    };
  }
}
