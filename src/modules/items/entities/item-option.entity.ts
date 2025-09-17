import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Item } from './item.entity';

@Entity('item_options')
export class ItemOption {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'option_name' })
  optionName: string;

  @Column({ name: 'option_type', type: 'varchar', length: 50, nullable: true })
  optionType: string; // 'allergen', 'ingredient', 'tag'

  @ManyToOne(() => Item, (item) => item.options, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'item_id' })
  item: Item;
}