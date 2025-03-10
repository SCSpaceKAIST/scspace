import { Controller, Get, Param, Post, Body, Put } from '@nestjs/common';
import { AskService } from './ask.service';
import {
  IAsk,
  IAskCommentCreate,
  IAskCreate,
  IAskResponse,
} from '@scspace-depot/types/ask';
import { commentUrl } from '@scspace-depot/urls/ask';

@Controller('ask')
export class AskController {
  constructor(private readonly askService: AskService) {}

  @Get('all')
  async getAskAll(): Promise<IAsk[]> {
    return await this.askService.getAskAll();
  }
  @Get('latest')
  async getAskLatest(): Promise<IAsk[]> {
    return await this.askService.getAskLatest();
  }

  @Get(':id')
  async getAskWithID(@Param('id') id: string): Promise<IAskResponse> {
    return await this.askService.getAskWithID(parseInt(id));
  }
  @Post('')
  async postAsk(@Body() content: IAskCreate): Promise<boolean> {
    return await this.askService.postAsk(content);
  }

  @Put(commentUrl) // TODO: Patch 요청으로 변경
  async putAskComment(@Body() content: IAskCommentCreate): Promise<boolean> {
    return await this.askService.putAskComment(content);
  }
}
