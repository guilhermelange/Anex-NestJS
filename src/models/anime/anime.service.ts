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
        parental_rating: true,
        start_date: true,
        image_file: true,
        playlist_link: true,
        anime_user_evaluation: true,
        anime_user_favorites: true,
        season: true,
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

    if (seasons?.length <= 0)
      throw new NotFoundException('Anime/Season not found');

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
    let evaluation = false;
    let total = 0;
    let like = 0;
    for (const item of anime?.anime_user_evaluation) {
      if (item.userId == userId) evaluation = item.evaluation;
      if (item.evaluation) like++;
      total++;
    }

    like = like === 0 ? 1 : like;
    total = total === 0 ? 1 : total;

    const evaluationMedia = +((like / total) * 100).toFixed(2);

    const favorite = anime.anime_user_favorites.some(
      (item) => item.userId == userId,
    );

    const seasonsCount = anime?.season?.length;

    anime.anime_user_evaluation = undefined;
    anime.anime_user_favorites = undefined;
    anime.season = undefined;

    const response = {
      ...anime,
      evaluation,
      favorite,
      evaluationMedia,
      seasonsCount,
    };

    return response;
  }
}
