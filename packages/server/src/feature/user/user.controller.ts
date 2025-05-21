import { Controller, Get, Param, ParseIntPipe, Post, Body, Delete, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { IUser, IUserCreate } from '@scspace-depot/types/user';
import { ISuccessResponse } from '@scspace-depot/types/common';
import { UserPublicService } from './user.public.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userPublicService: UserPublicService,
  ) { }

  //HOOK: useUserInfo
  @Get(':id')
  async getUserById(@Param('id', ParseIntPipe) id: number): Promise<IUser> {
    return await this.userPublicService.fetchById(id);
  }

  @Get()
  async getUsers(): Promise<IUser[]> {
    return await this.userPublicService.fetchAll();
  }

  @Get('studentNumber/:studentNumber')
  async getUserByStudentNumber(@Param('studentNumber', ParseIntPipe) studentNumber: number): Promise<IUser> {
    return await this.userPublicService.fetchByStudentNumber(studentNumber);
  }

  @Post()
  async postUser(
    @Body() body: IUserCreate
  ): Promise<IUser> {
    return await this.userService.insert(body);
  }

  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<ISuccessResponse> {
    return await this.userService.delete(id);
  }
}