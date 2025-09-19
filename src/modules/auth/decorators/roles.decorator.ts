import { SetMetadata } from '@nestjs/common';
import { Role } from '../constants/roles.enum'; // Importer l'Enum

export const ROLES_KEY = 'roles';
// Le décorateur attend maintenant des valeurs de type Role
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);