import { ApiProperty } from '@nestjs/swagger';

export class ValidateTokenResponseDto {
  @ApiProperty({
    description: 'Whether the token is valid',
    example: true,
  })
  valid: boolean;

  @ApiProperty({
    description: 'User information from the token (if valid)',
    example: { userId: '123', email: 'user@example.com' },
    required: false,
  })
  user?: {
    userId: string;
    email: string;
  };
}