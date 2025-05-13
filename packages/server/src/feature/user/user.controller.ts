import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile/:id')
  async findUserWithID(@Param('id') id: string) {
    console.log('findUserWithID', id);
    const res = await this.userService.getUser(parseInt(id));
    console.log('findUserWithID res', res);
    return res;
  }
}
