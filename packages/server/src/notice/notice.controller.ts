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
import { NoticeInputType } from '@depot/types/notice';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-guard';
import { noticeUrl } from '@depot/urls/notice';

@Controller(noticeUrl)
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

  @Post('')
  insertNotice(@Body() noticeContent: NoticeInputType) {
    return this.noticeService.addNotice(noticeContent);
  }
}
