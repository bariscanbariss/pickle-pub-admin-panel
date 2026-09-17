-- AlterTable
ALTER TABLE "products" ADD COLUMN "has_double" BOOLEAN DEFAULT false;
ALTER TABLE "products" ADD COLUMN "double_price" DECIMAL(10,2);
