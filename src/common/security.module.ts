import { Module, Global } from '@nestjs/common';
import { CsrfService } from './services/csrf.service';
import { CsrfController } from './controllers/csrf.controller';
import { CsrfGuard } from './guards/csrf.guard';
import { RateLimitGuard } from './guards/rate-limit.guard';
import { SanitizeInterceptor } from './interceptors/sanitize.interceptor';
import { SelectiveSanitizeInterceptor } from './interceptors/selective-sanitize.interceptor';

@Global()
@Module({
  providers: [
    CsrfService,
    CsrfGuard,
    RateLimitGuard,
    SanitizeInterceptor,
    SelectiveSanitizeInterceptor,
  ],
  controllers: [CsrfController],
  exports: [
    CsrfService,
    CsrfGuard,
    RateLimitGuard,
    SanitizeInterceptor,
    SelectiveSanitizeInterceptor,
  ],
})
export class SecurityModule {}
