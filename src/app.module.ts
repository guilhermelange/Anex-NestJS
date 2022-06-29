import { Module } from '@nestjs/common';
import { PrismaModule } from './database/prisma';
import { UserModule } from './models/user/user.module';
import { AuthModule } from './authentication/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './authentication/jwt-auth.guard';
import { AnimeModule } from './models/anime/anime.module';
import { CollectionModule } from './models/collection/collection.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    AuthModule,
    AnimeModule,
    CollectionModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
