import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Redirect,
  Res,
  UseGuards,
  Req,
  Logger,
} from '@nestjs/common';
import { AskService } from './ask.service';
import { AskInputType, AskType } from '@depot/types/ask';
import { commentUrl } from '@depot/urls/ask';

@Controller('ask')
export class AskController {
  constructor(private readonly askService: AskService) {}

  @Get('all')
  async findAskAll() {
    return await this.askService.getAll();
  }
  @Get('latest')
  async findAskLatest() {
    return await this.askService.getLatest();
  }

  @Get(':id')
  async findAskWithID(@Param('id') id: number) {
    return await this.askService.get(id);
  }
  @Post('')
  async insertAsk(@Body() content: AskInputType) {
    return await this.askService.add(content);
  }

  @Put(commentUrl)
  async changeComment(@Body() content: AskType) {
    return await this.askService.addComment(content);
  }
}
