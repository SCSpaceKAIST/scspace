import { Injectable } from '@nestjs/common';
import { NoticeRepository } from './notice.repository';

@Injectable()
export class NoticePublicService {
  constructor(private readonly noticeRepository: NoticeRepository) {}

  async incrementViews(id: number) {
    const notice = await this.noticeRepository.fetch(id);
    notice.views++;
    return await this.noticeRepository.update(notice);
  }
}
