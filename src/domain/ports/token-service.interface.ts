import { User } from '../entities/user.entity';

export interface TokenPayload {
  sub: string;
  email: string;
}

export interface TokenValidationResult {
  valid: boolean;
  payload?: TokenPayload;
}

export interface TokenService {
  generateToken(user: User): Promise<string>;
  validateToken(token: string): Promise<TokenValidationResult>;
}