import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { User } from '@prisma/client'; // <-- CHANGEMENT 1 : Importer User depuis Prisma

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Valide les informations de connexion de l'utilisateur.
   */
  async validateUser(authLoginDto: AuthLoginDto): Promise<Omit<User, 'password'> | null> { // <-- CHANGEMENT 2 : Utiliser Omit<User, 'password'>
    const { email, password } = authLoginDto;

    const user = await this.usersService.findOneByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  /**
   * Génère un token d'accès JWT pour un utilisateur validé.
   */
  async login(user: Omit<User, 'password'>): Promise<{ access_token: string }> { // <-- CHANGEMENT 3 : Utiliser le même type ici
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}