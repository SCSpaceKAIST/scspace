import { Module } from '@nestjs/common';
import { NoticeService } from './notice.service';
import { NoticeController } from './notice.controller';
import { DBModule } from 'src/db/db.module';
import { NoticeRepository } from './notice.repository';
import { NoticePublicService } from './notice.public.service';

@Module({
  imports: [DBModule],
  providers: [NoticeService, NoticeRepository, NoticePublicService],
  controllers: [NoticeController],
  exports: [NoticePublicService],
})
export class NoticeModule {}
