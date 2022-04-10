import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma';
import { CreateAuthDto } from './dto/create-auth.dto';
import { compare } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async authenticateUser(createSessionDto: CreateAuthDto) {
    const { email, password, google } = createSessionDto;

    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Incorrect email/password combination');
    }

    const passwordMatched = await compare(password, user.password);
    if (!passwordMatched && !google) {
      throw new UnauthorizedException('Incorrect email/password combination');
    }

    const payload = { username: user.name, sub: user.id };
    const token = this.jwtService.sign(payload);

    user.password = undefined;

    return {
      user,
      token,
    };
  }
}
