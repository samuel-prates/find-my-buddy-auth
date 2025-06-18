import * as bcrypt from 'bcrypt';

export class Password {
  private readonly _value: string;
  private readonly _isHashed: boolean;
  private static readonly SALT_ROUNDS = 10;
  private static readonly MIN_LENGTH = 6;

  private constructor(value: string, isHashed: boolean) {
    this._value = value;
    this._isHashed = isHashed;
  }

  public static fromPlain(plainPassword: string): Password {
    Password.validatePlainPassword(plainPassword);
    return new Password(plainPassword, false);
  }

  public static fromHashed(hashedPassword: string): Password {
    if (!hashedPassword || hashedPassword.trim() === '') {
      throw new Error('Hashed password cannot be empty');
    }
    return new Password(hashedPassword, true);
  }

  private static validatePlainPassword(password: string): void {
    if (!password || password.trim() === '') {
      throw new Error('Password cannot be empty');
    }

    if (password.length < Password.MIN_LENGTH) {
      throw new Error(`Password must be at least ${Password.MIN_LENGTH} characters long`);
    }
  }

  public async compare(plainPassword: string): Promise<boolean> {
    if (this._isHashed) {
      return bcrypt.compare(plainPassword, this._value);
    }
    return this._value === plainPassword;
  }

  public async hash(): Promise<string> {
    if (this._isHashed) {
      return this._value;
    }
    return bcrypt.hash(this._value, Password.SALT_ROUNDS);
  }

  public get value(): string {
    return this._value;
  }

  public get isHashed(): boolean {
    return this._isHashed;
  }
}