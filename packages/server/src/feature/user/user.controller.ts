import { Controller, Get, Param, ParseIntPipe, Post, Body, Delete, Put, UseGuards, NotFoundException, Patch, Query, Logger } from '@nestjs/common';
import { UserService } from './user.service';
import { IUser, IUserCreate, IUserUpdate } from '@scspace-depot/types/user';
import { ISuccessResponse } from '@scspace-depot/types/common';
import { UserPublicService } from './user.public.service';
import { AdminGuard, ManagerGuard } from '../auth/jwt/jwt.guard';
import { AuthGuard } from '@nestjs/passport';
import { UserRepository } from './user.repository';
// import { UserAuthBinaryEnum, UserTypeEnum } from '@scspace-depot/enums/user.enum';
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userPublicService: UserPublicService,
    private readonly userRepository: UserRepository,
  ) { }

  // @Get("migrate-type")
  // async migrateType(): Promise<void> {
  //   const allusers = await this.userRepository.fetchAll(0);
  //   for (const user of allusers) {
  // let t = UserAuthBinaryEnum.USER;
  // if (user.type === UserTypeEnum.MANAGER) t += UserAuthBinaryEnum.MANAGER;
  // if (user.type === UserTypeEnum.ADMIN) t += UserAuthBinaryEnum.ADMIN;
  // if (user.type === UserTypeEnum.WORKER) t += UserAuthBinaryEnum.WORKER;
  // await this.userRepository.updateType(user.id, { type: t });
  // Logger.log(`User ID ${user.id}: ${user.nameKr} type migrated to ${t}`);
  // if (user.nameKr === "공간위") {
  //   await this.userRepository.updateType(user.id, { type: 7 });
  //   Logger.log(`User ID ${user.id}: ${user.nameKr} type migrated to ADMIN`);
  // }
  //   }
  // }

  @UseGuards(AdminGuard)
  @Get('all')
  async getUsers(
    @Query('studentNumberPrefix', ParseIntPipe) studentNumberPrefix?: number,
  ): Promise<IUser[]> {
    return await this.userPublicService.fetchAll(studentNumberPrefix ?? 0);
  }

  //HOOK: useUserInfo
  @UseGuards(AuthGuard('jwt'))
  @Get('studentNumber/:studentNumber')
  async getUserByStudentNumber(
    @Param('studentNumber') studentNumber: number
  ): Promise<IUser> {

    const user = await this.userPublicService.fetchByStudentNumber(studentNumber);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  //HOOK: useUserInfo
  @UseGuards(ManagerGuard)
  @Get(':id')
  async getUserById(
    @Param('id', ParseIntPipe) id: number
  ): Promise<IUser> {
    const user = await this.userPublicService.fetchById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @UseGuards(ManagerGuard)
  @Post()
  async postUser(
    @Body() body: IUserCreate
  ): Promise<IUser> {
    return await this.userService.insert(body);
  }

  @UseGuards(AdminGuard)
  @Patch(':id')
  async patchUserType(
    @Param('id', ParseIntPipe) uid: number,
    @Body() body: IUserUpdate
  ): Promise<IUser> {
    return await this.userService.update(uid, body);
  }

  //HOOK: useUserInfo
  @UseGuards(ManagerGuard)
  @Delete(':id')
  async deleteUser(
    @Param('id', ParseIntPipe) id: number
  ): Promise<ISuccessResponse> {
    return await this.userService.delete(id);
  }


}