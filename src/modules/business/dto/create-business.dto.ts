import { IsString, IsNotEmpty, IsOptional, IsEmail, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBusinessDto {
  @ApiProperty({ description: 'Business name', example: 'My Restaurant' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Business logo URL', example: 'https://example.com/logo.png' })
  @IsUrl()
  @IsOptional()
  logoUrl?: string;

  @ApiPropertyOptional({ description: 'Business favicon URL', example: 'https://example.com/favicon.ico' })
  @IsUrl()
  @IsOptional()
  faviconUrl?: string;

  @ApiPropertyOptional({ description: 'Business email', example: 'contact@restaurant.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ description: 'Business phone number', example: '+1234567890' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ description: 'Business address', example: '123 Main St, City, State' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ description: 'Business description', example: 'Best restaurant in town' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Currency code', example: 'USD' })
  @IsString()
  @IsNotEmpty()
  currency: string;
  
  
  @ApiPropertyOptional({ description: 'Business slogan', example: 'Taste the difference' })
  @IsString()
  @IsOptional()
  slogan?: string;
  
  @ApiPropertyOptional({ description: 'Business hours', example: 'Mon-Fri: 9AM-10PM' })
  @IsString()
  @IsOptional()
  hours?: string;

  @ApiPropertyOptional({ description: 'Facebook page URL', example: 'https://facebook.com/myrestaurant' })
  @IsUrl()
  @IsOptional()
  urlFacebook?: string;

  @ApiPropertyOptional({ description: 'Instagram profile URL', example: 'https://instagram.com/myrestaurant' })
  @IsUrl()
  @IsOptional()
  urlInstagram?: string;

  @ApiPropertyOptional({ description: 'LinkedIn profile URL', example: 'https://linkedin.com/company/myrestaurant' })
  @IsUrl()
  @IsOptional()
  urlLinkedin?: string;

  @ApiPropertyOptional({ description: 'Uber Eats restaurant URL', example: 'https://ubereats.com/restaurant' })
  @IsUrl()
  @IsOptional()
  uberEatsUrl?: string;

  @ApiPropertyOptional({ description: 'Google Maps location URL', example: 'https://maps.google.com/location' })
  @IsUrl()
  @IsOptional()
  googleMapsUrl?: string;
}