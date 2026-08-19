import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { PrismaService } from '../../../prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Sessions } from '../../../generated/prisma/client';
import { TestingModule } from '@nestjs/testing/testing-module';
import { Test } from '@nestjs/testing/test';

jest.mock('bcrypt');

describe('AuthService', () => {
  let authService: AuthService;
  const jwtService = { signAsync: jest.fn() };
  const prisma = {
    $transaction: jest.fn(),
    users: { findUnique: jest.fn(), create: jest.fn(), update: jest.fn() },
    sessions: { create: jest.fn(), delete: jest.fn() },
  };

  const userMock = {
    id: 'user-1',
    email: 'test@example.com',
    password: 'secret123',
    name: 'Test User',
    role: 'ADMIN',
    slug: 'test-user',
    business_name: 'Test Business',
    is_business_open: true,
    phone: '1234567890',
  };

  beforeEach(async () => {
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('POST/ register', () => {
    it('debe encriptar la contraseña con bcrypt y crear unnuevo usuario', async () => {
      prisma.users.findUnique
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);

      (bcrypt.hash as jest.Mock).mockResolvedValue('$2b$10$fake');
      prisma.users.create.mockResolvedValue({
        id: 'id-user',
        name: 'Test User',
      });

      const newUser = await authService.register(userMock);
      expect(bcrypt.hash).toHaveBeenCalledWith('secret123', 10);

      expect(newUser).toEqual({
        status: 201,
        data: { sub: 'id-user', name: 'Test User' },
      });
    });

    it('debe lanzar ConflictException si el slug ya está en uso', async () => {
      prisma.users.findUnique
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ id: 'existing', slug: 'test-user' });

      await expect(authService.register(userMock)).rejects.toThrow(
        ConflictException
      );
    });
  });

  describe('POST/ login', () => {
    it('debería devolver tokens con credenciales válidas', async () => {
      prisma.users.findUnique.mockResolvedValue(userMock);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jwtService.signAsync.mockResolvedValue('fake-access-token');
      prisma.sessions.create.mockResolvedValue({});

      const result = await authService.login({
        email: userMock.email,
        password: userMock.password,
      });

      expect(bcrypt.compare).toHaveBeenCalledWith(
        'secret123',
        userMock.password
      );
      expect(result).toHaveProperty('data.access_token', 'fake-access-token');
    });

    it('Debe lanzar una UnauthorizedException si no se encuentra el usuario', async () => {
      prisma.users.findUnique.mockResolvedValue(null);

      await expect(
        authService.login({ email: 'no@existe.com', password: '123456' })
      ).rejects.toThrow(UnauthorizedException);
    });

    it('Debe lanzar una UnauthorizedException si la contraseña es incorrecta', async () => {
      prisma.users.findUnique.mockResolvedValue(userMock);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        authService.login({ email: userMock.email, password: 'wrong' })
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('POST/ refresh', () => {
    it('Debe lanzar una UnauthorizedException si no se encuentra el usuario', async () => {
      prisma.users.findUnique.mockResolvedValue(null);

      await expect(
        authService.refresh({
          id: 's1',
          user_id: 'u1',
          refresh_token: 't',
          expires_at: new Date(),
          created_at: new Date(),
          updated_at: new Date(),
        } as Sessions)
      ).rejects.toThrow(UnauthorizedException);
    });

    it('debería devolver nuevos tokens en una sesión válida', async () => {
      prisma.users.findUnique.mockResolvedValue(userMock);
      jwtService.signAsync.mockResolvedValue('new-access');

      prisma.$transaction.mockImplementation(
        async (cb: (tx: typeof prisma) => Promise<unknown>) =>
          cb({
            sessions: {
              delete: prisma.sessions.delete.mockResolvedValue({}),
              create: prisma.sessions.create.mockResolvedValue({}),
            },
          } as typeof prisma)
      );

      const result = await authService.refresh({
        id: 's1',
        user_id: 'user-1',
        refresh_token: 'old-token',
        expires_at: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      } as Sessions);

      expect(prisma.sessions.delete).toHaveBeenCalledWith({
        where: { id: 's1' },
      });
      expect(result).toHaveProperty('data.access_token', 'new-access');
    });
  });

  describe('PATCH/ updateIsBusinessOpen', () => {
    it('debería actualizar la base de datos y emitir un evento SSE', async () => {
      const updatedUser = { ...userMock, is_business_open: false };
      prisma.users.update.mockResolvedValue(updatedUser);

      const result = await authService.updateIsBusinessOpen('user-1', false);

      expect(prisma.users.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: { is_business_open: false },
      });
      expect(result).toEqual({ status: 200, data: { ok: true } });
    });
  });
});
