import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { PrismaService } from '../../../prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Sessions } from '../../../generated/prisma/client';

jest.mock('bcrypt');

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: { signAsync: jest.Mock };
  let prisma: {
    users: { findUnique: jest.Mock; create: jest.Mock; update: jest.Mock };
    sessions: { create: jest.Mock; delete: jest.Mock };
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
    prisma = {
      users: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      sessions: {
        create: jest.fn(),
        delete: jest.fn(),
      },
    };
    jwtService = {
      signAsync: jest.fn(),
    };
    authService = new AuthService(
      prisma as unknown as PrismaService,
      jwtService as unknown as JwtService
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('POST/ register', () => {
    it('should hash password with bcrypt and new user', async () => {
      prisma.users.findUnique.mockResolvedValue(null);

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
  });

  describe('POST/ login', () => {
    it('should return tokens on valid credentials', async () => {
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

    it('should throw UnauthorizedException if user not found', async () => {
      prisma.users.findUnique.mockResolvedValue(null);

      await expect(
        authService.login({ email: 'no@existe.com', password: '123456' })
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is wrong', async () => {
      prisma.users.findUnique.mockResolvedValue(userMock);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        authService.login({ email: userMock.email, password: 'wrong' })
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('POST/ refresh', () => {
    it('should throw UnauthorizedException if user not found', async () => {
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

    it('should return new tokens on valid session', async () => {
      prisma.users.findUnique.mockResolvedValue(userMock);
      prisma.sessions.delete.mockResolvedValue({});
      jwtService.signAsync.mockResolvedValue('new-access');
      prisma.sessions.create.mockResolvedValue({});

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
    it('should update DB and emit SSE event', async () => {
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
