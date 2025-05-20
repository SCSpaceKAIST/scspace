import { Controller, Get, Param, ParseIntPipe, Post, Body, Delete, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { IUser, IUserCreate } from '@scspace-depot/types/user';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getUserProfile(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.fetchUser(id);
  }

  @Post()
  async postUser(
    @Body() body: IUserCreate
  ): Promise<IUser> {
    return await this.userService.insertUser(body);
  }

  @Get()
  async getUsers(): Promise<IUser[]> {
    return await this.userService.fetchAll();
  }

  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return await this.userService.deleteUser(id);
  }
}