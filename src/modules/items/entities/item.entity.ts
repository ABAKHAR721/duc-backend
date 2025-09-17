import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { ItemVariant } from './item-variant.entity';
import { ItemImage } from './item-image.entity';
import { ItemOption } from './item-option.entity';

@Entity('items')
export class Item {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 50, default: 'Active' })
  status: string;

  // --- Relations ---

  @Column({ name: 'category_id', type: 'uuid', nullable: true })
  categoryId: string;

  @ManyToOne(() => Category, (category) => category.items, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @OneToMany(() => ItemVariant, (variant) => variant.item, { cascade: true })
  variants: ItemVariant[];

  @OneToMany(() => ItemImage, (image) => image.item, { cascade: true })
  images: ItemImage[];

  @OneToMany(() => ItemOption, (option) => option.item, { cascade: true })
  options: ItemOption[];

  // --- Timestamps ---

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}