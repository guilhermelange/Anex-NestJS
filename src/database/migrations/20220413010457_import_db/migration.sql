-- CreateTable
CREATE TABLE "anime" (
    "id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "description" VARCHAR NOT NULL,
    "cover_file" VARCHAR NOT NULL,
    "parental_rating" INTEGER NOT NULL,
    "start_date" TIMESTAMPTZ(6) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "image_file" VARCHAR NOT NULL,
    "playlist_link" VARCHAR DEFAULT E'',

    CONSTRAINT "anime_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anime_author" (
    "animeId" UUID NOT NULL,
    "authorId" UUID NOT NULL,

    CONSTRAINT "anime_author_pkey" PRIMARY KEY ("animeId","authorId")
);

-- CreateTable
CREATE TABLE "anime_genre" (
    "animeId" UUID NOT NULL,
    "genreId" UUID NOT NULL,

    CONSTRAINT "anime_genre_pkey" PRIMARY KEY ("animeId","genreId")
);

-- CreateTable
CREATE TABLE "anime_user_evaluation" (
    "evaluation" BOOLEAN NOT NULL,
    "userId" UUID NOT NULL,
    "animeId" UUID NOT NULL,

    CONSTRAINT "anime_user_evaluation_pkey" PRIMARY KEY ("userId","animeId")
);

-- CreateTable
CREATE TABLE "anime_user_favorites" (
    "animeId" UUID NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "anime_user_favorites_pkey" PRIMARY KEY ("animeId","userId")
);

-- CreateTable
CREATE TABLE "author" (
    "id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "author_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "episode" (
    "number" VARCHAR NOT NULL,
    "name" VARCHAR NOT NULL,
    "description" VARCHAR NOT NULL,
    "duration" INTEGER NOT NULL,
    "link" VARCHAR NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "seasonAnimeId" UUID NOT NULL,
    "seasonNumber" INTEGER NOT NULL,

    CONSTRAINT "episode_pkey" PRIMARY KEY ("number","seasonAnimeId","seasonNumber")
);

-- CreateTable
CREATE TABLE "genre" (
    "id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "genre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "season" (
    "name" VARCHAR NOT NULL,
    "description" VARCHAR NOT NULL,
    "animeId" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "number" INTEGER NOT NULL,

    CONSTRAINT "season_pkey" PRIMARY KEY ("animeId","number")
);

-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "email" VARCHAR NOT NULL,
    "password" VARCHAR NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "avatar" VARCHAR,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "anime_author" ADD CONSTRAINT "anime_author_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "anime"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anime_author" ADD CONSTRAINT "anime_author_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "author"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "anime_genre" ADD CONSTRAINT "anime_genre_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "anime"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anime_genre" ADD CONSTRAINT "anime_genre_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "genre"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "anime_user_evaluation" ADD CONSTRAINT "anime_user_evaluation_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "anime"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "anime_user_evaluation" ADD CONSTRAINT "anime_user_evaluation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "anime_user_favorites" ADD CONSTRAINT "anime_user_favorites_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "anime"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "anime_user_favorites" ADD CONSTRAINT "anime_user_favorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "episode" ADD CONSTRAINT "episode_seasonNumber_seasonAnimeId_fkey" FOREIGN KEY ("seasonNumber", "seasonAnimeId") REFERENCES "season"("number", "animeId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "season" ADD CONSTRAINT "season_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "anime"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
