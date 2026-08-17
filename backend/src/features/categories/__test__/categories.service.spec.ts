import { ConflictException, NotFoundException } from '@nestjs/common';
import { CategoriesService } from '../categories.service';
import { PrismaService } from '../../../prisma.service';

describe('CategoriesService', () => {
  let categoriesService: CategoriesService;
  let prisma: {
    categories: {
      findMany: jest.Mock;
      findUnique: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
  };

  beforeEach(() => {
    prisma = {
      categories: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };
    categoriesService = new CategoriesService(
      prisma as unknown as PrismaService
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('GET/ findAll', () => {
    it('should return list of categories with supply count', async () => {
      prisma.categories.findMany.mockResolvedValue([
        { id: '1', name: 'Food', _count: { supplies: 3 } },
        { id: '2', name: 'Drinks', _count: { supplies: 0 } },
      ]);

      const result = await categoriesService.findAll();

      expect(result).toEqual({
        status: 200,
        data: [
          { id: '1', name: 'Food', supplies_quantity: 3 },
          { id: '2', name: 'Drinks', supplies_quantity: 0 },
        ],
      });
    });

    it('should return empty data when no categories exist', async () => {
      prisma.categories.findMany.mockResolvedValue([]);

      const result = await categoriesService.findAll();

      expect(result).toEqual({ status: 200, data: [] });
    });
  });

  describe('POST/ findById', () => {
    it('should return category if exists', async () => {
      prisma.categories.findUnique.mockResolvedValue({ id: '1', name: 'Food' });

      const result = await categoriesService.findById('1');

      expect(result).toEqual({ status: 200, data: { id: '1', name: 'Food' } });
    });

    it('should throw NotFoundException if category does not exist', async () => {
      prisma.categories.findUnique.mockResolvedValue(null);

      await expect(categoriesService.findById('999')).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('PATCH/ update', () => {
    it('should throw NotFoundException if category does not exist', async () => {
      prisma.categories.findUnique.mockResolvedValue(null);

      await expect(
        categoriesService.update('999', { name: 'New' })
      ).rejects.toThrow(NotFoundException);
    });

    it('should update category successfully', async () => {
      prisma.categories.findUnique.mockResolvedValue({ id: '1', name: 'Old' });
      prisma.categories.update.mockResolvedValue({});

      const result = await categoriesService.update('1', { name: 'Updated' });

      expect(prisma.categories.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { name: 'Updated' },
      });
      expect(result).toEqual({ status: 200, data: { ok: true } });
    });
  });

  describe('DELETE/ delete', () => {
    it('should throw NotFoundException if category does not exist', async () => {
      prisma.categories.findUnique.mockResolvedValue(null);

      await expect(categoriesService.delete('999')).rejects.toThrow(
        NotFoundException
      );
    });

    it('should throw ConflictException if category has supplies', async () => {
      prisma.categories.findUnique.mockResolvedValue({
        id: '1',
        name: 'Food',
        _count: { supplies: 5 },
      });

      await expect(categoriesService.delete('1')).rejects.toThrow(
        ConflictException
      );
    });

    it('should delete category successfully', async () => {
      prisma.categories.findUnique.mockResolvedValue({
        id: '1',
        name: 'Food',
        _count: { supplies: 0 },
      });
      prisma.categories.delete.mockResolvedValue({});

      await categoriesService.delete('1');

      expect(prisma.categories.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });
});
