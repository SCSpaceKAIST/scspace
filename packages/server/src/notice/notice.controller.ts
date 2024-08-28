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

import { NoticeService } from './notice.service';

@Controller('notice')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  @Get('all')
  findNoticeAll() {
    return this.noticeService.getNoticeAll();
  }
  @Get(':id')
  findNoticeWithID(@Param('id') id: number) {
    return this.noticeService.getNotice(id);
  }
}
