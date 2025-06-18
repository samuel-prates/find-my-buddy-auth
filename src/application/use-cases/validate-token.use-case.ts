import { Inject, Injectable } from '@nestjs/common';
import { TokenService, TokenValidationResult } from '../../domain/ports/token-service.interface';
import { TOKEN_SERVICE } from '../../domain/ports/injection-tokens';

export interface ValidateTokenUseCaseInput {
  token: string;
}

export interface ValidateTokenUseCaseOutput {
  valid: boolean;
  user?: {
    userId: string;
    email: string;
  };
}

@Injectable()
export class ValidateTokenUseCase {
  constructor(
    @Inject(TOKEN_SERVICE)
    private readonly tokenService: TokenService
  ) {}

  async execute(input: ValidateTokenUseCaseInput): Promise<ValidateTokenUseCaseOutput> {
    const { token } = input;

    const result: TokenValidationResult = await this.tokenService.validateToken(token);

    if (!result.valid || !result.payload) {
      return {
        valid: false,
      };
    }

    return {
      valid: true,
      user: {
        userId: result.payload.sub,
        email: result.payload.email,
      },
    };
  }
}
