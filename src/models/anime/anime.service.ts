import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma';
import { UpdateAnimeDto } from './dto/update-anime.dto';

@Injectable()
export class AnimeService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string) {
    const animes = await this.prisma.anime.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        cover_file: true,
        parental_rating: true,
        start_date: true,
        image_file: true,
        playlist_link: true,
        anime_user_evaluation: true,
        anime_user_favorites: true,
        season: true,
      },
    });

    if (animes?.length <= 0) {
      throw new NotFoundException('Animes not found');
    }

    const response = [];
    for (const anime of animes) {
      response.push(this.loadAnimeResponse(userId, anime));
    }

    return response;
  }

  async findOne(userId: string, id: string) {
    const anime = await this.prisma.anime.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        description: true,
        cover_file: true,
        start_date: true,
        image_file: true,
        playlist_link: true,
        anime_user_evaluation: true,
        anime_user_favorites: true,
        season: {
          select: {
            name: true,
            number: true,
            episode: {
              select: {
                name: true,
                description: true,
                link: true,
                duration: true,
                number: true,
              },
              orderBy: {
                number: 'asc',
              },
            },
          },
          orderBy: {
            number: 'asc',
          },
        },
      },
    });

    if (!anime) {
      throw new NotFoundException('Anime not found');
    }

    const response = this.loadAnimeResponse(userId, anime);

    return response;
  }

  async findOneSeasons(id: string) {
    const seasons = await this.prisma.season.findMany({
      where: {
        animeId: id,
      },
      select: {
        animeId: true,
        description: true,
        name: true,
        number: true,
        episode: {
          select: {
            description: true,
            duration: true,
            link: true,
            name: true,
            number: true,
            seasonNumber: true,
            seasonAnimeId: true,
          },
        },
      },
    });

    return seasons;
  }

  async updateOne(userId: string, animeUpdate: UpdateAnimeDto, id: string) {
    const anime = await this.prisma.anime.findUnique({
      where: {
        id,
      },
      select: {
        anime_user_favorites: true,
        anime_user_evaluation: true,
        id: true,
      },
    });

    if (!anime) throw new NotFoundException('Anime not found');

    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    if (animeUpdate?.favorite !== undefined) {
      if (animeUpdate.favorite) {
        await this.prisma.animeUserFavorites.upsert({
          create: {
            animeId: id,
            userId,
          },
          where: {
            animeId_userId: {
              animeId: id,
              userId,
            },
          },
          update: {},
        });
      } else {
        await this.prisma.animeUserFavorites.delete({
          where: {
            animeId_userId: {
              animeId: id,
              userId,
            },
          },
        });
      }
    }

    if (animeUpdate?.evaluation !== undefined) {
      await this.prisma.animeUserEvaluation.upsert({
        create: {
          animeId: id,
          userId,
          evaluation: animeUpdate.evaluation,
        },
        update: {
          evaluation: animeUpdate.evaluation,
        },
        where: {
          userId_animeId: {
            animeId: id,
            userId,
          },
        },
      });
    }

    return '';
  }

  // Helper
  loadAnimeResponse(userId: string, anime: any) {
    let evaluation: boolean = null;
    let total = 0;
    let like = 0;
    for (const item of anime?.anime_user_evaluation) {
      if (item.userId == userId) evaluation = item.evaluation;
      if (item.evaluation) like++;
      total++;
    }

    like = like === 0 ? 1 : like;
    total = total === 0 ? 1 : total;

    const evaluation_media = +((like / total) * 100).toFixed(0);

    const favorite = anime.anime_user_favorites.some(
      (item) => item.userId == userId,
    );

    const season_count = anime?.season?.length;

    anime.anime_user_evaluation = undefined;
    anime.anime_user_favorites = undefined;
    anime.start_year = anime.start_date.getUTCFullYear();
    anime.start_date = undefined;

    const response = {
      ...anime,
      evaluation,
      favorite,
      evaluation_media,
      season_count,
    };

    return response;
  }
}
