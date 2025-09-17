import { IsString, IsNotEmpty, IsOptional, IsUrl, IsInt, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ description: 'Category name', example: 'Appetizers' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Category description', example: 'Delicious starters to begin your meal' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Category image URL', example: 'https://example.com/appetizers.jpg' })
  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @ApiPropertyOptional({ description: 'Parent category ID for subcategories', example: 'uuid-string' })
  @IsUUID()
  @IsOptional()
  parentId?: string;

  @ApiPropertyOptional({ description: 'Display order for sorting', example: 1 })
  @IsInt()
  @IsOptional()
  displayOrder?: number;
}