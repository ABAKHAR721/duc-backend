import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ItemVariantDto {
  @ApiProperty({ description: 'Variant name', example: 'Large' })
  @IsString()
  @IsNotEmpty()
  variantName: string;

  @ApiProperty({ description: 'Variant price', example: 12.99 })
  @IsNumber()
  price: number;

  @ApiPropertyOptional({ description: 'Stock keeping unit', example: 'ITEM-001-L' })
  @IsString()
  @IsOptional()
  sku?: string;
}
