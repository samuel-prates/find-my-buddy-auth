import { InMemoryUserRepository } from '../../../../src/infrastructure/repositories/in-memory-user.repository';
import { User } from '../../../../src/domain/entities/user.entity';

describe('InMemoryUserRepository', () => {
  let repository: InMemoryUserRepository;

  beforeEach(() => {
    repository = new InMemoryUserRepository();
    // Reset console.log mock after each test
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('findByEmail', () => {
    it('should return a user when found by email', async () => {
      // Arrange
      const email = 'user@example.com';

      // Act
      const user = await repository.findByEmail(email);

      // Assert
      expect(user).toBeDefined();
      expect(user?.email).toBe(email);
      expect(user?.id).toBe('1');
    });

    it('should return null when user is not found by email', async () => {
      // Arrange
      const email = 'nonexistent@example.com';

      // Act
      const user = await repository.findByEmail(email);

      // Assert
      expect(user).toBeNull();
    });
  });

  describe('findById', () => {
    it('should return a user when found by id', async () => {
      // Arrange
      const id = '1';

      // Act
      const user = await repository.findById(id);

      // Assert
      expect(user).toBeDefined();
      expect(user?.id).toBe(id);
      expect(user?.email).toBe('user@example.com');
    });

    it('should return null when user is not found by id', async () => {
      // Arrange
      const id = 'nonexistent-id';

      // Act
      const user = await repository.findById(id);

      // Assert
      expect(user).toBeNull();
    });
  });

  describe('save', () => {
    it('should log the user being saved', async () => {
      // Arrange
      const consoleSpy = jest.spyOn(console, 'log');
      const mockUser = {
        id: '2',
        email: 'newuser@example.com',
      } as User;

      // Act
      await repository.save(mockUser);

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith(
        `User saved: ${mockUser.id}, ${mockUser.email}`
      );
    });
  });
});