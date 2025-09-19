import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { UsersModule } from '../users/users.module'; // Importer pour accéder à UsersService
import { PrismaModule } from 'src/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config'; // Importer pour ConfigService

@Module({
  imports: [PrismaModule, UsersModule, ConfigModule], // Importer les modules nécessaires
  providers: [SeederService],
})
export class SeederModule {}