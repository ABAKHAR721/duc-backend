import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { Role } from '../auth/constants/roles.enum';

@Injectable()
export class SeederService implements OnModuleInit {
  // Logger pour des messages clairs dans la console
  private readonly logger = new Logger(SeederService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Cette méthode est appelée automatiquement par NestJS au démarrage.
   */
  async onModuleInit() {
    this.logger.log('Starting database seeding process...');
    await this.seedUsers();
    this.logger.log('Seeding process finished.');
  }

  /**
   * Crée les utilisateurs SuperAdmin et Admin s'ils n'existent pas.
   */
  private async seedUsers() {
    // --- Seed SuperAdmin ---
    
    const superAdminEmail = this.configService.get<string>('DEFAULT_SUPER_ADMIN_EMAIL') || 'superadmin@duc-project.com';
    const existingSuperAdmin = await this.usersService.findOneByEmail(superAdminEmail);

    if (!existingSuperAdmin) {
      await this.usersService.create({
        name: this.configService.get<string>('DEFAULT_SUPER_ADMIN_NAME') || 'SuperAdmin',
        email: this.configService.get<string>('DEFAULT_SUPER_ADMIN_EMAIL') || 'superadmin@duc-project.com',
        phone: this.configService.get<string>('DEFAULT_SUPER_ADMIN_PHONE') || '+212609645722',
        password: this.configService.get<string>('DEFAULT_SUPER_ADMIN_PASSWORD') || 'SuperAdminPassword123',
        role: this.configService.get<string>('DEFAULT_SUPER_ADMIN_ROLE') || Role.SuperAdmin,
      });
      this.logger.log('SuperAdmin user created.');
    } else {
      this.logger.log('SuperAdmin user already exists. Skipping.');
    }

    // --- Seed Admin ---
    const adminEmail = this.configService.get<string>('DEFAULT_ADMIN_EMAIL') || '';
    const existingAdmin = await this.usersService.findOneByEmail(adminEmail);

    if (!existingAdmin) {
      await this.usersService.create({
        name: this.configService.get<string>('DEFAULT_ADMIN_NAME') || 'Admin',
        email: this.configService.get<string>('DEFAULT_ADMIN_EMAIL') || 'admin@duc-project.com',
        phone: this.configService.get<string>('DEFAULT_ADMIN_PHONE') || '+212609645722',
        password: this.configService.get<string>('DEFAULT_ADMIN_PASSWORD') ||'AdminPassword123',
        role: this.configService.get<string>('DEFAULT_ADMIN_ROLE') || Role.Admin,
      });
      this.logger.log('Admin user created.');
    } else {
      this.logger.log('Admin user already exists. Skipping.');
    }
  }
}