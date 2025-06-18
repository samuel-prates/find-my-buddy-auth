import { User } from '../../../../src/domain/entities/user.entity';
import * as bcrypt from 'bcrypt';

// Mock bcrypt
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe('User Entity', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a user with the provided id, email, and hashed password', () => {
      // Arrange
      const id = '1';
      const email = 'user@example.com';
      const hashedPassword = '$2b$10$Ot/qlZJDAM5NVfYk8Dc3AuHLjxF9KK9wqQOYOaRlIDRd5XJzSzQnC';

      // Act
      const user = User.create(id, email, hashedPassword);

      // Assert
      expect(user.id).toBe(id);
      expect(user.email).toBe(email);
    });

    it('should throw an error if id is invalid', () => {
      // Arrange
      const id = '';
      const email = 'user@example.com';
      const hashedPassword = '$2b$10$Ot/qlZJDAM5NVfYk8Dc3AuHLjxF9KK9wqQOYOaRlIDRd5XJzSzQnC';

      // Act & Assert
      expect(() => User.create(id, email, hashedPassword)).toThrow('User ID cannot be empty');
    });

    it('should throw an error if email is invalid', () => {
      // Arrange
      const id = '1';
      const email = 'invalid-email';
      const hashedPassword = '$2b$10$Ot/qlZJDAM5NVfYk8Dc3AuHLjxF9KK9wqQOYOaRlIDRd5XJzSzQnC';

      // Act & Assert
      expect(() => User.create(id, email, hashedPassword)).toThrow('Invalid email format');
    });
  });

  describe('register', () => {
    it('should create a user with the provided id, email, and plain password', () => {
      // Arrange
      const id = '1';
      const email = 'user@example.com';
      const plainPassword = 'password123';

      // Act
      const user = User.register(id, email, plainPassword);

      // Assert
      expect(user.id).toBe(id);
      expect(user.email).toBe(email);
    });

    it('should throw an error if password is too short', () => {
      // Arrange
      const id = '1';
      const email = 'user@example.com';
      const plainPassword = 'short';

      // Act & Assert
      expect(() => User.register(id, email, plainPassword)).toThrow('Password must be at least 6 characters long');
    });
  });

  describe('validatePassword', () => {
    it('should return true if password is valid', async () => {
      // Arrange
      const id = '1';
      const email = 'user@example.com';
      const hashedPassword = '$2b$10$Ot/qlZJDAM5NVfYk8Dc3AuHLjxF9KK9wqQOYOaRlIDRd5XJzSzQnC';
      const plainPassword = 'password123';
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const user = User.create(id, email, hashedPassword);

      // Act
      const result = await user.validatePassword(plainPassword);

      // Assert
      expect(result).toBe(true);
      expect(bcrypt.compare).toHaveBeenCalledWith(plainPassword, hashedPassword);
    });

    it('should return false if password is invalid', async () => {
      // Arrange
      const id = '1';
      const email = 'user@example.com';
      const hashedPassword = '$2b$10$Ot/qlZJDAM5NVfYk8Dc3AuHLjxF9KK9wqQOYOaRlIDRd5XJzSzQnC';
      const plainPassword = 'wrongpassword';
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const user = User.create(id, email, hashedPassword);

      // Act
      const result = await user.validatePassword(plainPassword);

      // Assert
      expect(result).toBe(false);
      expect(bcrypt.compare).toHaveBeenCalledWith(plainPassword, hashedPassword);
    });
  });
});