import { Module } from '@nestjs/common';
import { PrismaModule } from './database/prisma';
import { UserModule } from './models/user/user.module';
import { AuthModule } from './authentication/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './authentication/jwt-auth.guard';
import { AnimeModule } from './models/anime/anime.module';
import { CollectionModule } from './models/collection/collection.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    AuthModule,
    AnimeModule,
    CollectionModule,
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 60,
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
