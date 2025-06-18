import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthController } from '../../../../src/presentation/controllers/auth.controller';
import { LoginUseCase } from '../../../../src/application/use-cases/login.use-case';
import { ValidateTokenUseCase } from '../../../../src/application/use-cases/validate-token.use-case';
import { LoginDto } from '../../../../src/presentation/dtos/login.dto';
import { ValidateTokenDto } from '../../../../src/presentation/dtos/validate-token.dto';
import { UnauthorizedException as DomainUnauthorizedException } from '../../../../src/domain/exceptions/unauthorized.exception';
import { TelemetryService } from '../../../../src/telemetry/telemetry.service';

describe('AuthController', () => {
  let controller: AuthController;
  let loginUseCase: LoginUseCase;
  let validateTokenUseCase: ValidateTokenUseCase;
  let telemetryService: TelemetryService;

  const mockLoginUseCase = {
    execute: jest.fn(),
  };

  const mockValidateTokenUseCase = {
    execute: jest.fn(),
  };

  const mockTelemetryService = {
    logError: jest.fn(),
  } as unknown as TelemetryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: LoginUseCase,
          useValue: mockLoginUseCase,
        },
        {
          provide: ValidateTokenUseCase,
          useValue: mockValidateTokenUseCase,
        },
        {
          provide: TelemetryService,
          useValue: mockTelemetryService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    loginUseCase = module.get<LoginUseCase>(LoginUseCase);
    validateTokenUseCase = module.get<ValidateTokenUseCase>(ValidateTokenUseCase);
    telemetryService = module.get<TelemetryService>(TelemetryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should call loginUseCase.execute with correct parameters', async () => {
      // Arrange
      const loginDto: LoginDto = {
        email: 'user@example.com',
        password: 'password123',
      };
      const expectedResult = { token: 'test-token' };
      mockLoginUseCase.execute.mockResolvedValue(expectedResult);

      // Act
      const result = await controller.login(loginDto);

      // Assert
      expect(result).toEqual({ token: 'test-token' });
      expect(loginUseCase.execute).toHaveBeenCalledWith({
        email: loginDto.email,
        password: loginDto.password,
      });
    });

    it('should handle domain unauthorized exception', async () => {
      // Arrange
      const loginDto: LoginDto = {
        email: 'user@example.com',
        password: 'wrong-password',
      };
      mockLoginUseCase.execute.mockRejectedValue(
        new DomainUnauthorizedException('Invalid credentials')
      );

      // Act & Assert
      await expect(controller.login(loginDto)).rejects.toThrow(UnauthorizedException);
      expect(loginUseCase.execute).toHaveBeenCalledWith({
        email: loginDto.email,
        password: loginDto.password,
      });
    });
  });

  describe('validateToken', () => {
    it('should call validateTokenUseCase.execute with correct parameters', async () => {
      // Arrange
      const validateTokenDto: ValidateTokenDto = {
        token: 'test-token',
      };
      const expectedResult = {
        valid: true,
        user: { userId: '1', email: 'user@example.com' },
      };
      mockValidateTokenUseCase.execute.mockResolvedValue(expectedResult);

      // Act
      const result = await controller.validateToken(validateTokenDto);

      // Assert
      expect(result).toBe(expectedResult);
      expect(validateTokenUseCase.execute).toHaveBeenCalledWith({
        token: validateTokenDto.token,
      });
    });
  });
});
