import { LoginUseCase } from '../../../../src/application/use-cases/login.use-case';
import { UserRepository } from '../../../../src/domain/ports/user-repository.interface';
import { TokenService } from '../../../../src/domain/ports/token-service.interface';
import { UnauthorizedException } from '../../../../src/domain/exceptions/unauthorized.exception';

describe('LoginUseCase', () => {
  let useCase: LoginUseCase;
  let userRepository: UserRepository;
  let tokenService: TokenService;

  beforeEach(() => {
    // Create mock implementations
    userRepository = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
    };

    tokenService = {
      generateToken: jest.fn(),
      validateToken: jest.fn(),
    };

    // Create the use case with mocked dependencies
    useCase = new LoginUseCase(userRepository, tokenService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should return a token when credentials are valid', async () => {
      // Arrange
      const input = {
        email: 'user@example.com',
        password: 'password123',
      };

      const mockUser = {
        id: '1',
        email: 'user@example.com',
        validatePassword: jest.fn().mockResolvedValue(true),
      };

      (userRepository.findByEmail as jest.Mock).mockResolvedValue(mockUser);
      (tokenService.generateToken as jest.Mock).mockResolvedValue('test-token');

      // Act
      const result = await useCase.execute(input);

      // Assert
      expect(result).toEqual({ token: 'test-token' });
      expect(userRepository.findByEmail).toHaveBeenCalledWith(input.email);
      expect(mockUser.validatePassword).toHaveBeenCalledWith(input.password);
      expect(tokenService.generateToken).toHaveBeenCalledWith(mockUser);
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      // Arrange
      const input = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      (userRepository.findByEmail as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(useCase.execute(input)).rejects.toThrow(UnauthorizedException);
      expect(userRepository.findByEmail).toHaveBeenCalledWith(input.email);
      expect(tokenService.generateToken).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      // Arrange
      const input = {
        email: 'user@example.com',
        password: 'wrongpassword',
      };

      const mockUser = {
        id: '1',
        email: 'user@example.com',
        validatePassword: jest.fn().mockResolvedValue(false),
      };

      (userRepository.findByEmail as jest.Mock).mockResolvedValue(mockUser);

      // Act & Assert
      await expect(useCase.execute(input)).rejects.toThrow(UnauthorizedException);
      expect(userRepository.findByEmail).toHaveBeenCalledWith(input.email);
      expect(mockUser.validatePassword).toHaveBeenCalledWith(input.password);
      expect(tokenService.generateToken).not.toHaveBeenCalled();
    });
  });
});
