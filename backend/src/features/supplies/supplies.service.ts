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

  async findByCategoryId(category_id: string) {
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
      orderBy: [{ created_at: 'desc' }, { id: 'desc' }],
      select: {
        id: true,
        image_url: true,
        image_public_id: true,
        name: true,
      },
    });

    return {
      status: HttpStatus.OK,
      data: supplies.map((s) => ({
        id: s.id,
        image_url: s.image_url,
        image_public_id: s.image_public_id,
        name: s.name,
      })),
    };
  }

  async findById(id: string) {
    const supply = await this.prisma.supplies.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        image_url: true,
        image_public_id: true,
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
        image_url: supply.image_url,
        image_public_id: supply.image_public_id,
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

    // const newStatus =
    //   supply.status === StatusSupply.AVAILABLE
    //     ? StatusSupply.UNAVAILABLE
    //     : StatusSupply.AVAILABLE;

    // const updatedSupply = await this.prisma.supplies.update({
    //   where: { id },
    //   data: { status: newStatus },
    // });

    return {
      status: HttpStatus.OK,
      data: {
        // name: updatedSupply.name,
        // status: updatedSupply.status,
      },
    };
  }

  async update(
    id: string,
    updateSupplyDto: UpdateSupplyDto,
    file?: Express.Multer.File
  ) {
    const supply = await this.prisma.supplies.findUnique({
      where: { id },
    });

    if (!supply) {
      throw new NotFoundException({
        code: 'SUPPLY_NOT_FOUND',
        message: 'The specified supply does not exist',
      });
    }

    const { name, imageUrl, imagePublicId, category_id } = updateSupplyDto;

    let image_url: string | undefined | null = imageUrl;
    let image_public_id: string | undefined | null = imagePublicId;

    if (file) {
      const uploadResult = await this.cloudinary.uploadFile(
        file,
        `${this.rootFolder}/supplies`,
        imagePublicId
      );
      image_url = uploadResult.secure_url;
      image_public_id = uploadResult.public_id;
    }

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
        image_url: image_url,
        image_public_id: image_public_id,
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
