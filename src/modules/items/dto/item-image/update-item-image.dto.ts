import { PartialType } from '@nestjs/mapped-types';
import { ItemImageDto } from './create-item-image.dto';

export class UpdateItemDto extends PartialType(ItemImageDto) {}
