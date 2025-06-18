import { Body, Controller, Post, UnauthorizedException as NestUnauthorizedException } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { ValidateTokenUseCase } from '../../application/use-cases/validate-token.use-case';
import { LoginDto } from '../dtos/login.dto';
import { LoginResponseDto } from '../dtos/login-response.dto';
import { ValidateTokenDto } from '../dtos/validate-token.dto';
import { ValidateTokenResponseDto } from '../dtos/validate-token-response.dto';
import { UnauthorizedException } from '../../domain/exceptions/unauthorized.exception';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly validateTokenUseCase: ValidateTokenUseCase,
  ) {}

  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    try {
      const result = await this.loginUseCase.execute({
        email: loginDto.email,
        password: loginDto.senha,
      });
      
      return { token: result.token };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new NestUnauthorizedException(error.message);
      }
      throw error;
    }
  }

  @Post('validate')
  @ApiOperation({ summary: 'Validate JWT token' })
  @ApiResponse({
    status: 200,
    description: 'Token validation result',
    type: ValidateTokenResponseDto,
  })
  async validateToken(
    @Body() validateTokenDto: ValidateTokenDto,
  ): Promise<ValidateTokenResponseDto> {
    const result = await this.validateTokenUseCase.execute({
      token: validateTokenDto.token,
    });
    
    return result;
  }
}