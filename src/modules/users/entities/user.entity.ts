import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 255, select: false }) // select: false empêche le mot de passe d'être retourné par défaut dans les requêtes
  password: string;

  @Column({ type: 'varchar', length: 50 })
  role: string; // Ex: 'Admin', 'Editor'

  @Column({ type: 'varchar', length: 50, default: 'Active' })
  status: string; // Ex: 'Active', 'Inactive'

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}