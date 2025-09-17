import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    // Injection du service des utilisateurs pour trouver un utilisateur par email.
    private readonly usersService: UsersService,
    // Injection du service JWT pour créer et signer les tokens.
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Valide les informations de connexion de l'utilisateur.
   *
   * @param authLoginDto - Le DTO contenant l'email et le mot de passe de l'utilisateur.
   * @returns L'entité User si les informations sont valides, sinon null.
   */
  async validateUser(authLoginDto: AuthLoginDto): Promise<Partial<User> | null> {
    const { email, password } = authLoginDto;

    // 1. Récupérer l'utilisateur par son email.
    // Important : la méthode findOneByEmail doit récupérer le mot de passe haché.
    const user = await this.usersService.findOneByEmail(email);

    // 2. Vérifier si l'utilisateur existe ET si le mot de passe fourni correspond au hash en BDD.
    if (user && (await bcrypt.compare(password, user.password))) {
      // 3. Si tout est correct, on retourne l'utilisateur sans son mot de passe pour la sécurité.
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }

    // 4. Si l'utilisateur n'existe pas ou si le mot de passe est incorrect, on retourne null.
    return null;
  }

  /**
   * Génère un token d'accès JWT pour un utilisateur validé.
   *
   * @param user - L'objet utilisateur (partiel, sans le mot de passe) retourné par validateUser.
   * @returns Un objet contenant le jeton d'accès signé.
   */
  async login(user: Partial<User>): Promise<{ access_token: string }> {
    // Le "payload" est l'ensemble des informations que nous voulons stocker dans le token.
    // Il ne faut jamais y mettre d'informations sensibles comme le mot de passe.
    const payload = {
      email: user.email,
      sub: user.id, // 'sub' (subject) est la convention standard pour l'ID de l'utilisateur.
      role: user.role, // Inclure le rôle est très utile pour la gestion des autorisations.
    };

    // Le JwtService utilise la clé secrète (JWT_SECRET) pour signer le payload
    // et créer le token final.
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}