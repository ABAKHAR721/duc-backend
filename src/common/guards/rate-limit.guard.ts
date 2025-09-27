import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

@Injectable()
export class RateLimitGuard implements CanActivate {
  private store: RateLimitStore = {};
  private readonly defaultLimit = 100; // requests per window
  private readonly defaultWindow = 15 * 60 * 1000; // 15 minutes

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const ip = this.getClientIp(request);
    const key = `${ip}:${request.route?.path || request.url}`;

    // Clean up expired entries
    this.cleanup();

    const now = Date.now();
    const record = this.store[key];

    if (!record) {
      this.store[key] = {
        count: 1,
        resetTime: now + this.defaultWindow,
      };
      return true;
    }

    if (now > record.resetTime) {
      // Reset the counter
      this.store[key] = {
        count: 1,
        resetTime: now + this.defaultWindow,
      };
      return true;
    }

    if (record.count >= this.defaultLimit) {
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: 'Too many requests',
          error: 'Rate limit exceeded',
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    record.count++;
    return true;
  }

  private getClientIp(request: any): string {
    return (
      request.headers['x-forwarded-for'] ||
      request.headers['x-real-ip'] ||
      request.connection?.remoteAddress ||
      request.socket?.remoteAddress ||
      request.ip ||
      'unknown'
    );
  }

  private cleanup(): void {
    const now = Date.now();
    Object.keys(this.store).forEach((key) => {
      if (now > this.store[key].resetTime) {
        delete this.store[key];
      }
    });
  }
}
