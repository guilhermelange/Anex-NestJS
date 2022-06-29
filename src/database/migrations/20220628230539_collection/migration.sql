-- CreateTable
CREATE TABLE "anime_collection" (
    "animeId" UUID NOT NULL,
    "collectionId" UUID NOT NULL,

    CONSTRAINT "anime_collection_pkey" PRIMARY KEY ("animeId","collectionId")
);

-- CreateTable
CREATE TABLE "collection" (
    "id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,

    CONSTRAINT "collection_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "anime_collection" ADD CONSTRAINT "anime_collection_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "anime"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anime_collection" ADD CONSTRAINT "anime_collection_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "collection"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
