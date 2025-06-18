import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { JwtTokenService } from '../../../../src/infrastructure/services/jwt-token.service';
import { User } from '../../../../src/domain/entities/user.entity';

describe('JwtTokenService', () => {
  let service: JwtTokenService;
  let jwtService: JwtService;

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('test-token'),
    verify: jest.fn(),
  };

  // Mock user for testing
  const mockUser = {
    id: '1',
    email: 'user@example.com',
  } as unknown as User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtTokenService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<JwtTokenService>(JwtTokenService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateToken', () => {
    it('should call jwtService.sign with correct payload', async () => {
      // Act
      const result = await service.generateToken(mockUser);

      // Assert
      expect(result).toBe('test-token');
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
      });
    });
  });

  describe('validateToken', () => {
    it('should return valid=true and payload when token is valid', async () => {
      // Arrange
      const token = 'valid-token';
      const payload = { sub: '1', email: 'user@example.com' };
      mockJwtService.verify.mockReturnValue(payload);

      // Act
      const result = await service.validateToken(token);

      // Assert
      expect(result).toEqual({
        valid: true,
        payload,
      });
      expect(jwtService.verify).toHaveBeenCalledWith(token);
    });

    it('should return valid=false when token is invalid', async () => {
      // Arrange
      const token = 'invalid-token';
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      // Act
      const result = await service.validateToken(token);

      // Assert
      expect(result).toEqual({
        valid: false,
      });
      expect(jwtService.verify).toHaveBeenCalledWith(token);
    });
  });
});