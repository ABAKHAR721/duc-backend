import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { ItemVariant } from './entities/item-variant.entity';
import { ItemImage } from './entities/item-image.entity';
import { ItemOption } from './entities/item-option.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Item, ItemVariant, ItemImage, ItemOption]),
  ],
  controllers: [ItemsController],
  providers: [ItemsService],
})
export class ItemsModule {}