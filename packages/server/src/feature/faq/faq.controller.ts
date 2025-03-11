import { Controller, Get, Param } from '@nestjs/common';
import { FaqService } from './faq.service';

@Controller('faq')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @Get('all')
  async getFaqAll() {
    console.log('getFaqAll');
    const res = await this.faqService.getFaqAll();
    console.log('getFaqAll res', res);
    return res;
  }

  @Get(':id')
  async getFaqWithID(@Param('id') id: string) {
    console.log('getFaqWithID', id);
    const res = await this.faqService.getFaq(parseInt(id));
    console.log('getFaqWithID res', res);
    return res;
  }
}
