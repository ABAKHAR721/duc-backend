import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { BusinessModule } from './modules/business/business.module';
import { UsersModule } from './modules/users/users.module';
import { EventsModule } from './modules/events/events.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ItemsModule } from './modules/items/items.module';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
@Module({
  imports: [
    // 1. Module de configuration pour les variables d'environnement (.env)
    ConfigModule.forRoot({
      isGlobal: true, // Rend la configuration accessible dans toute l'application
    }),

    // 2. Module Prisma pour la connexion à la base de données
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,

    // 3. Modules de fonctionnalités de l'application
    BusinessModule,
    UsersModule,
    EventsModule,
    CategoriesModule,
    ItemsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}