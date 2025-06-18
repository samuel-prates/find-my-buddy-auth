import { Email } from '../../../../src/domain/value-objects/email.value-object';

describe('Email Value Object', () => {
  describe('constructor', () => {
    it('should create a valid email', () => {
      // Arrange
      const validEmail = 'user@example.com';

      // Act
      const email = new Email(validEmail);

      // Assert
      expect(email.value).toBe(validEmail);
    });

    it('should throw an error if email is empty', () => {
      // Arrange
      const emptyEmail = '';

      // Act & Assert
      expect(() => new Email(emptyEmail)).toThrow('Email cannot be empty');
    });

    it('should throw an error if email is only whitespace', () => {
      // Arrange
      const whitespaceEmail = '   ';

      // Act & Assert
      expect(() => new Email(whitespaceEmail)).toThrow('Email cannot be empty');
    });

    it('should throw an error if email format is invalid', () => {
      // Arrange
      const invalidEmails = [
        'plainaddress',
        '@example.com',
        'email.example.com',
        'email@example@example.com',
        'email@example',
        'email@example.c', // TLD too short
        'email@.com',
        'email@example.',
        'email@123.123.123.123', // IP address not supported by the regex
      ];

      // Act & Assert
      invalidEmails.forEach(invalidEmail => {
        expect(() => new Email(invalidEmail)).toThrow('Invalid email format');
      });
    });

    it('should accept valid email formats', () => {
      // Arrange
      const validEmails = [
        'email@example.com',
        'firstname.lastname@example.com',
        'email@subdomain.example.com',
        'firstname+lastname@example.com',
        '1234567890@example.com',
        'email@example-one.com',
        '_______@example.com',
        'email@example.name',
        'email@example.museum',
        'email@example.co.jp',
        'firstname-lastname@example.com',
        'email.email@example.com',
        'email@-example.com', // Hyphen at start of domain is allowed by the regex
        'email@example..com', // Double dots in domain is allowed by the regex
      ];

      // Act & Assert
      validEmails.forEach(validEmail => {
        expect(() => new Email(validEmail)).not.toThrow();
      });
    });
  });

  describe('equals', () => {
    it('should return true for identical emails', () => {
      // Arrange
      const email1 = new Email('user@example.com');
      const email2 = new Email('user@example.com');

      // Act
      const result = email1.equals(email2);

      // Assert
      expect(result).toBe(true);
    });

    it('should return true for emails with different case', () => {
      // Arrange
      const email1 = new Email('user@example.com');
      const email2 = new Email('USER@example.com');

      // Act
      const result = email1.equals(email2);

      // Assert
      expect(result).toBe(true);
    });

    it('should return false for different emails', () => {
      // Arrange
      const email1 = new Email('user1@example.com');
      const email2 = new Email('user2@example.com');

      // Act
      const result = email1.equals(email2);

      // Assert
      expect(result).toBe(false);
    });
  });
});
