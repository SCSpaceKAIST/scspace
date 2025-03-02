import { Controller, Get, Param } from '@nestjs/common';
import { FaqService } from './faq.service';

@Controller('faq')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @Get('all')
  getFaqAll() {
    return this.faqService.getFaqAll();
  }

  @Get(':id')
  getFaqWithID(@Param('id') id: string) {
    return this.faqService.getFaq(parseInt(id));
  }
}
