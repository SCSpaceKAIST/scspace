import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Redirect,
  Res,
  UseGuards,
  Req,
  Logger,
} from '@nestjs/common';
import { FaqService } from './faq.service';

@Controller('faq')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @Get(':id')
  findFaqWithID(@Param('id') id: number) {
    return this.faqService.getFaq(id);
  }

  @Get('')
  findUserWithID(@Param('id') id: string) {
    return this.faqService.getFaqAll();
  }
}
