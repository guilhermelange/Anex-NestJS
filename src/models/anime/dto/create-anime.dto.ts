import { Anime } from '@prisma/client';

export class CreateAnimeDto implements Anime {
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
  favorite?: boolean;
  evaluation?: boolean;
}
