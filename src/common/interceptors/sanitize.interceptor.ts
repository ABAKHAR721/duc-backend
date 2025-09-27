import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class SanitizeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    
    // Sanitize request body (this is the most important for security)
    if (request.body && typeof request.body === 'object') {
      this.sanitizeObjectInPlace(request.body);
    }
    
    // Note: We skip query and params sanitization to avoid read-only property issues
    // The main security benefit comes from sanitizing request body and response data
    // Query and params are typically handled by validation pipes anyway

    return next.handle().pipe(
      map((data) => {
        // Sanitize response data
        return this.sanitizeObject(data);
      }),
    );
  }

  private sanitizeObjectInPlace(obj: any): void {
    if (obj === null || obj === undefined || typeof obj !== 'object') {
      return;
    }

    if (Array.isArray(obj)) {
      for (let i = 0; i < obj.length; i++) {
        if (typeof obj[i] === 'string') {
          const original = obj[i];
          obj[i] = this.sanitizeString(obj[i]);
          if (original !== obj[i]) {
            console.log(`Sanitization changed array[${i}]:`, original, '->', obj[i]);
          }
        } else if (typeof obj[i] === 'object') {
          this.sanitizeObjectInPlace(obj[i]);
        }
      }
    } else {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (typeof obj[key] === 'string') {
            const original = obj[key];
            obj[key] = this.sanitizeString(obj[key]);
            if (original !== obj[key]) {
              console.log(`Sanitization changed ${key}:`, original, '->', obj[key]);
            }
          } else if (typeof obj[key] === 'object') {
            this.sanitizeObjectInPlace(obj[key]);
          }
        }
      }
    }
  }

  private sanitizeObject(obj: any): any {
    if (obj === null || obj === undefined) {
      return obj;
    }

    if (typeof obj === 'string') {
      return this.sanitizeString(obj);
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.sanitizeObject(item));
    }

    if (typeof obj === 'object') {
      const sanitized = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          sanitized[key] = this.sanitizeObject(obj[key]);
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

    // Check if it's a valid date string - if so, don't sanitize it
    if (this.isValidDateString(str)) {
      console.log('Preserving date string:', str);
      return str;
    }

    // Check if it's a URL - be more careful with URL sanitization
    if (this.isURL(str)) {
      console.log('Sanitizing URL:', str);
      // Only remove dangerous protocols, keep the URL structure
      return str.replace(/javascript:/gi, '').replace(/data:/gi, '');
    }

    console.log('Sanitizing regular string:', str);
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

  private isValidDateString(str: string): boolean {
    // Simple check: if it's a valid date and looks like an ISO string
    if (str.length < 10) return false; // Too short to be a date
    
    // Check if it contains date-like patterns
    const hasDatePattern = /\d{4}-\d{2}-\d{2}/.test(str);
    const isValidDate = !isNaN(Date.parse(str));
    
    console.log(`isValidDateString check for "${str}":`, {
      hasDatePattern,
      isValidDate,
      result: hasDatePattern && isValidDate
    });
    
    return hasDatePattern && isValidDate;
  }

  private isURL(str: string): boolean {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  }
}
