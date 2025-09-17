import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Item } from './item.entity';

@Entity('item_variants')
export class ItemVariant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'variant_name' })
  variantName: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;
  
  @Column({ type: 'varchar', length: 100, nullable: true })
  sku: string;

  @ManyToOne(() => Item, (item) => item.variants, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'item_id' })
  item: Item;
}