import { Password } from '../../../../src/domain/value-objects/password.value-object';
import * as bcrypt from 'bcrypt';

// Mock bcrypt
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe('Password Value Object', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fromPlain', () => {
    it('should create a password from plain text', () => {
      // Arrange
      const plainPassword = 'password123';

      // Act
      const password = Password.fromPlain(plainPassword);

      // Assert
      expect(password.value).toBe(plainPassword);
      expect(password.isHashed).toBe(false);
    });

    it('should throw an error if password is empty', () => {
      // Arrange
      const emptyPassword = '';

      // Act & Assert
      expect(() => Password.fromPlain(emptyPassword)).toThrow('Password cannot be empty');
    });

    it('should throw an error if password is only whitespace', () => {
      // Arrange
      const whitespacePassword = '   ';

      // Act & Assert
      expect(() => Password.fromPlain(whitespacePassword)).toThrow('Password cannot be empty');
    });

    it('should throw an error if password is too short', () => {
      // Arrange
      const shortPassword = 'short';

      // Act & Assert
      expect(() => Password.fromPlain(shortPassword)).toThrow('Password must be at least 6 characters long');
    });
  });

  describe('fromHashed', () => {
    it('should create a password from hashed text', () => {
      // Arrange
      const hashedPassword = '$2b$10$Ot/qlZJDAM5NVfYk8Dc3AuHLjxF9KK9wqQOYOaRlIDRd5XJzSzQnC';

      // Act
      const password = Password.fromHashed(hashedPassword);

      // Assert
      expect(password.value).toBe(hashedPassword);
      expect(password.isHashed).toBe(true);
    });

    it('should throw an error if hashed password is empty', () => {
      // Arrange
      const emptyPassword = '';

      // Act & Assert
      expect(() => Password.fromHashed(emptyPassword)).toThrow('Hashed password cannot be empty');
    });

    it('should throw an error if hashed password is only whitespace', () => {
      // Arrange
      const whitespacePassword = '   ';

      // Act & Assert
      expect(() => Password.fromHashed(whitespacePassword)).toThrow('Hashed password cannot be empty');
    });
  });

  describe('compare', () => {
    it('should use bcrypt.compare for hashed passwords', async () => {
      // Arrange
      const hashedPassword = '$2b$10$Ot/qlZJDAM5NVfYk8Dc3AuHLjxF9KK9wqQOYOaRlIDRd5XJzSzQnC';
      const plainPassword = 'password123';
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const password = Password.fromHashed(hashedPassword);

      // Act
      const result = await password.compare(plainPassword);

      // Assert
      expect(result).toBe(true);
      expect(bcrypt.compare).toHaveBeenCalledWith(plainPassword, hashedPassword);
    });

    it('should directly compare plain passwords', async () => {
      // Arrange
      const plainPassword1 = 'password123';
      const plainPassword2 = 'password123';

      const password = Password.fromPlain(plainPassword1);

      // Act
      const result = await password.compare(plainPassword2);

      // Assert
      expect(result).toBe(true);
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it('should return false for different plain passwords', async () => {
      // Arrange
      const plainPassword1 = 'password123';
      const plainPassword2 = 'differentpassword';

      const password = Password.fromPlain(plainPassword1);

      // Act
      const result = await password.compare(plainPassword2);

      // Assert
      expect(result).toBe(false);
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });
  });

  describe('hash', () => {
    it('should hash a plain password', async () => {
      // Arrange
      const plainPassword = 'password123';
      const hashedPassword = '$2b$10$Ot/qlZJDAM5NVfYk8Dc3AuHLjxF9KK9wqQOYOaRlIDRd5XJzSzQnC';
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const password = Password.fromPlain(plainPassword);

      // Act
      const result = await password.hash();

      // Assert
      expect(result).toBe(hashedPassword);
      expect(bcrypt.hash).toHaveBeenCalledWith(plainPassword, 10);
    });

    it('should return the same value for already hashed passwords', async () => {
      // Arrange
      const hashedPassword = '$2b$10$Ot/qlZJDAM5NVfYk8Dc3AuHLjxF9KK9wqQOYOaRlIDRd5XJzSzQnC';

      const password = Password.fromHashed(hashedPassword);

      // Act
      const result = await password.hash();

      // Assert
      expect(result).toBe(hashedPassword);
      expect(bcrypt.hash).not.toHaveBeenCalled();
    });
  });
});