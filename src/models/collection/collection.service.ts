import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma';

@Injectable()
export class CollectionService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string) {
    const collections = await this.prisma.collection.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        trending: 'desc',
      },
    });

    if (collections?.length <= 0) {
      throw new NotFoundException('Animes not found');
    }

    const response = [];

    for (const collection of collections) {
      const animes = await this.prisma.$queryRaw`SELECT 
                        a.id,
                        a."name",
                        a.description,
                        a.image_file,
                        a.cover_file,
                        EXTRACT(YEAR FROM a.start_date) AS start_year,
                        (SELECT count(*)
                          FROM season s
                          WHERE s."animeId" = a.id) AS season_count,
                        xs.evaluation_media,
                        xs.evaluation > 0 AS evaluation,
                        EXISTS(SELECT NULL
                                FROM anime_user_favorites auf
                                WHERE auf."animeId" = a.id
                                  AND auf."userId" = ${userId}) AS favorite
                    FROM anime a
                    JOIN LATERAL (SELECT round((COALESCE(NULLIF(count(*) FILTER(WHERE aue.evaluation),0), 1)::numeric / 
                                          COALESCE(NULLIF(count(*), 0), 1)::numeric), 2)*100 AS evaluation_media,
                                          COALESCE(count(*) FILTER(WHERE aue."userId" = ${userId}), 0) AS evaluation
                                    FROM anime_user_evaluation aue 
                                    WHERE aue."animeId" = a.id)xs ON TRUE
                    WHERE EXISTS (SELECT NULL
                                  FROM anime_collection ac
                                WHERE ac."animeId"= a.id
                                  AND ac."collectionId" = ${collection.id})`;
      const collectionResponse = { ...collection, animes };
      response.push(collectionResponse);
    }

    return response;
  }
}
