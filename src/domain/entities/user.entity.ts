import { Email } from '../value-objects/email.value-object';
import { Password } from '../value-objects/password.value-object';
import { UserId } from '../value-objects/user-id.value-object';

export class User {
  private readonly _id: UserId;
  private readonly _email: Email;
  private readonly _password: Password;

  private constructor(id: UserId, email: Email, password: Password) {
    this._id = id;
    this._email = email;
    this._password = password;
  }

  public static create(id: string, email: string, hashedPassword: string): User {
    const userId = new UserId(id);
    const userEmail = new Email(email);
    const userPassword = Password.fromHashed(hashedPassword);

    return new User(userId, userEmail, userPassword);
  }

  public static register(id: string, email: string, plainPassword: string): User {
    const userId = new UserId(id);
    const userEmail = new Email(email);
    const userPassword = Password.fromPlain(plainPassword);

    return new User(userId, userEmail, userPassword);
  }

  public get id(): string {
    return this._id.value;
  }

  public get email(): string {
    return this._email.value;
  }

  public async getHashedPassword(): Promise<string> {
    return this._password.hash();
  }

  public async validatePassword(plainPassword: string): Promise<boolean> {
    return this._password.compare(plainPassword);
  }
}
