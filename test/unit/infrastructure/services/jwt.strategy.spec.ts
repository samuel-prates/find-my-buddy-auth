import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from '../../../../src/auth/strategies/jwt.strategy';
import { TokenPayload } from '../../../../src/domain/ports/token-service.interface';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtStrategy],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return user object with userId and email from payload', async () => {
      // Arrange
      const payload: TokenPayload = {
        sub: '1',
        email: 'user@example.com',
      };

      // Act
      const result = await strategy.validate(payload);

      // Assert
      expect(result).toEqual({
        userId: '1',
        email: 'user@example.com',
      });
    });

    it('should ignore additional properties in the payload', async () => {
      // Arrange
      const payload = {
        sub: '1',
        email: 'user@example.com',
        // Additional properties that should be ignored
        iat: 1234567890,
        exp: 1234567890,
      } as TokenPayload;

      // Act
      const result = await strategy.validate(payload);

      // Assert
      expect(result).toEqual({
        userId: '1',
        email: 'user@example.com',
      });
      // Ensure additional properties are not included
      expect(result).not.toHaveProperty('iat');
      expect(result).not.toHaveProperty('exp');
    });
  });
});
