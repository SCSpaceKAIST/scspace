import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile/:id')
  async getUserProfile(@Param('id', ParseIntPipe) id: number) {
    console.log(id);
    return await this.userService.fetchUser(id);
  }
}
