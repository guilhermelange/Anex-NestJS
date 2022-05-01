import {
  Controller,
  Get,
  Body,
  Param,
  Req,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common';
import { Request } from 'express';
import { AnimeService } from './anime.service';
import { UpdateAnimeDto } from './dto/update-anime.dto';
@Controller('animes')
export class AnimeController {
  constructor(private readonly animeService: AnimeService) {}
  @Get()
  findAll(@Req() request: Request) {
    const { id: userId } = request.user;
    return this.animeService.findAll(userId);
  }

  @Get(':id')
  findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() request: Request,
  ) {
    const { id: userId } = request.user;
    return this.animeService.findOne(userId, id);
  }

  @Get(':id/seasons')
  findOneSeasons(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.animeService.findOneSeasons(id);
  }

  @Put(':id')
  updateAnime(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() request: Request,
    @Body() animeUpdate: UpdateAnimeDto,
  ) {
    const { id: userId } = request.user;
    return this.animeService.updateOne(userId, animeUpdate, id);
  }
}
