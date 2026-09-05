-- CreateEnum
CREATE TYPE "Governorate" AS ENUM ('tunis', 'ariana', 'ben_arous', 'manouba', 'nabeul', 'zaghouan', 'bizerte', 'beja', 'jendouba', 'kef', 'siliana', 'kairouan', 'kasserine', 'sidi_bouzid', 'sousse', 'monastir', 'mahdia', 'sfax', 'gafsa', 'tozeur', 'kebili', 'gabes', 'medenine', 'tataouine');

-- CreateTable
CREATE TABLE "delivery_zones" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "governorate" "Governorate" NOT NULL,
    "price" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "delivery_zones_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "delivery_zones_organizationId_governorate_key" ON "delivery_zones"("organizationId", "governorate");

-- AddForeignKey
ALTER TABLE "delivery_zones" ADD CONSTRAINT "delivery_zones_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
