import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { Public } from '../common/decorators/publicDecorator';

@Controller('sessions')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @Public()
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.authenticateUser(createAuthDto);
  }
}
