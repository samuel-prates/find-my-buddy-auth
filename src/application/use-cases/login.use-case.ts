import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { TokenService } from '../../domain/ports/token-service.interface';
import { UserRepository } from '../../domain/ports/user-repository.interface';
import { TOKEN_SERVICE, USER_REPOSITORY } from '../../domain/ports/injection-tokens';
import { UnauthorizedException } from '../../domain/exceptions/unauthorized.exception';
import { TelemetryService } from '../../telemetry/telemetry.service';

export interface LoginUseCaseInput {
  email: string;
  password: string;
}

export interface LoginUseCaseOutput {
  token: string;
}

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(TOKEN_SERVICE)
    private readonly tokenService: TokenService,
    private readonly telemetryService: TelemetryService,
  ) {}

  async execute(input: LoginUseCaseInput): Promise<LoginUseCaseOutput> {
    const { email, password } = input;

    try {
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        const error = new UnauthorizedException('Invalid credentials');
        this.telemetryService.logError(error, {
          useCase: 'LoginUseCase',
          email,
          reason: 'User not found',
        });
        throw error;
      }

      const isPasswordValid = await user.validatePassword(password);
      if (!isPasswordValid) {
        const error = new UnauthorizedException('Invalid credentials');
        this.telemetryService.logError(error, {
          useCase: 'LoginUseCase',
          email,
          reason: 'Invalid password',
        });
        throw error;
      }

      const token = await this.tokenService.generateToken(user);
      return { token };
    } catch (error) {
      // Only log errors that aren't already logged
      if (!(error instanceof UnauthorizedException)) {
        this.telemetryService.logError(error, {
          useCase: 'LoginUseCase',
          email,
          // Don't log passwords
        });
      }
      throw error;
    }
  }
}
