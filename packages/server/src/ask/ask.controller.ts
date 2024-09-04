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
  findUAskWithID(@Param('id') id: string) {
    return this.askService.getAll();
  }
  @Get(':id')
  findAskWithID(@Param('id') id: number) {
    return this.askService.get(id);
  }
  @Post('')
  insertAsk(@Body() content: AskInputType) {
    return this.askService.add(content);
  }

  @Put(commentUrl)
  changeComment(@Body() content: AskType) {
    this.askService.addComment(content);
  }
}
