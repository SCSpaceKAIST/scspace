import { Module } from '@nestjs/common';
import { DBModule } from 'src/db/db.module';
import { SemesterRepository } from './semester.repository';
import { SemesterPublicService } from './semester.public.service';

@Module({
  imports: [DBModule],
  providers: [SemesterRepository, SemesterPublicService],
  exports: [SemesterPublicService],
})
export class SemesterModule {}
