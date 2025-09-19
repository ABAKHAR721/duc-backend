import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../constants/roles.enum'; // Importer l'Enum

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Récupérer les rôles requis pour la route (ex: [Role.Admin])
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si aucun rôle n'est requis, on autorise l'accès.
    if (!requiredRoles) {
      return true;
    }

    // 2. Récupérer l'utilisateur attaché à la requête par le AuthGuard
    const { user } = context.switchToHttp().getRequest();
    if (!user || !user.role) {
      return false; // Si pas d'utilisateur ou de rôle, refuser
    }

    // 3. LOGIQUE DE HIÉRARCHIE : Si l'utilisateur est SuperAdmin, il a accès à tout.
    if (user.role === Role.SuperAdmin) {
      return true;
    }

    // 4. Sinon, on vérifie si son rôle correspond à l'un des rôles requis.
    return requiredRoles.some((role) => user.role === role);
  }
}