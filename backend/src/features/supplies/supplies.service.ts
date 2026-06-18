import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateSupplyDto } from './dto/create-supply.dto';
import { UpdateSupplyDto } from './dto/update-supply.dto';
import { StatusSupply } from '../../generated/prisma/enums';
import { CloudinaryService } from '../../cloudinary/cloudinary.service';

@Injectable()
export class SuppliesService {
  constructor(
    private prisma: PrismaService,
    private cloudinary: CloudinaryService
  ) {}

  private rootFolder = 'ordering-system';

  async create(createSupplyDto: CreateSupplyDto, file?: Express.Multer.File) {
    const { name, description, price, category_id, status } = createSupplyDto;

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
        description,
        price,
        imagen_url: imageUrl,
        imagen_public_id: imagePublicId,
        category_id,
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

  async findByCategoryId(category_id: string) {
    if (category_id === 'all') {
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

    const category = await this.prisma.categories.findUnique({
      where: { id: category_id },
    });

    if (!category) {
      throw new BadRequestException({
        code: 'CATEGORY_NOT_FOUND',
        message: 'The specified category does not exist',
      });
    }

    const supplies = await this.prisma.supplies.findMany({
      where: { category_id },
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

  async findById(id: string) {
    const supply = await this.prisma.supplies.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        imagen_url: true,
        category_id: true,
      },
    });

    if (!supply) {
      throw new NotFoundException({
        code: 'SUPPLY_NOT_FOUND',
        message: 'The specified supply does not exist',
      });
    }

    return {
      status: HttpStatus.OK,
      data: {
        id: supply.id,
        name: supply.name,
        description: supply.description,
        price: Number(supply.price),
        image_url: supply.imagen_url,
        category_id: supply.category_id,
      },
    };
  }

  async updateStatus(id: string) {
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

  async update(id: string, updateSupplyDto: UpdateSupplyDto) {
    const supply = await this.prisma.supplies.findUnique({
      where: { id },
    });

    if (!supply) {
      throw new NotFoundException({
        code: 'SUPPLY_NOT_FOUND',
        message: 'The specified supply does not exist',
      });
    }

    const { name, description, price, image_url, category_id } =
      updateSupplyDto;

    if (category_id) {
      const category = await this.prisma.categories.findUnique({
        where: { id: category_id },
      });

      if (!category) {
        throw new BadRequestException({
          code: 'CATEGORY_NOT_FOUND',
          message: 'The specified category does not exist',
        });
      }
    }

    await this.prisma.supplies.update({
      where: { id },
      data: {
        name,
        description,
        price,
        imagen_url: image_url || null,
        category_id,
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
