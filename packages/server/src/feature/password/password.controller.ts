import { Controller, Get, Query } from '@nestjs/common';
import { PasswordService } from './password.service';
import { IPassword, IPasswordValidation } from '@scspace-depot/types/password';

@Controller('password')
export class PasswordController {
  constructor(private readonly passwordService: PasswordService) {}

  @Get('validAll')
  async validAll(): Promise<IPassword[]> {
    console.log('validAll');
    const res = await this.passwordService.validAll();
    console.log('validAll res', res);
    return res;
  }

  @Get('validSpaces')
  async validSpaces(
    @Query('userId') userId: string,
  ): Promise<IPasswordValidation[]> {
    console.log('validSpaces', userId);
    const res = await this.passwordService.validSpaces(parseInt(userId));
    console.log('validSpaces res', res);
    return res;
  }
}
