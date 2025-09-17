import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Category } from '@prisma/client';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Crée une nouvelle catégorie.
   */
  create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.prisma.category.create({
      data: createCategoryDto,
    });
  }

  /**
   * Retourne toutes les catégories de premier niveau (racines)
   * avec leurs enfants directs (sous-catégories).
   */
  findAll(): Promise<Category[]> {
    return this.prisma.category.findMany({
      where: { parentId: null }, // Filtre pour ne prendre que les catégories sans parent
      include: {
        children: true, // Inclut les sous-catégories
      },
      orderBy: {
        displayOrder: 'asc', // Trie par ordre d'affichage
      },
    });
  }

  /**
   * Récupère une catégorie spécifique par son ID,
   * avec ses enfants (sous-catégories) et les articles qu'elle contient.
   */
  async findOne(id: string): Promise<Category> {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        children: true, // Inclut les sous-catégories
        items: true, // Inclut les articles de cette catégorie
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID "${id}" not found`);
    }
    return category;
  }

  /**
   * Met à jour une catégorie par son ID.
   */
  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    try {
      return await this.prisma.category.update({
        where: { id },
        data: updateCategoryDto,
      });
    } catch (error) {
      throw new NotFoundException(`Category with ID "${id}" not found`);
    }
  }

  /**
   * Supprime une catégorie par son ID.
   * La contrainte `onDelete: SetNull` dans schema.prisma
   * mettra automatiquement à jour le `parentId` des enfants à `null`.
   */
  async remove(id: string): Promise<Category> {
    try {
      return await this.prisma.category.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Category with ID "${id}" not found`);
    }
  }
}