import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class SelectiveSanitizeInterceptor implements NestInterceptor {
  // Fields that should be sanitized (only text fields that might contain user input)
  private readonly fieldsToSanitize = [
    'name',
    'description',
    'title',
    'content',
    'message',
    'comment',
    'note'
  ];

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    
    // Only sanitize request body for specific fields
    if (request.body && typeof request.body === 'object') {
      this.sanitizeSelectiveFields(request.body);
    }

    return next.handle();
    // Disabled response sanitization to avoid affecting dates and other data
    // return next.handle().pipe(
    //   map((data) => {
    //     // Sanitize response data selectively
    //     return this.sanitizeSelectiveFields(data);
    //   }),
    // );
  }

  private sanitizeSelectiveFields(obj: any): any {
    if (obj === null || obj === undefined) {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.sanitizeSelectiveFields(item));
    }

    if (typeof obj === 'object') {
      const sanitized = { ...obj };
      for (const key in sanitized) {
        if (sanitized.hasOwnProperty(key)) {
          if (this.fieldsToSanitize.includes(key.toLowerCase()) && typeof sanitized[key] === 'string') {
            console.log(`Selectively sanitizing field: ${key}`);
            sanitized[key] = this.sanitizeString(sanitized[key]);
          } else if (typeof sanitized[key] === 'object') {
            sanitized[key] = this.sanitizeSelectiveFields(sanitized[key]);
          }
        }
      }
      return sanitized;
    }

    return obj;
  }

  private sanitizeString(str: string): string {
    if (typeof str !== 'string') {
      return str;
    }

    // Remove potentially dangerous HTML/JavaScript
    return str
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // Remove iframe tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+\s*=/gi, '') // Remove event handlers like onclick=
      .replace(/&lt;script/gi, '') // Remove encoded script tags
      .replace(/&lt;iframe/gi, '') // Remove encoded iframe tags
      .trim();
  }
}
