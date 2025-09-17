import { MigrationInterface, QueryRunner } from "typeorm";

export class ConvertIdsToUuid1700000000000 implements MigrationInterface {
    name = 'ConvertIdsToUuid1700000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Enable UUID extension
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

        // Create temporary UUID columns
        await queryRunner.query(`ALTER TABLE "users" ADD "temp_id" uuid DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "business" ADD "temp_id" uuid DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "temp_id" uuid DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "temp_parent_id" uuid`);
        await queryRunner.query(`ALTER TABLE "events" ADD "temp_id" uuid DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "items" ADD "temp_id" uuid DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "items" ADD "temp_category_id" uuid`);
        await queryRunner.query(`ALTER TABLE "item_variants" ADD "temp_id" uuid DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "item_images" ADD "temp_id" uuid DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "item_options" ADD "temp_id" uuid DEFAULT uuid_generate_v4()`);

        // Update foreign key references
        await queryRunner.query(`
            UPDATE "categories" c1 
            SET "temp_parent_id" = c2."temp_id" 
            FROM "categories" c2 
            WHERE c1."parent_id" = c2."id"
        `);

        await queryRunner.query(`
            UPDATE "items" i 
            SET "temp_category_id" = c."temp_id" 
            FROM "categories" c 
            WHERE i."category_id" = c."id"
        `);

        // Drop foreign key constraints
        await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT IF EXISTS "FK_9a6f051e66982b5f0318981bcaa"`);
        await queryRunner.query(`ALTER TABLE "items" DROP CONSTRAINT IF EXISTS "FK_9b7c8c8c7c8c8c8c8c8c8c8c8c8c"`);
        await queryRunner.query(`ALTER TABLE "item_variants" DROP CONSTRAINT IF EXISTS "FK_item_variants_item_id"`);
        await queryRunner.query(`ALTER TABLE "item_images" DROP CONSTRAINT IF EXISTS "FK_item_images_item_id"`);
        await queryRunner.query(`ALTER TABLE "item_options" DROP CONSTRAINT IF EXISTS "FK_item_options_item_id"`);

        // Drop old ID columns and rename temp columns
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "temp_id" TO "id"`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "PK_users_id" PRIMARY KEY ("id")`);

        await queryRunner.query(`ALTER TABLE "business" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "business" RENAME COLUMN "temp_id" TO "id"`);
        await queryRunner.query(`ALTER TABLE "business" ADD CONSTRAINT "PK_business_id" PRIMARY KEY ("id")`);

        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "events" RENAME COLUMN "temp_id" TO "id"`);
        await queryRunner.query(`ALTER TABLE "events" ADD CONSTRAINT "PK_events_id" PRIMARY KEY ("id")`);

        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "parent_id"`);
        await queryRunner.query(`ALTER TABLE "categories" RENAME COLUMN "temp_id" TO "id"`);
        await queryRunner.query(`ALTER TABLE "categories" RENAME COLUMN "temp_parent_id" TO "parent_id"`);
        await queryRunner.query(`ALTER TABLE "categories" ADD CONSTRAINT "PK_categories_id" PRIMARY KEY ("id")`);

        await queryRunner.query(`ALTER TABLE "items" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "items" DROP COLUMN "category_id"`);
        await queryRunner.query(`ALTER TABLE "items" RENAME COLUMN "temp_id" TO "id"`);
        await queryRunner.query(`ALTER TABLE "items" RENAME COLUMN "temp_category_id" TO "category_id"`);
        await queryRunner.query(`ALTER TABLE "items" ADD CONSTRAINT "PK_items_id" PRIMARY KEY ("id")`);

        await queryRunner.query(`ALTER TABLE "item_variants" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "item_variants" RENAME COLUMN "temp_id" TO "id"`);
        await queryRunner.query(`ALTER TABLE "item_variants" ADD CONSTRAINT "PK_item_variants_id" PRIMARY KEY ("id")`);

        await queryRunner.query(`ALTER TABLE "item_images" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "item_images" RENAME COLUMN "temp_id" TO "id"`);
        await queryRunner.query(`ALTER TABLE "item_images" ADD CONSTRAINT "PK_item_images_id" PRIMARY KEY ("id")`);

        await queryRunner.query(`ALTER TABLE "item_options" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "item_options" RENAME COLUMN "temp_id" TO "id"`);
        await queryRunner.query(`ALTER TABLE "item_options" ADD CONSTRAINT "PK_item_options_id" PRIMARY KEY ("id")`);

        // Recreate foreign key constraints
        await queryRunner.query(`ALTER TABLE "categories" ADD CONSTRAINT "FK_categories_parent_id" FOREIGN KEY ("parent_id") REFERENCES "categories"("id") ON DELETE SET NULL`);
        await queryRunner.query(`ALTER TABLE "items" ADD CONSTRAINT "FK_items_category_id" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        throw new Error("Cannot revert UUID migration - this would cause data loss");
    }
}