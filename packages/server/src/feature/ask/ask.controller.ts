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
    console.log('getAskAll');
    const res = await this.askService.getAskAll();
    console.log('getAskAll res', res);
    return res;
  }

  @Get('latest')
  async getAskLatest(): Promise<IAsk[]> {
    console.log('getAskLatest');
    const res = await this.askService.getAskLatest();
    console.log('getAskLatest res', res);
    return res;
  }

  @Get(':id')
  async getAskWithID(@Param('id') id: string): Promise<IAskResponse> {
    console.log('getAskWithID', id);
    const res = await this.askService.getAskWithID(parseInt(id));
    console.log('getAskWithID res', res);
    return res;
  }

  @Post('')
  async postAsk(@Body() content: IAskCreate): Promise<boolean> {
    console.log('postAsk', content);
    const res = await this.askService.postAsk(content);
    console.log('postAsk res', res);
    return res;
  }

  @Put(commentUrl) // TODO: Patch 요청으로 변경
  async putAskComment(@Body() content: IAskCommentCreate): Promise<boolean> {
    console.log('putAskComment', content);
    const res = await this.askService.putAskComment(content);
    console.log('putAskComment res', res);
    return res;
  }
}
