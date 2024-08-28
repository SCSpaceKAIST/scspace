import { Injectable } from '@nestjs/common';
import { FaqRepository } from './faq.repository';

@Injectable()
export class FaqService {
  constructor(private readonly faqRepository: FaqRepository) {}

  async getFaq(faq_id: number) {
    return await this.faqRepository.getFaqById(faq_id);
  }

  async getFaqAll() {
    return await this.faqRepository.getFaqAll();
  }
}
