export class Email {
  private readonly _value: string;
  private static readonly EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  constructor(value: string) {
    this.validate(value);
    this._value = value;
  }

  private validate(email: string): void {
    if (!email || email.trim() === '') {
      throw new Error('Email cannot be empty');
    }

    if (!Email.EMAIL_REGEX.test(email)) {
      throw new Error('Invalid email format');
    }
  }

  public get value(): string {
    return this._value;
  }

  public equals(other: Email): boolean {
    return this._value.toLowerCase() === other.value.toLowerCase();
  }
}