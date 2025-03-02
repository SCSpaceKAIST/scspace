import { Controller, Get, Param, Post, Body } from '@nestjs/common';

import { NoticeService } from './notice.service';
import { INotice, INoticeCreate } from '@depot/types/notice';
import { noticeUrl } from '@depot/urls/notice';

@Controller(noticeUrl)
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  @Get('all')
  getNoticeAll() {
    return this.noticeService.getNoticeAll();
  }
  @Get(':id')
  getNoticeByID(@Param('id') id: string): Promise<INotice> {
    return this.noticeService.getNoticeByID(parseInt(id));
  }

  @Post('')
  postNotice(@Body() noticeContent: INoticeCreate) {
    return this.noticeService.postNotice(noticeContent);
  }
}
