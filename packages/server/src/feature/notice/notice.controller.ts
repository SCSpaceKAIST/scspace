import { Controller, Get, Param, Post, Body } from '@nestjs/common';

import { NoticeService } from './notice.service';
import { INotice, INoticeCreate } from '@scspace-depot/types/notice';
import { noticeUrl } from '@scspace-depot/urls/notice';

@Controller(noticeUrl)
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  @Get('all')
  async getNoticeAll() {
    console.log('getNoticeAll');
    const res = await this.noticeService.getNoticeAll();
    console.log('getNoticeAll res', res);
    return res;
  }

  @Get(':id')
  async getNoticeByID(@Param('id') id: string): Promise<INotice> {
    console.log('getNoticeByID', id);
    const res = await this.noticeService.getNoticeByID(parseInt(id));
    console.log('getNoticeByID res', res);
    return res;
  }

  @Post('')
  async postNotice(@Body() noticeContent: INoticeCreate) {
    console.log('postNotice', noticeContent);
    const res = await this.noticeService.postNotice(noticeContent);
    console.log('postNotice res', res);
    return res;
  }
}
