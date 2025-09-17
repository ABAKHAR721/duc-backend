import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { BusinessService } from './business.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Business Management')
@Controller('business') 
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Post()
  @UseGuards(AuthGuard('jwt')) 
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Create business', 
    description: 'Create a new business with company information and settings' 
  })
  @ApiBody({ type: CreateBusinessDto })
  @ApiResponse({ status: 201, description: 'Business created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createBusinessDto: CreateBusinessDto) {
    return this.businessService.create(createBusinessDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all businesses', 
    description: 'Retrieve a list of all businesses' 
  })
  @ApiResponse({ status: 200, description: 'Businesses retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll() {
    return this.businessService.findAll();
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get business by ID', 
    description: 'Retrieve a specific business by its ID' 
  })
  @ApiParam({ name: 'id', description: 'Business ID', type: 'uuid' })
  @ApiResponse({ status: 200, description: 'Business found successfully' })
  @ApiResponse({ status: 404, description: 'Business not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findOne(@Param('id') id: string) {
    return this.businessService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt')) 
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Update business', 
    description: 'Update an existing business information' 
  })
  @ApiParam({ name: 'id', description: 'Business ID', type: 'uuid' })
  @ApiBody({ type: UpdateBusinessDto })
  @ApiResponse({ status: 200, description: 'Business updated successfully' })
  @ApiResponse({ status: 404, description: 'Business not found' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(@Param('id') id: string, @Body() updateBusinessDto: UpdateBusinessDto) {
    return this.businessService.update(id, updateBusinessDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt')) 
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Delete business', 
    description: 'Delete a business by its ID' 
  })
  @ApiParam({ name: 'id', description: 'Business ID', type: 'uuid' })
  @ApiResponse({ status: 200, description: 'Business deleted successfully' })
  @ApiResponse({ status: 404, description: 'Business not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  remove(@Param('id') id: string) {
    return this.businessService.remove(id);
  }
}
