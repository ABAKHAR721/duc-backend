import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module'; // Important !
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy'; // Nous allons créer ce fichier
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [
    UsersModule, // Pour accéder à UsersService
    PrismaModule, // Pour accéder à PrismaService
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // Clé secrète depuis .env
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN', '3600s'), // Durée de validité du token
        },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy], // Ne pas oublier d'enregistrer la stratégie
  controllers: [AuthController],
})
export class AuthModule {}