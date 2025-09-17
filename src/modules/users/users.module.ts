import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule], // Assurez-vous que Prisma est disponible
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],// Nous exportons le service pour l'utiliser dans le module d'authentification plus tard
})
export class UsersModule {}