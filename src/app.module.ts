import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { BusinessModule } from './modules/business/business.module';
import { UsersModule } from './modules/users/users.module';
import { EventsModule } from './modules/events/events.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ItemsModule } from './modules/items/items.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    // 1. Module de configuration pour les variables d'environnement (.env)
    ConfigModule.forRoot({
      isGlobal: true, // Rend la configuration accessible dans toute l'application
    }),

    // 2. Module TypeORM pour la connexion à la base de données
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        entities: [__dirname + '/modules/**/*.entity{.ts,.js}'],
        synchronize: true, // `true` est pratique pour le dev, mais doit être `false` en production
        ssl:
          process.env.NODE_ENV === 'production'
            ? { rejectUnauthorized: false }
            : false,
      }),
    }),

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