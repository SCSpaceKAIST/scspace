import { Controller, Get, Query } from '@nestjs/common';
import { PasswordService } from './password.service';
import { PasswordType, PasswordValidationType } from '@depot/types/password';

@Controller('password')
export class PasswordController {
  constructor(private readonly passwordService: PasswordService) {}

  @Get('validAll')
  async validAll(): Promise<PasswordType[] | false> {
    return this.passwordService.validAll();
  }

  @Get('validSpaces')
  async validSpaces(
    @Query('user_id') user_id: string,
  ): Promise<PasswordValidationType[] | false> {
    return this.passwordService.validSpaces(user_id);
  }
}
