import { Module } from '@nestjs/common';
import { NoticeService } from './notice.service';
import { NoticeController } from './notice.controller';
import { DBModule } from 'src/db/db.module';
import { NoticeRepository } from './notice.repository';

@Module({
  imports: [DBModule],
  providers: [NoticeService, NoticeRepository],
  controllers: [NoticeController],
})
export class NoticeModule {}
