import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CsrfService } from '../services/csrf.service';

@Injectable()
export class CsrfGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private csrfService: CsrfService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const method = request.method.toUpperCase();

    // Only check CSRF for state-changing methods (not GET, HEAD, OPTIONS)
    if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
      return true;
    }

    // Skip CSRF check for certain routes (like login)
    const skipCsrf = this.reflector.get<boolean>('skipCsrf', context.getHandler());
    if (skipCsrf) {
      return true;
    }

    const token = request.headers['x-csrf-token'] || request.body?._csrf;

    if (!token) {
      throw new ForbiddenException('CSRF token missing');
    }

    if (!this.csrfService.validateToken(token)) {
      throw new ForbiddenException('Invalid CSRF token');
    }

    return true;
  }
}
