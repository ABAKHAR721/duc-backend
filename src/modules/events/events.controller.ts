import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/constants/roles.enum';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Admin)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Create event', 
    description: 'Create a new event with dates and details' 
  })
  @ApiBody({ type: CreateEventDto })
  @ApiResponse({ status: 201, description: 'Event created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }
 
  @Get()
  @ApiOperation({ 
    summary: 'Get all events', 
    description: 'Retrieve a list of all events with their status and dates' 
  })
  @ApiResponse({ status: 200, description: 'Events retrieved successfully' })
  findAll() {
    return this.eventsService.findAll();
  }

  @Get('header')
  @ApiOperation({ 
    summary: 'Get all events header', 
    description: 'Retrieve a list of all events header with their status and dates' 
  })
  @ApiResponse({ status: 200, description: 'Events header retrieved successfully' })
  findAllHeader() {
    return this.eventsService.findAllHeader();
  }

  @Get('promo')
  @ApiOperation({ 
    summary: 'Get promotional events', 
    description: 'Retrieve all active promotional events for marketing display' 
  })
  @ApiResponse({ status: 200, description: 'Promotional events retrieved successfully' })
  findPromoEvents() {
    return this.eventsService.findPromoEvents();
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get event by ID', 
    description: 'Retrieve a specific event by its ID' 
  })
  @ApiParam({ name: 'id', description: 'Event ID', type: 'string' })
  @ApiResponse({ status: 200, description: 'Event found successfully' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Admin)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Update event', 
    description: 'Update an existing event information' 
  })
  @ApiParam({ name: 'id', description: 'Event ID', type: 'string' })
  @ApiBody({ type: UpdateEventDto })
  @ApiResponse({ status: 200, description: 'Event updated successfully' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(id, updateEventDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Admin)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Delete event', 
    description: 'Delete an event by its ID' 
  })
  @ApiParam({ name: 'id', description: 'Event ID', type: 'string' })
  @ApiResponse({ status: 200, description: 'Event deleted successfully' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }
}
