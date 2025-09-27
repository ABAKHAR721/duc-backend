import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CsrfService } from '../services/csrf.service';
import { SkipCsrf } from '../decorators/skip-csrf.decorator';

@ApiTags('Security')
@Controller('csrf')
export class CsrfController {
  constructor(private readonly csrfService: CsrfService) {}

  @Get('token')
  @SkipCsrf()
  @ApiOperation({ summary: 'Get CSRF token' })
  @ApiResponse({ 
    status: 200, 
    description: 'CSRF token generated successfully',
    schema: {
      type: 'object',
      properties: {
        csrfToken: { type: 'string' }
      }
    }
  })
  getCsrfToken() {
    return {
      csrfToken: this.csrfService.generateToken(),
    };
  }
}
