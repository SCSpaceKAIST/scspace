import { Injectable } from '@nestjs/common';
import { NoticeRepository } from './notice.repository';
import { NoticeInputType, NoticeType } from '@depot/types/notice';

@Injectable()
export class NoticeService {
  constructor(private readonly NoticeRepository: NoticeRepository) {}

  async getNotice(notice_id: number): Promise<NoticeType | false> {
    await this.NoticeRepository.incrementViewsById(notice_id);
    return await this.NoticeRepository.getNoticeById(notice_id);
  }

  async getNoticeAll(): Promise<NoticeType[] | false> {
    return await this.NoticeRepository.getNoticeAll();
  }
  async addNotice(newNotice: NoticeInputType): Promise<Boolean> {
    return await this.NoticeRepository.addNotice(newNotice);
  }
}
