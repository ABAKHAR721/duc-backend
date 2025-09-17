import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthLoginDto {
  @ApiProperty({ 
    description: 'User email address', 
    example: 'user@example.com' 
  })
  @IsEmail()
  email: string;

  @ApiProperty({ 
    description: 'User password (minimum 8 characters)', 
    example: 'password123',
    minLength: 8
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}