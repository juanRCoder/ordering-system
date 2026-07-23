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
import { Subject } from 'rxjs';
import { EventSupplyDto, EventUpdatePriceDto } from './dto/event-supply.dto';

@Injectable()
export class SuppliesService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService
  ) {}

  private rootFolder = 'ordering-system';
  private channels = new Map<string, Subject<EventSupplyDto>>();
  private channelUpdatePrice = new Map<string, Subject<EventUpdatePriceDto>>();

  private getChannel(slug: string): Subject<EventSupplyDto> {
    if (!this.channels.has(slug)) {
      this.channels.set(slug, new Subject<EventSupplyDto>());
    }
    return this.channels.get(slug)!;
  }

  private getChannelUpdatePrice(slug: string): Subject<EventUpdatePriceDto> {
    if (!this.channelUpdatePrice.has(slug)) {
      this.channelUpdatePrice.set(slug, new Subject<EventUpdatePriceDto>());
    }
    return this.channelUpdatePrice.get(slug)!;
  }

  async create(
    createSupplyDto: CreateSupplyDto,
    adminId: string,
    file?: Express.Multer.File
  ) {
    const { name, price, category_id } = createSupplyDto;

    if (!adminId) {
      throw new NotFoundException({
        code: 'ADMIN_NOT_FOUND',
        message: `The admin with id "${adminId}" does not exist`,
      });
    }

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

    const newSupply = await this.prisma.supplies.create({
      data: {
        name,
        image_url: imageUrl,
        image_public_id: imagePublicId,
        category_id,
        origin: 'ADMIN',
        creator_admin_id: adminId,
      },
    });

    await this.prisma.adminSupplies.create({
      data: {
        admin_id: adminId,
        supply_id: newSupply.id,
        price,
      },
    });

    return {
      status: HttpStatus.CREATED,
      data: {
        ok: true,
      },
    };
  }

  async findBySlug(
    slug: string,
    categoryId?: string,
    letters?: string,
    page: number = 1
  ) {
    const admin = await this.prisma.users.findUnique({ where: { slug } });
    if (!admin) {
      throw new NotFoundException({
        code: 'ADMIN_NOT_FOUND',
        message: `The business with slug "${slug}" does not exist`,
      });
    }
    const getAdmin = {
      id: admin.id,
      is_business_open: admin.is_business_open,
    };
    return this.findSuppliesForAdmin(getAdmin, categoryId, letters, page);
  }

  async findByAdminId(adminId: string, categoryId: string, letters?: string) {
    const admin = await this.prisma.users.findUnique({
      where: { id: adminId },
    });
    if (!admin) {
      throw new NotFoundException({
        code: 'ADMIN_NOT_FOUND',
        message: `The admin with id "${adminId}" does not exist`,
      });
    }
    const getAdmin = { id: adminId, is_business_open: admin.is_business_open };
    return this.findSuppliesForAdmin(getAdmin, categoryId, letters);
  }

  private async findSuppliesForAdmin(
    admin: { id: string; is_business_open: boolean },
    categoryId?: string,
    letters?: string,
    page: number = 1
  ) {
    const limit = 10;
    const startCount = (page - 1) * limit;

    const search = letters?.trim();

    const [adminSupplies, total] = await Promise.all([
      this.prisma.adminSupplies.findMany({
        where: {
          admin_id: admin.id,
          supply: {
            ...(search
              ? { name: { contains: search, mode: 'insensitive' } }
              : { category_id: categoryId }),
          },
        },
        orderBy: [{ created_at: 'desc' }, { id: 'desc' }],
        select: {
          id: true,
          price: true,
          description: true,
          status: true,
          supply: { select: { name: true, image_url: true, origin: true } },
        },
        skip: startCount,
        take: limit,
      }),
      this.prisma.adminSupplies.count({
        where: {
          admin_id: admin.id,
          supply: { category_id: categoryId },
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      status: HttpStatus.OK,
      is_business_open: admin.is_business_open,
      data: adminSupplies.map((as) => ({
        id: as.id,
        name: as.supply.name,
        image_url: as.supply.image_url,
        description: as.description,
        price: as.price.toNumber(),
        status: as.status,
        origin: as.supply.origin,
      })),
      metadata: {
        pagination: {
          total,
          totalPages,
          page,
        },
      },
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
    const admin = await this.prisma.users.findUnique({
      where: { id: adminId },
    });
    if (!admin) {
      throw new NotFoundException({
        code: 'ADMIN_NOT_FOUND',
        message: `The admin with id "${adminId}" does not exist`,
      });
    }

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

    this.getChannel(admin.slug!).next({
      status: updatedSupply.status,
    });

    return {
      status: HttpStatus.OK,
      data: {
        name: updatedSupply.supply.name,
        status: updatedSupply.status,
      },
    };
  }

  getAdminSupplyUpdateStream(slug: string) {
    return this.getChannel(slug).asObservable();
  }

  async update(
    id: string,
    updateSupplyDto: UpdateSupplyDto,
    file?: Express.Multer.File,
    adminId?: string
  ) {
    const admin = await this.prisma.users.findUnique({
      where: { id: adminId },
    });
    if (!admin) {
      throw new NotFoundException({
        code: 'ADMIN_NOT_FOUND',
        message: `The admin with id "${adminId}" does not exist`,
      });
    }

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

    const updateAdminSupply = await this.prisma.adminSupplies.update({
      where: { id },
      data: {
        price,
      },
    });

    this.getChannelUpdatePrice(admin.slug!).next({
      price: updateAdminSupply.price,
    });

    return {
      status: HttpStatus.OK,
      data: {
        ok: true,
      },
    };
  }

  getAdminSupplyUpdatePriceStream(slug: string) {
    return this.getChannelUpdatePrice(slug).asObservable();
  }
}
