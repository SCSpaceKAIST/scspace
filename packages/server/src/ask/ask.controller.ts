import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Redirect,
  Res,
  UseGuards,
  Req,
  Logger,
} from '@nestjs/common';
import { AskService } from './ask.service';
@Controller('ask')
export class AskController {
  constructor(private readonly askService: AskService) {}

  @Get('all')
  findUserWithID(@Param('id') id: string) {
    return this.askService.getAskAll();
  }
  @Get(':id')
  findFaqWithID(@Param('id') id: number) {
    return this.askService.getAsk(id);
  }
}
