import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('business')
export class Business {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'logo_url', type: 'varchar', nullable: true })
  logoUrl: string;

  @Column({ name: 'favicon_url', type: 'varchar', nullable: true })
  faviconUrl: string;

  @Column({ type: 'varchar', nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  phone: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 10, default: 'EUR' })
  currency: string;

  @Column({ type: 'varchar', nullable: true })
  slogan: string;

  @Column({ type: 'text', nullable: true })
  hours: string;

  @Column({ name: 'url_facebook', type: 'varchar', nullable: true })
  urlFacebook: string;

  @Column({ name: 'url_instagram', type: 'varchar', nullable: true })
  urlInstagram: string;
  
  @Column({ name: 'url_linkedin', type: 'varchar', nullable: true })
  urlLinkedin: string;

  @Column({ name: 'uber_eats_url', type: 'varchar', nullable: true })
  uberEatsUrl: string;

  @Column({ name: 'google_maps_url', type: 'varchar', nullable: true })
  googleMapsUrl: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}