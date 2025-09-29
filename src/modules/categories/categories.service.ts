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
   * Retourne toutes les catégories avec le nombre d'articles.
   */
  async findAll(): Promise<any[]> {
    const categories = await this.prisma.category.findMany({
      include: {
        children: {
          include: {
            _count: {
              select: {
                items: true
              }
            }
          }
        },
        parent: true,
        _count: {
          select: {
            items: true
          }
        }
      },
      orderBy: {
        displayOrder: 'asc',
      },
    });

    // Calculate total item count for parent categories (direct items + subcategory items)
    return categories.map(category => {
      let totalItemCount = category._count.items; // Direct items

      // If this is a parent category, add items from all subcategories
      if (category.children && category.children.length > 0) {
        const subcategoryItemCount = category.children.reduce((sum, child) => {
          return sum + (child._count?.items || 0);
        }, 0);
        totalItemCount += subcategoryItemCount;
      }

      return {
        ...category,
        _count: {
          ...category._count,
          items: totalItemCount
        }
      };
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
   * mettra automatiquement à jour le `categoryId` des items à `null`
   * et le `parentId` des enfants à `null`.
   */
  async remove(id: string): Promise<Category> {
    try {
      // Vérifier d'abord si la catégorie existe et récupérer le nombre d'items
      const category = await this.prisma.category.findUnique({
        where: { id },
        include: {
          _count: {
            select: {
              items: true
            }
          }
        }
      });

      if (!category) {
        throw new NotFoundException(`Category with ID "${id}" not found`);
      }

      // Supprimer la catégorie (les items auront leur categoryId mis à null automatiquement)
      return await this.prisma.category.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException(`Category with ID "${id}" not found`);
    }
  }
}