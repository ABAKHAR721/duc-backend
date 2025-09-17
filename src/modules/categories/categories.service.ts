import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = this.categoriesRepository.create(createCategoryDto);
    return this.categoriesRepository.save(category);
  }

  // Retourne les catégories de premier niveau avec leurs enfants directs
  findAll(): Promise<Category[]> {
    return this.categoriesRepository.find({
      where: { parentId: IsNull() }, // Ne prend que les catégories racines
      relations: ['children'], // Charge les sous-catégories
      order: { displayOrder: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoriesRepository.findOne({
      where: { id },
      relations: ['children', 'items'], // Charge les enfants et les articles associés
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const result = await this.categoriesRepository.update(id, updateCategoryDto);
    if (result.affected === 0) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    // Note: la contrainte ON DELETE SET NULL dans l'entité
    // fera que les enfants de la catégorie supprimée deviendront des catégories racines.
    const result = await this.categoriesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
  }
}