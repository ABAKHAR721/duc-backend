import { IsString, IsNotEmpty, IsEmail, MinLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'User full name', example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'User email address', example: 'john.doe@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ 
    description: 'User password (minimum 8 characters)', 
    example: 'securePassword123',
    minLength: 8
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @ApiProperty({ 
    description: 'User role', 
    example: 'Admin',
    enum: ['Admin', 'Manager', 'Staff']
  })
  @IsString()
  @IsNotEmpty()
  role: string;

  @ApiPropertyOptional({ description: 'User phone number', example: '+1234567890' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ 
    description: 'User status', 
    example: 'Active',
    enum: ['Active', 'Inactive', 'Suspended']
  })
  @IsString()
  @IsOptional()
  status?: string;
}