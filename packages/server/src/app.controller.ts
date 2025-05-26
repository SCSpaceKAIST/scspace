import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AdminGuard } from './feature/auth/jwt/jwt.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(AdminGuard)
  @Get('fillContent')
  async fillContent(): Promise<void> {
    this.appService.fillContent();
  }
  
  @UseGuards(AdminGuard)
  @Get("save")
  async save(): Promise<string> {
    return await this.appService.save();
  }
}
