import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(AuthGuard('jwt')) 
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Create category', 
    description: 'Create a new category for organizing items' 
  })
  @ApiBody({ type: CreateCategoryDto })
  @ApiResponse({ status: 201, description: 'Category created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all categories', 
    description: 'Retrieve a list of all categories with hierarchical structure' 
  })
  @ApiResponse({ status: 200, description: 'Categories retrieved successfully' })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get category by ID', 
    description: 'Retrieve a specific category by its ID' 
  })
  @ApiParam({ name: 'id', description: 'Category ID', type: 'string' })
  @ApiResponse({ status: 200, description: 'Category found successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt')) 
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Update category', 
    description: 'Update an existing category information' 
  })
  @ApiParam({ name: 'id', description: 'Category ID', type: 'string' })
  @ApiBody({ type: UpdateCategoryDto })
  @ApiResponse({ status: 200, description: 'Category updated successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt')) 
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Delete category', 
    description: 'Delete a category by its ID' 
  })
  @ApiParam({ name: 'id', description: 'Category ID', type: 'string' })
  @ApiResponse({ status: 200, description: 'Category deleted successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiResponse({ status: 409, description: 'Cannot delete category with associated items' })
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
