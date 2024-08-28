import { Module } from '@nestjs/common';
import { FaqService } from './faq.service';
import { FaqController } from './faq.controller';
import { FaqRepository } from './faq.repository';
import { DBModule } from 'src/db/db.module';

@Module({
  imports: [DBModule],
  providers: [FaqService, FaqRepository],
  controllers: [FaqController],
})
export class FaqModule {}
