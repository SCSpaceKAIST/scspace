import { Module } from '@nestjs/common';
import { AskService } from './ask.service';
import { AskController } from './ask.controller';
import { AskRepository } from './ask.repository';
import { DBModule } from 'src/db/db.module';

@Module({
  imports: [DBModule],
  providers: [AskService, AskRepository],
  controllers: [AskController],
})
export class AskModule {}
