import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('API Status')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Get API status', description: 'Returns the current status of the API' })
  @ApiResponse({ status: 200, description: 'API status retrieved successfully' })
  getApiStatus(): { status: string; message: string } {
    return this.appService.getApiStatus();
  }
}