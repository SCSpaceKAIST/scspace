import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Redirect,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthService } from 'src/auth/auth.service';
import { LoginRequestDto } from 'src/auth/dto/login.request.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Get(':id')
  findUserWithID(@Param('id') id: string) {
    return this.userService.getUser(id);
  }
}
