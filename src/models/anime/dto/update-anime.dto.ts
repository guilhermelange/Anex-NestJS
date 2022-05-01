import { PartialType } from '@nestjs/mapped-types';
import { CreateAnimeDto } from './create-anime.dto';

export class UpdateAnimeDto extends PartialType(CreateAnimeDto) {
  favorite?: boolean;
  evaluation?: boolean;
}
