import { IsString, IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ItemOptionDto {
  @ApiProperty({ description: 'Option type', example: 'VEGETARIENNE,ALLERGENES,BASE' })
  @IsString()
  @IsNotEmpty()
  optionType: string;
  
  @ApiProperty({  
    description: 'Option value', 
    example: 'VEGETARIENNE oui ou non,ALLERGENES ["Lait", "Soja"],BASE "Tomate ou bien Crème"'
  })
  @IsOptional()
  optionValue?: string[];
}