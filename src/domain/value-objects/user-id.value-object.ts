export class UserId {
  private readonly _value: string;

  constructor(value: string) {
    this.validate(value);
    this._value = value;
  }

  private validate(id: string): void {
    if (!id || id.trim() === '') {
      throw new Error('User ID cannot be empty');
    }
  }

  public get value(): string {
    return this._value;
  }

  public equals(other: UserId): boolean {
    return this._value === other.value;
  }
}