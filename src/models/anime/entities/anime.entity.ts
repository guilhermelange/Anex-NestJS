import {
  Anime,
  AnimeAuthor,
  AnimeGenre,
  AnimeUserEvaluation,
  AnimeUserFavorites,
  Season,
} from '@prisma/client';

export class AnimePrisma implements Anime {
  id: string;
  name: string;
  description: string;
  cover_file: string;
  parental_rating: number;
  start_date: Date;
  created_at: Date;
  updated_at: Date;
  image_file: string;
  playlist_link: string;
  anime_author?: AnimeAuthor[];
  anime_genre?: AnimeGenre[];
  anime_user_evaluation?: AnimeUserEvaluation[];
  anime_user_favorites: AnimeUserFavorites[];
  season?: Season[];
}

export class AnimeDAO {
  constructor(anime: AnimePrisma) {
    this.anime = anime;
  }

  anime: AnimePrisma;

  // isFavorite?(userId: string) {
  //   return (
  //     !!this.anime?.anime_user_evaluation?.find(
  //       (item) => item.userId === userId,
  //     ) || null
  //   );
  // }
}
