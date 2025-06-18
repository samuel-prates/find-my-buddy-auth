import { Inject, Injectable } from '@nestjs/common';
import { TokenService, TokenValidationResult } from '../../domain/ports/token-service.interface';
import { TOKEN_SERVICE } from '../../domain/ports/injection-tokens';
import { TelemetryService } from '../../telemetry/telemetry.service';

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
    private readonly tokenService: TokenService,
    private readonly telemetryService: TelemetryService
  ) {}

  async execute(input: ValidateTokenUseCaseInput): Promise<ValidateTokenUseCaseOutput> {
    const { token } = input;

    try {
      const result: TokenValidationResult = await this.tokenService.validateToken(token);

      if (!result.valid || !result.payload) {
        // This is not an error, but an expected result for invalid tokens
        // We could log it as information if needed
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
    } catch (error) {
      // Log the error with OpenTelemetry
      this.telemetryService.logError(error, {
        useCase: 'ValidateTokenUseCase',
        // Don't log the full token for security reasons
        tokenProvided: !!token,
      });

      // Return invalid token response instead of throwing the error
      // This provides a consistent API response even when errors occur
      return {
        valid: false,
      };
    }
  }
}
