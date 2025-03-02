import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile/:id')
  findUserWithID(@Param('id') id: string) {
    return this.userService.getUser(parseInt(id));
  }
}
