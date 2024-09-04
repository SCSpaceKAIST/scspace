import { Injectable } from '@nestjs/common';
import { NoticeRepository } from './notice.repository';
import { NoticeInputType, NoticeType } from '@depot/types/notice';

@Injectable()
export class NoticeService {
  constructor(private readonly noticeRepository: NoticeRepository) {}

  async getNotice(notice_id: number): Promise<NoticeType | false> {
    await this.noticeRepository.incrementViewsById(notice_id);
    return await this.noticeRepository.getNoticeById(notice_id);
  }

  async getNoticeAll(): Promise<NoticeType[] | false> {
    return await this.noticeRepository.getNoticeAll();
  }
  async addNotice(newNotice: NoticeInputType): Promise<Boolean> {
    return await this.noticeRepository.addNotice(newNotice);
  }
}
