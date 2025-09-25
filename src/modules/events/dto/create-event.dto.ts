import { IsString, IsNotEmpty, IsOptional, IsUrl, IsDateString, ValidateIf } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateEventDto {
  @ApiProperty({ description: 'Event name', example: 'Summer Festival' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Event description', example: 'Join us for a wonderful summer celebration' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Event image URL', example: 'https://example.com/event.jpg' })
  @Transform(({ value }) => value === '' ? undefined : value)
  @ValidateIf((o) => o.imageUrl && o.imageUrl.trim() !== '')
  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @ApiPropertyOptional({ description: 'Event start date', example: '2024-06-01T10:00:00Z' })
  @IsDateString()
  @IsOptional()
  startDate?: Date;

  @ApiPropertyOptional({ description: 'Event end date', example: '2024-06-01T18:00:00Z' })
  @IsDateString()
  @IsOptional()
  endDate?: Date;

  @ApiPropertyOptional({ description: 'Event status', example: 'Active', enum: ['Active', 'Inactive', 'Cancelled'] })
  @IsString()
  @IsOptional()
  status?: string;
 
  @ApiPropertyOptional({ description: 'Event type', example: 'Online' })
  @Transform(({ value }) => value === '' ? undefined : value)
  @IsString()
  @IsOptional()
  eventType?: string;
}