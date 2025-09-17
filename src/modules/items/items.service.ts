import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Item } from '@prisma/client';

@Injectable()
export class ItemsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Crée un nouvel item avec ses relations (variantes, images, options)
   * en une seule transaction atomique grâce aux "nested writes" de Prisma.
   */
  async create(createItemDto: CreateItemDto): Promise<Item> {
    const { categoryId, variants = [], images = [], options = [], ...itemData } = createItemDto;

    return this.prisma.item.create({
      data: {
        ...itemData,
        // Connexion à une catégorie existante via son ID
        category: {
          connect: { id: categoryId },
        },
        // Création des relations en même temps
        variants: {
          create: variants.map(variant => ({
            variantName: variant.variantName,
            price: variant.price,
            sku: variant.sku,
          })),
        },
        images: {
          create: images.map(image => ({
            imageUrl: image.imageUrl,
            isDefault: image.isDefault,
          })),
        },
        options: {
          create: options.map(option => ({
            optionName: option.optionName,
            optionType: option.optionType,
          })),
        },
      },
      // Inclure toutes les relations dans l'objet retourné
      include: {
        category: true,
        variants: true,
        images: true,
        options: true,
      },
    });
  }

  /**
   * Récupère tous les items avec leurs relations.
   */
  findAll(): Promise<Item[]> {
    return this.prisma.item.findMany({
      include: {
        category: true,
        variants: true,
        images: true,
        options: true,
      },
    });
  }

  /**
   * Récupère un item spécifique par son ID avec ses relations.
   */
  async findOne(id: string): Promise<Item> {
    const item = await this.prisma.item.findUnique({
      where: { id },
      include: {
        category: true,
        variants: true,
        images: true,
        options: true,
      },
    });

    if (!item) {
      throw new NotFoundException(`Item with ID "${id}" not found`);
    }
    return item;
  }

  /**
   * Met à jour un item et ses relations.
   * Cette approche met à jour les données de base de l'item
   * et remplace complètement ses relations (variantes, images, options).
   */
  async update(id: string, updateItemDto: UpdateItemDto): Promise<Item> {
    const { categoryId, variants, images, options, ...itemData } = updateItemDto;

    try {
      return await this.prisma.item.update({
        where: { id },
        data: {
          ...itemData,
          // Reconnecter la catégorie si elle est fournie
          ...(categoryId && { category: { connect: { id: categoryId } } }),
          // Remplacer complètement les anciennes relations par les nouvelles
          ...(variants && {
            variants: {
              deleteMany: {}, // Supprime toutes les anciennes variantes
              create: variants, // Crée les nouvelles
            },
          }),
          ...(images && {
            images: {
              deleteMany: {},
              create: images,
            },
          }),
          ...(options && {
            options: {
              deleteMany: {},
              create: options,
            },
          }),
        },
        include: {
          category: true,
          variants: true,
          images: true,
          options: true,
        },
      });
    } catch (error) {
      throw new NotFoundException(`Item with ID "${id}" not found or update failed`);
    }
  }

  /**
   * Supprime un item par son ID.
   * Grâce à `onDelete: Cascade` dans le schema.prisma,
   * Prisma supprimera automatiquement les variantes, images et options associées.
   */
  async remove(id: string): Promise<Item> {
    try {
      return await this.prisma.item.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Item with ID "${id}" not found`);
    }
  }
}