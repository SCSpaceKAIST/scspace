import { Controller, Get, Query } from '@nestjs/common';
import { PasswordService } from './password.service';
import { IPassword, IPasswordValidation } from '@depot/types/password';

@Controller('password')
export class PasswordController {
  constructor(private readonly passwordService: PasswordService) {}

  @Get('validAll')
  async validAll(): Promise<IPassword[]> {
    return this.passwordService.validAll();
  }

  @Get('validSpaces')
  async validSpaces(
    @Query('userId') userId: string,
  ): Promise<IPasswordValidation[]> {
    return this.passwordService.validSpaces(parseInt(userId));
  }
}
