import { Injectable } from '@nestjs/common';
import { randomBytes, createHmac } from 'crypto';

@Injectable()
export class CsrfService {
  private readonly secret: string;

  constructor() {
    // In production, this should come from environment variables
    this.secret = process.env.CSRF_SECRET || 'default-csrf-secret-change-in-production';
  }

  generateToken(): string {
    const timestamp = Date.now().toString();
    const randomValue = randomBytes(16).toString('hex');
    const payload = `${timestamp}:${randomValue}`;
    const signature = this.createSignature(payload);
    
    return Buffer.from(`${payload}:${signature}`).toString('base64');
  }

  validateToken(token: string): boolean {
    try {
      const decoded = Buffer.from(token, 'base64').toString('utf8');
      const parts = decoded.split(':');
      
      if (parts.length !== 3) {
        return false;
      }

      const [timestamp, randomValue, signature] = parts;
      const payload = `${timestamp}:${randomValue}`;
      const expectedSignature = this.createSignature(payload);

      // Check signature
      if (signature !== expectedSignature) {
        return false;
      }

      // Check if token is not too old (1 hour)
      const tokenTime = parseInt(timestamp, 10);
      const now = Date.now();
      const maxAge = 60 * 60 * 1000; // 1 hour

      return (now - tokenTime) <= maxAge;
    } catch {
      return false;
    }
  }

  private createSignature(payload: string): string {
    return createHmac('sha256', this.secret)
      .update(payload)
      .digest('hex');
  }
}
