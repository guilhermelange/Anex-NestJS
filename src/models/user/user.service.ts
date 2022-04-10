import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma';
import { CreateUserDto } from './dto/create-user.dto';
import { hash } from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;

    const checkUserExists = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (checkUserExists) {
      throw new HttpException('Email adress already used.', 400);
    }

    const hashedPassword = await hash(password, 8);
    createUserDto.password = hashedPassword;

    const createdUser = await this.prisma.user.create({
      data: createUserDto,
    });

    createdUser.password = undefined;
    return createdUser;
  }

  async patchAvatar(requestUser: any, file: Express.Multer.File) {
    const { id } = requestUser;

    const updateUser = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        avatar: file.filename,
      },
    });

    if (!updateUser) {
      throw new HttpException('Could not be patched the avatar!', 500);
    }

    return '';
  }
}
