import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../domain/entities/user.entity';
import { TokenPayload, TokenService, TokenValidationResult } from '../../domain/ports/token-service.interface';

@Injectable()
export class JwtTokenService implements TokenService {
  constructor(private readonly jwtService: JwtService) {}

  async generateToken(user: User): Promise<string> {
    const payload: TokenPayload = {
      sub: user.id,
      email: user.email,
    };

    return this.jwtService.sign(payload);
  }

  async validateToken(token: string): Promise<TokenValidationResult> {
    try {
      const payload = this.jwtService.verify(token) as TokenPayload;
      return {
        valid: true,
        payload,
      };
    } catch (error) {
      return {
        valid: false,
      };
    }
  }
}