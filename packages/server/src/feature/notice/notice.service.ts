import { Injectable } from '@nestjs/common';
import { NoticeRepository } from './notice.repository';
import { INoticeCreate, INotice } from '@scspace-depot/types/notice';
import { MNotice } from './notice.model';
import { NoticePublicService } from './notice.public.service';

@Injectable()
export class NoticeService {
  constructor(
    private readonly noticeRepository: NoticeRepository,
    private readonly noticePublicService: NoticePublicService,
  ) {}

  async getNoticeAll(): Promise<MNotice[]> {
    return await this.noticeRepository.fetchAll();
  }

  async getNoticeByID(noticeId: number): Promise<MNotice> {
    await this.noticePublicService.incrementViews(noticeId);
    return await this.noticeRepository.fetch(noticeId);
  }

  async postNotice(newNotice: INoticeCreate): Promise<boolean> {
    return await this.noticeRepository.insertNotice(newNotice);
  }

  async updateNotice(notice: INotice): Promise<boolean> {
    return await this.noticeRepository.update(notice);
  }
}
