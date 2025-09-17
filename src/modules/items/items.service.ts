import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from './entities/item.entity';
import { ItemVariant } from './entities/item-variant.entity';
import { ItemImage } from './entities/item-image.entity';
import { ItemOption } from './entities/item-option.entity';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,
    private readonly dataSource: DataSource, // Injecter DataSource pour les transactions
  ) {}

  async create(createItemDto: CreateItemDto): Promise<Item> {
    const { variants = [], images = [], options = [], ...itemData } = createItemDto;

    // Utilisation d'une transaction pour s'assurer que tout est créé ou rien n'est créé
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Créer l'item principal
      const item = queryRunner.manager.create(Item, itemData);
      const savedItem = await queryRunner.manager.save(item);

      // 2. Créer les entités associées
      if (variants.length > 0) {
        const itemVariants = variants.map(v => queryRunner.manager.create(ItemVariant, { ...v, item: savedItem }));
        await queryRunner.manager.save(itemVariants);
      }
      if (images.length > 0) {
        const itemImages = images.map(i => queryRunner.manager.create(ItemImage, { ...i, item: savedItem }));
        await queryRunner.manager.save(itemImages);
      }
      if (options.length > 0) {
        const itemOptions = options.map(o => queryRunner.manager.create(ItemOption, { ...o, item: savedItem }));
        await queryRunner.manager.save(itemOptions);
      }

      await queryRunner.commitTransaction();
      return this.findOne(savedItem.id); // On recharge l'item avec toutes ses relations

    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err; // Propage l'erreur
    } finally {
      await queryRunner.release();
    }
  }

  findAll(): Promise<Item[]> {
    return this.itemsRepository.find({
      relations: ['category', 'variants', 'images', 'options'],
    });
  }

  async findOne(id: string): Promise<Item> {
    const item = await this.itemsRepository.findOne({
      where: { id },
      relations: ['category', 'variants', 'images', 'options'],
    });
    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    return item;
  }

  // L'update est aussi une opération complexe qui devrait utiliser une transaction
  // Pour la simplicité, cette version met à jour l'item principal seulement.
  // Une version complète supprimerait les anciennes relations et créerait les nouvelles.
  async update(id: string, updateItemDto: UpdateItemDto): Promise<Item> {
    const { variants, images, options, ...itemData } = updateItemDto;
    // On pourrait implémenter une logique de transaction similaire à 'create' ici.
    const result = await this.itemsRepository.update(id, itemData);
    if (result.affected === 0) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    // Grâce à 'onDelete: CASCADE', TypeORM supprimera automatiquement
    // les variants, images, et options associés à cet item.
    const result = await this.itemsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
  }
}