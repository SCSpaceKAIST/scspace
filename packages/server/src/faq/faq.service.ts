import { Injectable } from '@nestjs/common';
import { FaqRepository } from './faq.repository';
import { FaqType } from '@depot/types/faq';

@Injectable()
export class FaqService {
  constructor(private readonly faqRepository: FaqRepository) {}

  async getFaq(faq_id: number): Promise<FaqType | false> {
    return await this.faqRepository.getFaqById(faq_id);
  }

  async getFaqAll(): Promise<FaqType[] | false> {
    return await this.faqRepository.getFaqAll();
  }
}
