import { Injectable } from '@nestjs/common';
import { FaqRepository } from './faq.repository';

@Injectable()
export class FaqPublicService {
  constructor(private readonly faqRepository: FaqRepository) {}

  async getFaqCount(): Promise<number> {
    return (await this.faqRepository.find({})).length;
  }
}
