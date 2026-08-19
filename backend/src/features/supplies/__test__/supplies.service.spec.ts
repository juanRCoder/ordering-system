import {
  BadRequestException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { SuppliesService } from '../supplies.service';
import { PrismaService } from '../../../prisma.service';
import { CloudinaryService } from '../../../cloudinary/cloudinary.service';
import { CreateSupplyDto } from '../dto/create-supply.dto';

describe('SuppliesService', () => {
  let service: SuppliesService;
  const prisma = {
    users: { findUnique: jest.fn() },
    categories: { findUnique: jest.fn() },
    supplies: { create: jest.fn(), update: jest.fn() },
    adminSupplies: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
    },
  };
  const cloudinary = {
    uploadFile: jest.fn(),
  };

  const makeDecimal = (value: number) => ({
    toNumber: () => value,
  });

  beforeEach(() => {
    jest.resetAllMocks();

    service = new SuppliesService(
      prisma as unknown as PrismaService,
      cloudinary as unknown as CloudinaryService
    );
  });

  describe('POST/ create', () => {
    const createDto: CreateSupplyDto = {
      name: 'Pizza',
      price: 25,
      category_id: 'cat-1',
    };

    it('debe crear supply y adminSupply cuando exista la categoría', async () => {
      prisma.categories.findUnique.mockResolvedValue({ id: 'cat-1' });
      prisma.supplies.create.mockResolvedValue({ id: 'supply-1' });
      prisma.adminSupplies.create.mockResolvedValue({});

      const result = await service.create(createDto, 'admin-1');

      expect(prisma.supplies.create).toHaveBeenCalledWith({
        data: {
          image_url: null,
          image_public_id: null,
          category_id: 'cat-1',
          origin: 'ADMIN',
          creator_admin_id: 'admin-1',
        },
      });
      expect(prisma.adminSupplies.create).toHaveBeenCalledWith({
        data: {
          admin_id: 'admin-1',
          supply_id: 'supply-1',
          price: 25,
          name: 'Pizza',
        },
      });
      expect(result).toEqual({
        status: HttpStatus.CREATED,
        data: { ok: true },
      });
    });

    it('debe subir la imagen cuando se proporcione un archivo', async () => {
      const file = { buffer: Buffer.from('test') } as Express.Multer.File;
      prisma.categories.findUnique.mockResolvedValue({ id: 'cat-1' });
      prisma.supplies.create.mockResolvedValue({ id: 'supply-1' });
      prisma.adminSupplies.create.mockResolvedValue({});
      cloudinary.uploadFile.mockResolvedValue({
        secure_url: 'https://cloudinary.com/img.jpg',
        public_id: 'pub-1',
      });

      await service.create(createDto, 'admin-1', file);

      expect(cloudinary.uploadFile).toHaveBeenCalledWith(
        file,
        'ordering-system/supplies'
      );
      expect(prisma.supplies.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          image_url: 'https://cloudinary.com/img.jpg',
          image_public_id: 'pub-1',
        }),
      });
    });

    it('debería lanzar una NotFoundException cuando adminId esté vacío.', async () => {
      await expect(service.create(createDto, '')).rejects.toThrow(
        NotFoundException
      );
    });

    it('debería lanzar una BadRequestException cuando la categoría no exista', async () => {
      prisma.categories.findUnique.mockResolvedValue(null);

      await expect(service.create(createDto, 'admin-1')).rejects.toThrow(
        BadRequestException
      );
    });
  });

  describe('GET/ findById', () => {
    it('debe devolver el supply cuando exista', async () => {
      prisma.adminSupplies.findUnique.mockResolvedValue({
        id: 'as-1',
        name: 'Pizza',
        price: makeDecimal(25),
        supply: {
          image_url: 'https://img.com/pizza.jpg',
          category_id: 'cat-1',
          image_public_id: 'pub-1',
        },
      });

      const result = await service.findById('as-1', 'admin-1');

      expect(result).toEqual({
        status: HttpStatus.OK,
        data: {
          id: 'as-1',
          name: 'Pizza',
          image_url: 'https://img.com/pizza.jpg',
          price: 25,
          category_id: 'cat-1',
          image_public_id: 'pub-1',
        },
      });
    });

    it('debería lanzar una NotFoundException cuando el supply no exista', async () => {
      prisma.adminSupplies.findUnique.mockResolvedValue(null);

      await expect(service.findById('non-existent', 'admin-1')).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('PATCH/ updateStatus', () => {
    it('debería alternar el estado de AVAILABLE a UNAVAILABLE', async () => {
      prisma.users.findUnique.mockResolvedValue({
        id: 'admin-1',
        slug: 'test-admin',
      });
      prisma.adminSupplies.findUnique.mockResolvedValue({
        id: 'as-1',
        status: 'AVAILABLE',
      });
      prisma.adminSupplies.update.mockResolvedValue({
        status: 'UNAVAILABLE',
      });

      const result = await service.updateStatus('as-1', 'admin-1');

      expect(prisma.adminSupplies.update).toHaveBeenCalledWith({
        where: { id: 'as-1' },
        data: { status: 'UNAVAILABLE' },
        select: { status: true },
      });
      expect(result).toEqual({
        status: HttpStatus.OK,
        data: { status: 'UNAVAILABLE' },
      });
    });

    it('debería lanzar una NotFoundException cuando el admin no exista', async () => {
      prisma.users.findUnique.mockResolvedValue(null);

      await expect(
        service.updateStatus('as-1', 'non-existent')
      ).rejects.toThrow(NotFoundException);
    });

    it('debería lanzar una NotFoundException cuando el supply del admin no exista', async () => {
      prisma.users.findUnique.mockResolvedValue({ id: 'admin-1' });
      prisma.adminSupplies.findUnique.mockResolvedValue(null);

      await expect(
        service.updateStatus('non-existent', 'admin-1')
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('GET/ findBySlug', () => {
    it('debería lanzar una NotFoundException cuando el slug no coincida', async () => {
      prisma.users.findUnique.mockResolvedValue(null);

      await expect(service.findBySlug('invalid-slug', 'cat-1')).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('GET/ findByAdminId', () => {
    it('debería lanzar NotFoundException cuando el administrador no existe', async () => {
      prisma.users.findUnique.mockResolvedValue(null);

      await expect(
        service.findByAdminId('non-existent', 'cat-1')
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('PATCH/ update', () => {
    it('debería lanzar una NotFoundException cuando el admin no exista', async () => {
      prisma.users.findUnique.mockResolvedValue(null);

      await expect(
        service.update('as-1', { name: 'New', price: 10 }, 'non-existent')
      ).rejects.toThrow(NotFoundException);
    });

    it('debería lanzar una NotFoundException cuando el supply no exista', async () => {
      prisma.users.findUnique.mockResolvedValue({ id: 'admin-1' });
      prisma.adminSupplies.findUnique.mockResolvedValue(null);

      await expect(
        service.update('non-existent', { name: 'New', price: 10 }, 'admin-1')
      ).rejects.toThrow(NotFoundException);
    });

    it('debería actualizar el supply exitosamente', async () => {
      prisma.users.findUnique.mockResolvedValue({
        id: 'admin-1',
        slug: 'test-admin',
      });
      prisma.adminSupplies.findUnique.mockResolvedValue({
        id: 'as-1',
        supply_id: 'supply-1',
      });
      prisma.supplies.update.mockResolvedValue({});
      prisma.adminSupplies.update.mockResolvedValue({
        price: makeDecimal(30),
      });

      const result = await service.update(
        'as-1',
        { name: 'Updated Pizza', price: 30 },
        'admin-1'
      );

      expect(prisma.supplies.update).toHaveBeenCalledWith({
        where: { id: 'supply-1' },
        data: { image_url: undefined, image_public_id: undefined },
      });
      expect(prisma.adminSupplies.update).toHaveBeenCalledWith({
        where: { id: 'as-1' },
        data: { price: 30, name: 'Updated Pizza' },
      });
      expect(result).toEqual({
        status: HttpStatus.OK,
        data: { ok: true },
      });
    });

    it('debería lanzar una BadRequestException cuando la categoría no exista al actualizar', async () => {
      prisma.users.findUnique.mockResolvedValue({ id: 'admin-1' });
      prisma.adminSupplies.findUnique.mockResolvedValue({
        id: 'as-1',
        supply_id: 'supply-1',
      });
      prisma.categories.findUnique.mockResolvedValue(null);

      await expect(
        service.update(
          'as-1',
          { name: 'Pizza', price: 25, category_id: 'invalid-cat' },
          'admin-1'
        )
      ).rejects.toThrow(BadRequestException);
    });
  });
});
