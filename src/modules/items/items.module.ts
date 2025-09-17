import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule], // Vous pouvez même le retirer si PrismaModule est global
  controllers: [ItemsController],
  providers: [ItemsService],
})
export class ItemsModule {}