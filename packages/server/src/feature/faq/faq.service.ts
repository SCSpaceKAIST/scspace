import { Injectable } from '@nestjs/common';
import { FaqRepository } from './faq.repository';
import { IFaq } from '@scspace-depot/types/faq';

@Injectable()
export class FaqService {
  constructor(private readonly faqRepository: FaqRepository) {}

  async getFaq(faq_id: number): Promise<IFaq> {
    return await this.faqRepository.fetch(faq_id);
  }

  async getFaqAll(): Promise<IFaq[]> {
    return await this.faqRepository.fetchAll();
  }
}
