import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

// Application layer
import { LoginUseCase } from '../application/use-cases/login.use-case';
import { ValidateTokenUseCase } from '../application/use-cases/validate-token.use-case';

// Domain layer
import { UserRepository } from '../domain/ports/user-repository.interface';
import { TokenService } from '../domain/ports/token-service.interface';
import { USER_REPOSITORY, TOKEN_SERVICE } from '../domain/ports/injection-tokens';

// Infrastructure layer
import { UserEntity } from '../infrastructure/entities/user.entity';
import { TypeOrmUserRepository } from '../infrastructure/repositories/typeorm-user.repository';
import { JwtTokenService } from '../infrastructure/services/jwt-token.service';
import { JwtStrategy } from './strategies/jwt.strategy';

// Presentation layer
import { AuthController } from '../presentation/controllers/auth.controller';

// Constants
import { jwtConstants } from './constants';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    // Use cases
    LoginUseCase,
    ValidateTokenUseCase,

    // Infrastructure implementations
    {
      provide: USER_REPOSITORY,
      useClass: TypeOrmUserRepository,
    },
    {
      provide: TOKEN_SERVICE,
      useClass: JwtTokenService,
    },

    // Passport strategy
    JwtStrategy,
  ],
  exports: [LoginUseCase, ValidateTokenUseCase],
})
export class AuthModule {}
