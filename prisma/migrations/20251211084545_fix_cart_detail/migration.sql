/*
  Warnings:

  - You are about to alter the column `price` on the `cart_detail` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(65,30)`.

*/
-- DropForeignKey
ALTER TABLE `cart_detail` DROP FOREIGN KEY `cart_detail_cartId_fkey`;

-- DropForeignKey
ALTER TABLE `cart_detail` DROP FOREIGN KEY `cart_detail_productId_fkey`;

-- DropIndex
DROP INDEX `cart_detail_cartId_key` ON `cart_detail`;

-- DropIndex
DROP INDEX `cart_detail_productId_key` ON `cart_detail`;

-- AlterTable
ALTER TABLE `cart_detail` MODIFY `price` DECIMAL(65, 30) NOT NULL;
