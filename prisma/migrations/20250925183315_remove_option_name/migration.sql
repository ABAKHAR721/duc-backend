/*
  Warnings:

  - You are about to drop the column `option_name` on the `item_options` table. All the data in the column will be lost.
  - Made the column `option_type` on table `item_options` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."item_options" DROP COLUMN "option_name",
ALTER COLUMN "option_type" SET NOT NULL; 
