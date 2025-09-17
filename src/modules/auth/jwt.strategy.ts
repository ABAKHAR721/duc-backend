import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not configured');
    }
    
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  /**
   * Cette méthode est appelée par Passport après avoir vérifié la signature du JWT.
   * Le payload déchiffré est passé en argument.
   * Ce que cette méthode retourne sera attaché à l'objet `request.user`.
   */
  async validate(payload: { sub: string; email: string; role: string }) {
    // La méthode findOne retourne maintenant un utilisateur SANS le mot de passe.
    const user = await this.usersService.findOne(payload.sub);

    if (!user) {
      throw new UnauthorizedException('User not found or token invalid.');
    }

    // LA CORRECTION EST ICI :
    // Puisque 'user' ne contient plus la propriété 'password',
    // nous pouvons le retourner directement.
    return user;
  }
}