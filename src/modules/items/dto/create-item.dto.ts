import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsArray,
  ValidateNested,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ItemImageDto } from './item-image/create-item-image.dto';
import { ItemVariantDto } from './item-variant/item-variant.dto';
import { ItemOptionDto } from './item-option/item-option.dto';

export class CreateItemDto {
  @ApiProperty({ description: 'Item name', example: 'Margherita Pizza' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Item description', example: 'Classic pizza with tomato sauce, mozzarella, and basil' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Category ID this item belongs to', example: 'uuid-string' })
  @IsUUID()
  categoryId: string;

  @ApiPropertyOptional({ 
    description: 'Item status', 
    example: 'Available',
    enum: ['Available', 'Unavailable', 'Discontinued']
  })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({ 
    description: 'Item variants (sizes, types, etc.)', 
    type: [ItemVariantDto]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemVariantDto)
  @IsOptional()
  variants?: ItemVariantDto[];

  @ApiPropertyOptional({ 
    description: 'Item images', 
    type: [ItemImageDto]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemImageDto)
  @IsOptional()
  images?: ItemImageDto[];

  @ApiPropertyOptional({ 
    description: 'Item options (addons, modifiers)', 
    type: [ItemOptionDto]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemOptionDto)
  @IsOptional()
  options?: ItemOptionDto[];
}