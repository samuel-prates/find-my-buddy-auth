import { Test, TestingModule } from '@nestjs/testing';
import { ValidateTokenUseCase } from '../../../../src/application/use-cases/validate-token.use-case';
import { TokenService, TokenValidationResult } from '../../../../src/domain/ports/token-service.interface';
import { TelemetryService } from '../../../../src/telemetry/telemetry.service';

// Define string token for dependency injection
const TOKEN_SERVICE = 'TOKEN_SERVICE';

describe('ValidateTokenUseCase', () => {
  let useCase: ValidateTokenUseCase;
  let tokenService: jest.Mocked<TokenService>;
  let telemetryService: TelemetryService;

  const mockTokenService = {
    generateToken: jest.fn(),
    validateToken: jest.fn(),
  };

  const mockTelemetryService = {
    logError: jest.fn(),
  } as unknown as TelemetryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: TOKEN_SERVICE,
          useValue: mockTokenService,
        },
        {
          provide: TelemetryService,
          useValue: mockTelemetryService,
        },
        {
          provide: ValidateTokenUseCase,
          useFactory: () => new ValidateTokenUseCase(mockTokenService, mockTelemetryService),
        },
      ],
    }).compile();

    useCase = module.get<ValidateTokenUseCase>(ValidateTokenUseCase);
    tokenService = mockTokenService as jest.Mocked<TokenService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return valid=true and user data when token is valid', async () => {
      // Arrange
      const input = {
        token: 'valid-token',
      };
      const validationResult: TokenValidationResult = {
        valid: true,
        payload: {
          sub: '1',
          email: 'user@example.com',
        },
      };
      mockTokenService.validateToken.mockResolvedValue(validationResult);

      // Act
      const result = await useCase.execute(input);

      // Assert
      expect(result).toEqual({
        valid: true,
        user: {
          userId: '1',
          email: 'user@example.com',
        },
      });
      expect(tokenService.validateToken).toHaveBeenCalledWith(input.token);
    });

    it('should return valid=false when token is invalid', async () => {
      // Arrange
      const input = {
        token: 'invalid-token',
      };
      const validationResult: TokenValidationResult = {
        valid: false,
      };
      mockTokenService.validateToken.mockResolvedValue(validationResult);

      // Act
      const result = await useCase.execute(input);

      // Assert
      expect(result).toEqual({
        valid: false,
      });
      expect(tokenService.validateToken).toHaveBeenCalledWith(input.token);
    });
  });
});
