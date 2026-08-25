import { HttpStatus, NotFoundException } from '@nestjs/common';
import { OrdersService } from '../orders.service';
import { PrismaService } from '../../../prisma.service';
import { Prisma } from '../../../generated/prisma/client';

type TransactionCallback = (tx: Prisma.TransactionClient) => Promise<unknown>;

describe('OrdersService', () => {
  let ordersService: OrdersService;
  const prisma = {
    $transaction: jest.fn(),
    users: { findUnique: jest.fn() },
    orders: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    suppliesOrders: {
      findMany: jest.fn(),
      createMany: jest.fn(),
      update: jest.fn(),
      deleteMany: jest.fn(),
    },
    adminSupplies: { findMany: jest.fn() },
  };

  const adminMock = {
    id: 'admin-1',
    slug: 'test-admin',
    name: 'Test Admin',
    role: 'ADMIN',
  };

  beforeEach(() => {
    jest.resetAllMocks();

    ordersService = new OrdersService(prisma as unknown as PrismaService);
  });

  const makeDecimal = (value: number) => ({
    toNumber: () => value,
  });

  describe('POST/ create', () => {
    const createDto = {
      guest_name: 'Juan',
      total: 25.5,
      supplies: [
        { id: 'supply-1', price: 10, quantity: 2 },
        { id: 'supply-2', price: 5.5, quantity: 1 },
      ],
    };

    it('debería lanzar NotFoundException cuando el slug de administrador no exista', async () => {
      prisma.users.findUnique.mockResolvedValue(null);

      await expect(
        ordersService.create('invalid-slug', createDto)
      ).rejects.toThrow(NotFoundException);
    });

    it('debería actualizar el total cuando se proporcione order_id (orden existente)', async () => {
      prisma.users.findUnique.mockResolvedValue(adminMock);

      const existingOrder = {
        id: 'order-1',
        guest_name: 'Juan',
        total: makeDecimal(10),
        status: 'PENDING',
        created_at: new Date(),
      };

      const updatedOrder = {
        ...existingOrder,
        total: makeDecimal(35.5),
      };

      const mockTx = {
        adminSupplies: {
          findMany: jest.fn().mockResolvedValue([
            { id: 'supply-1', price: makeDecimal(10), status: 'AVAILABLE' },
            { id: 'supply-2', price: makeDecimal(5.5), status: 'AVAILABLE' },
          ]),
        },
        orders: {
          findUnique: jest.fn().mockResolvedValue(existingOrder),
          update: jest.fn().mockResolvedValue(updatedOrder),
        },
        suppliesOrders: {
          findMany: jest.fn().mockResolvedValue([]),
          createMany: jest.fn().mockResolvedValue({}),
        },
      };

      prisma.$transaction.mockImplementation(async (cb: TransactionCallback) =>
        cb(mockTx as unknown as Prisma.TransactionClient)
      );

      const result = await ordersService.create('test-admin', {
        ...createDto,
        order_id: 'order-1',
      });

      expect(mockTx.orders.update).toHaveBeenCalledWith({
        where: { id: 'order-1' },
        data: { total: { increment: 25.5 } },
      });
      expect(result).toEqual({
        status: HttpStatus.CREATED,
        data: { order_id: 'order-1' },
      });
    });

    it('debería crear una nueva orden exitosamente', async () => {
      prisma.users.findUnique.mockResolvedValue(adminMock);

      const createdOrder = {
        id: 'order-new',
        guest_name: 'Juan',
        total: makeDecimal(25.5),
        status: 'PENDING',
        admin_id: 'admin-1',
        order_type: 'LOCAL',
        created_at: new Date(),
      };

      const mockTx = {
        adminSupplies: {
          findMany: jest.fn().mockResolvedValue([
            { id: 'supply-1', price: makeDecimal(10), status: 'AVAILABLE' },
            { id: 'supply-2', price: makeDecimal(5.5), status: 'AVAILABLE' },
          ]),
        },
        orders: {
          create: jest.fn().mockResolvedValue(createdOrder),
        },
        suppliesOrders: {
          findMany: jest.fn().mockResolvedValue([]),
          createMany: jest.fn().mockResolvedValue({}),
        },
      };

      prisma.$transaction.mockImplementation(async (cb: TransactionCallback) =>
        cb(mockTx as unknown as Prisma.TransactionClient)
      );

      const result = await ordersService.create('test-admin', createDto);

      expect(mockTx.orders.create).toHaveBeenCalledWith({
        data: {
          guest_name: 'Juan',
          total: 25.5,
          admin_id: 'admin-1',
          order_type: 'LOCAL',
        },
      });
      expect(result).toEqual({
        status: HttpStatus.CREATED,
        data: { order_id: 'order-new' },
      });
    });

    it('debería crear SuppliesOrders correctamente a través de createMany', async () => {
      prisma.users.findUnique.mockResolvedValue(adminMock);

      const createdOrder = {
        id: 'order-new',
        guest_name: 'Juan',
        total: makeDecimal(25.5),
        status: 'PENDING',
        admin_id: 'admin-1',
        order_type: 'LOCAL',
        created_at: new Date(),
      };

      const mockTx = {
        adminSupplies: {
          findMany: jest.fn().mockResolvedValue([
            { id: 'supply-1', price: makeDecimal(10), status: 'AVAILABLE' },
            { id: 'supply-2', price: makeDecimal(5.5), status: 'AVAILABLE' },
          ]),
        },
        orders: {
          create: jest.fn().mockResolvedValue(createdOrder),
        },
        suppliesOrders: {
          findMany: jest.fn().mockResolvedValue([]),
          createMany: jest.fn().mockResolvedValue({}),
        },
      };

      prisma.$transaction.mockImplementation(async (cb: TransactionCallback) =>
        cb(mockTx as unknown as Prisma.TransactionClient)
      );

      await ordersService.create('test-admin', createDto);

      expect(mockTx.suppliesOrders.createMany).toHaveBeenCalledWith({
        data: [
          {
            order_id: 'order-new',
            admin_supply_id: 'supply-1',
            price: 10,
            quantity: 2,
          },
          {
            order_id: 'order-new',
            admin_supply_id: 'supply-2',
            price: 5.5,
            quantity: 1,
          },
        ],
      });
    });

    it('debería incrementar la cantidad para supplies existentes en la orden', async () => {
      prisma.users.findUnique.mockResolvedValue(adminMock);

      const createdOrder = {
        id: 'order-1',
        guest_name: 'Juan',
        total: makeDecimal(25.5),
        status: 'PENDING',
        admin_id: 'admin-1',
        order_type: 'LOCAL',
        created_at: new Date(),
      };

      const mockTx = {
        adminSupplies: {
          findMany: jest
            .fn()
            .mockResolvedValue([
              { id: 'supply-1', price: makeDecimal(10), status: 'AVAILABLE' },
            ]),
        },
        orders: {
          create: jest.fn().mockResolvedValue(createdOrder),
        },
        suppliesOrders: {
          findMany: jest
            .fn()
            .mockResolvedValue([
              { id: 'so-1', admin_supply_id: 'supply-1', quantity: 1 },
            ]),
          update: jest.fn().mockResolvedValue({}),
          createMany: jest.fn().mockResolvedValue({}),
        },
      };

      prisma.$transaction.mockImplementation(async (cb: TransactionCallback) =>
        cb(mockTx as unknown as Prisma.TransactionClient)
      );

      await ordersService.create('test-admin', {
        guest_name: 'Juan',
        total: 20,
        supplies: [{ id: 'supply-1', price: 10, quantity: 2 }],
      });

      expect(mockTx.suppliesOrders.update).toHaveBeenCalledWith({
        where: { id: 'so-1' },
        data: { quantity: { increment: 2 } },
      });
      expect(mockTx.suppliesOrders.createMany).not.toHaveBeenCalled();
    });

    it('debería lanzar NotFoundException cuando order_id no exista', async () => {
      prisma.users.findUnique.mockResolvedValue(adminMock);

      const mockTx = {
        adminSupplies: {
          findMany: jest
            .fn()
            .mockResolvedValue([
              { id: 'supply-1', price: makeDecimal(10), status: 'AVAILABLE' },
            ]),
        },
        orders: {
          findUnique: jest.fn().mockResolvedValue(null),
        },
      };

      prisma.$transaction.mockImplementation(async (cb: TransactionCallback) =>
        cb(mockTx as unknown as Prisma.TransactionClient)
      );

      await expect(
        ordersService.create('test-admin', {
          guest_name: 'Juan',
          total: 10,
          order_id: 'non-existent',
          supplies: [{ id: 'supply-1', price: 10, quantity: 1 }],
        })
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('GET/ findById', () => {
    it('debería lanzar NotFoundException cuando la orden no exista', async () => {
      prisma.orders.findUnique.mockResolvedValue(null);

      await expect(ordersService.findById('non-existent')).rejects.toThrow(
        NotFoundException
      );
    });

    it('debería devolver la orden con sus supplies', async () => {
      prisma.orders.findUnique.mockResolvedValue({
        id: 'order-1',
        guest_name: 'Juan',
        created_at: new Date('2025-01-01'),
        status: 'PENDING',
        payment_type: 'CASH',
        order_type: 'LOCAL',
        total: makeDecimal(50),
        supplies_orders: [
          {
            quantity: 2,
            price: makeDecimal(15),
            admin_supply: {
              name: 'Hamburguesa',
              supply: { id: 's1', name: 'Hamburguesa' },
            },
          },
          {
            quantity: 1,
            price: makeDecimal(20),
            admin_supply: {
              name: 'Papas Fritas',
              supply: { id: 's2', name: 'Papas' },
            },
          },
        ],
      });

      const result = await ordersService.findById('order-1');

      expect(result).toEqual({
        status: HttpStatus.OK,
        data: {
          id: 'order-1',
          guest_name: 'Juan',
          created_at: new Date('2025-01-01'),
          status: 'PENDING',
          supplies: [
            {
              quantity: 2,
              name: 'Hamburguesa',
              price: 15,
            },
            {
              quantity: 1,
              name: 'Papas Fritas',
              price: 20,
            },
          ],
          total: 50,
          payment_type: 'CASH',
          order_type: 'LOCAL',
        },
      });
    });
  });

  describe('GET/ findAll', () => {
    it('debería devolver una lista de órdenes paginadas', async () => {
      prisma.orders.findMany.mockResolvedValue([
        {
          id: 'order-1',
          guest_name: 'Juan',
          status: 'PENDING',
          order_type: 'LOCAL',
          created_at: new Date('2025-01-01'),
          total: makeDecimal(25),
          is_confirmed: false,
          supplies_orders: [
            {
              quantity: 2,
              admin_supply: { name: 'Hamburguesa' },
            },
          ],
        },
        {
          id: 'order-2',
          guest_name: 'Maria',
          status: 'PENDING',
          order_type: 'TAKEAWAY',
          created_at: new Date('2025-01-03'),
          total: makeDecimal(15),
          is_confirmed: true,
          supplies_orders: [
            {
              quantity: 1,
              admin_supply: { name: 'Papas Fritas' },
            },
          ],
        },
      ]);
      prisma.orders.count.mockResolvedValueOnce(2).mockResolvedValueOnce(1);

      const result = await ordersService.findAll('admin-1', 1, 'PENDING');

      expect(result).toEqual({
        status: HttpStatus.OK,
        data: [
          {
            id: 'order-1',
            status: 'PENDING',
            guest_name: 'Juan',
            order_type: 'LOCAL',
            created_at: new Date('2025-01-01'),
            is_confirmed: false,
            total: 25,
            supplies: [{ quantity: 2, name: 'Hamburguesa' }],
          },
          {
            id: 'order-2',
            status: 'PENDING',
            guest_name: 'Maria',
            order_type: 'TAKEAWAY',
            created_at: new Date('2025-01-03'),
            is_confirmed: true,
            total: 15,
            supplies: [{ quantity: 1, name: 'Papas Fritas' }],
          },
        ],
        counts: { pending: 1 },
        metadata: {
          pagination: {
            total: 2,
            totalPages: 1,
            page: 1,
          },
        },
      });
    });

    it('debería devolver datos vacíos cuando no existan órdenes', async () => {
      prisma.orders.findMany.mockResolvedValue([]);
      prisma.orders.count.mockResolvedValueOnce(0).mockResolvedValueOnce(0);

      const result = await ordersService.findAll('admin-1', 1, 'PENDING');

      expect(result).toEqual({
        status: HttpStatus.OK,
        data: [],
        counts: { pending: 0 },
        metadata: {
          pagination: {
            total: 0,
            totalPages: 0,
            page: 1,
          },
        },
      });
    });
  });

  describe('PATCH/ update', () => {
    it('debería lanzar NotFoundException cuando la orden no exista', async () => {
      prisma.orders.findUnique.mockResolvedValue(null);

      await expect(
        ordersService.update(
          'non-existent',
          { status: 'FINISHED', payment_type: 'CASH', order_type: 'LOCAL' },
          'admin-1'
        )
      ).rejects.toThrow(NotFoundException);
    });

    it('debería actualizar la orden exitosamente', async () => {
      prisma.orders.findUnique.mockResolvedValue({
        id: 'order-1',
        admin_id: 'admin-1',
        status: 'PENDING',
      });
      prisma.orders.update.mockResolvedValue({});

      const result = await ordersService.update(
        'order-1',
        { status: 'FINISHED', payment_type: 'YAPE', order_type: 'TAKEAWAY' },
        'admin-1'
      );

      expect(prisma.orders.update).toHaveBeenCalledWith({
        where: { id: 'order-1' },
        data: {
          status: 'FINISHED',
          payment_type: 'YAPE',
          order_type: 'TAKEAWAY',
        },
      });
      expect(result).toEqual({
        status: HttpStatus.CREATED,
        data: { ok: true },
      });
    });
  });

  describe('DELETE/ delete', () => {
    it('debería lanzar NotFoundException cuando la orden no exista', async () => {
      prisma.orders.findUnique.mockResolvedValue(null);

      await expect(ordersService.delete('non-existent')).rejects.toThrow(
        NotFoundException
      );
    });

    it('debería eliminar la orden con sus supplies en una transacción', async () => {
      prisma.orders.findUnique.mockResolvedValue({
        id: 'order-1',
        guest_name: 'Juan',
        status: 'PENDING',
      });

      const mockTx = {
        suppliesOrders: {
          deleteMany: jest.fn().mockResolvedValue({}),
        },
        orders: {
          delete: jest.fn().mockResolvedValue({}),
        },
      };

      prisma.$transaction.mockImplementation(async (cb: TransactionCallback) =>
        cb(mockTx as unknown as Prisma.TransactionClient)
      );

      const result = await ordersService.delete('order-1');

      expect(mockTx.suppliesOrders.deleteMany).toHaveBeenCalledWith({
        where: { order_id: 'order-1' },
      });
      expect(mockTx.orders.delete).toHaveBeenCalledWith({
        where: { id: 'order-1' },
      });
      expect(result).toEqual({
        status: HttpStatus.OK,
        data: { ok: true },
      });
    });
  });
});
