import { UserId } from '../../../../src/domain/value-objects/user-id.value-object';

describe('UserId Value Object', () => {
  describe('constructor', () => {
    it('should create a valid user ID', () => {
      // Arrange
      const validId = '1';

      // Act
      const userId = new UserId(validId);

      // Assert
      expect(userId.value).toBe(validId);
    });

    it('should accept UUID format', () => {
      // Arrange
      const uuidId = '123e4567-e89b-12d3-a456-426614174000';

      // Act
      const userId = new UserId(uuidId);

      // Assert
      expect(userId.value).toBe(uuidId);
    });

    it('should throw an error if ID is empty', () => {
      // Arrange
      const emptyId = '';

      // Act & Assert
      expect(() => new UserId(emptyId)).toThrow('User ID cannot be empty');
    });

    it('should throw an error if ID is only whitespace', () => {
      // Arrange
      const whitespaceId = '   ';

      // Act & Assert
      expect(() => new UserId(whitespaceId)).toThrow('User ID cannot be empty');
    });
  });

  describe('equals', () => {
    it('should return true for identical IDs', () => {
      // Arrange
      const id1 = new UserId('1');
      const id2 = new UserId('1');

      // Act
      const result = id1.equals(id2);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false for different IDs', () => {
      // Arrange
      const id1 = new UserId('1');
      const id2 = new UserId('2');

      // Act
      const result = id1.equals(id2);

      // Assert
      expect(result).toBe(false);
    });

    it('should return false for different UUID IDs', () => {
      // Arrange
      const id1 = new UserId('123e4567-e89b-12d3-a456-426614174000');
      const id2 = new UserId('123e4567-e89b-12d3-a456-426614174001');

      // Act
      const result = id1.equals(id2);

      // Assert
      expect(result).toBe(false);
    });
  });
});