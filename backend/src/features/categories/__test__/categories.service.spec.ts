import { ConflictException, NotFoundException } from '@nestjs/common';
import { CategoriesService } from '../categories.service';
import { PrismaService } from '../../../prisma.service';

describe('CategoriesService', () => {
  let categoriesService: CategoriesService;
  const prisma = {
    categories: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.resetAllMocks();

    categoriesService = new CategoriesService(
      prisma as unknown as PrismaService
    );
  });

  describe('GET/ findAll', () => {
    it('debería devolver una lista de categorías con el recuento de supplies', async () => {
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

    it('debería devolver datos vacíos cuando no existan categorías', async () => {
      prisma.categories.findMany.mockResolvedValue([]);

      const result = await categoriesService.findAll();

      expect(result).toEqual({ status: 200, data: [] });
    });
  });

  describe('POST/ findById', () => {
    it('debería devolver la categoría si existe', async () => {
      prisma.categories.findUnique.mockResolvedValue({ id: '1', name: 'Food' });

      const result = await categoriesService.findById('1');

      expect(result).toEqual({ status: 200, data: { id: '1', name: 'Food' } });
    });

    it('debería lanzar NotFoundException si la categoría no existe', async () => {
      prisma.categories.findUnique.mockResolvedValue(null);

      await expect(categoriesService.findById('999')).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('PATCH/ update', () => {
    it('debería lanzar NotFoundException si la categoría no existe', async () => {
      prisma.categories.findUnique.mockResolvedValue(null);

      await expect(
        categoriesService.update('999', { name: 'New' })
      ).rejects.toThrow(NotFoundException);
    });

    it('debería actualizar la categoría exitosamente', async () => {
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
    it('debería lanzar NotFoundException si la categoría no existe', async () => {
      prisma.categories.findUnique.mockResolvedValue(null);

      await expect(categoriesService.delete('999')).rejects.toThrow(
        NotFoundException
      );
    });

    it('debería lanzar ConflictException si la categoría tiene supplies', async () => {
      prisma.categories.findUnique.mockResolvedValue({
        id: '1',
        name: 'Food',
        _count: { supplies: 5 },
      });

      await expect(categoriesService.delete('1')).rejects.toThrow(
        ConflictException
      );
    });

    it('debería eliminar la categoría exitosamente', async () => {
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
