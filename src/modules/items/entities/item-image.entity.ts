import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Item } from './item.entity';

@Entity('item_images')
export class ItemImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'image_url' })
  imageUrl: string;

  @Column({ name: 'is_default', default: false })
  isDefault: boolean;

  @ManyToOne(() => Item, (item) => item.images, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'item_id' })
  item: Item;
}