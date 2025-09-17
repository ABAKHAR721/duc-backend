import { IsUrl, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ItemImageDto {
  @ApiProperty({ description: 'Image URL', example: 'https://example.com/item-image.jpg' })
  @IsUrl()
  imageUrl: string;

  @ApiPropertyOptional({ description: 'Is this the default image', example: true })
  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}