import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ItemOptionDto {
  @ApiProperty({ description: 'Option name', example: 'Extra Cheese' })
  @IsString()
  @IsNotEmpty()
  optionName: string;

  @ApiProperty({ description: 'Option value', example: 'value ' })
  @IsString()
  @IsNotEmpty()
  optionValue: string;
  @ApiPropertyOptional({ 
    description: 'Option type', 
    example: 'addon',
    enum: ['addon', 'modifier', 'choice']
  })
  @IsString()
  @IsOptional()
  optionType?: string;
}