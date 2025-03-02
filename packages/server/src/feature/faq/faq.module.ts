import { Module } from '@nestjs/common';
import { FaqService } from './faq.service';
import { FaqController } from './faq.controller';
import { FaqRepository } from './faq.repository';
import { DBModule } from 'src/db/db.module';
import { FaqPublicService } from './faq.public.service';

@Module({
  imports: [DBModule],
  providers: [FaqService, FaqRepository, FaqPublicService],
  controllers: [FaqController],
  exports: [FaqPublicService],
})
export class FaqModule {}
