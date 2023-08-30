-- CreateEnum
CREATE TYPE "Size" AS ENUM ('SMALL', 'MEDIUM', 'BIG');

-- CreateEnum
CREATE TYPE "Locale" AS ENUM ('SP', 'RJ', 'MG');

-- CreateTable
CREATE TABLE "pets" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "race" TEXT NOT NULL,
    "size" "Size" NOT NULL,
    "age" INTEGER NOT NULL,
    "locale" "Locale" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pets_pkey" PRIMARY KEY ("id")
);
