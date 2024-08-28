import { Injectable } from '@nestjs/common';
import { NoticeRepository } from './notice.repository';
import { NoticeType } from '@depot/types/notice';

@Injectable()
export class NoticeService {
  constructor(private readonly NoticeRepository: NoticeRepository) {}

  async getNotice(Notice_id: number): Promise<NoticeType | false> {
    return await this.NoticeRepository.getNoticeById(Notice_id);
  }

  async getNoticeAll(): Promise<NoticeType[] | false> {
    return await this.NoticeRepository.getNoticeAll();
  }
}
