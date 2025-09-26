import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/constants/roles.enum';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Items')
@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Admin)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Create item', 
    description: 'Create a new item with variants, images, and options' 
  })
  @ApiBody({ type: CreateItemDto })
  @ApiResponse({ status: 201, description: 'Item created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  create(@Body() createItemDto: CreateItemDto) {
    return this.itemsService.create(createItemDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all items', 
    description: 'Retrieve a list of all items with their variants, images, and options' 
  })
  @ApiResponse({ status: 200, description: 'Items retrieved successfully' })
  findAll() {
    return this.itemsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get item by ID', 
    description: 'Retrieve a specific item by its ID with all related data' 
  })
  @ApiParam({ name: 'id', description: 'Item ID', type: 'string' })
  @ApiResponse({ status: 200, description: 'Item found successfully' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  findOne(@Param('id') id: string) {
    return this.itemsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Admin)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Update item', 
    description: 'Update an existing item and its related data' 
  })
  @ApiParam({ name: 'id', description: 'Item ID', type: 'string' })
  @ApiBody({ type: UpdateItemDto })
  @ApiResponse({ status: 200, description: 'Item updated successfully' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
    return this.itemsService.update(id, updateItemDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.Admin)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Delete item', 
    description: 'Delete an item by its ID along with all related data' 
  })
  @ApiParam({ name: 'id', description: 'Item ID', type: 'string' })
  @ApiResponse({ status: 200, description: 'Item deleted successfully' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  remove(@Param('id') id: string) {
    return this.itemsService.remove(id);
  }

  @Get('category/:categoryName')
  @ApiOperation({  
    summary: 'Get items by category name', 
    description: 'Retrieve all items belonging to a specific category by category name' 
  })
  @ApiParam({ name: 'categoryName', description: 'Category name', type: 'string' })
  @ApiResponse({ status: 200, description: 'Items retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  findByCategory(@Param('categoryName') categoryName: string) {
    return this.itemsService.findByCategory(categoryName);
  }
}
