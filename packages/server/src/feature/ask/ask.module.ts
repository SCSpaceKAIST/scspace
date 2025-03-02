import { Module } from '@nestjs/common';
import { AskService } from './ask.service';
import { AskController } from './ask.controller';
import { AskRepository } from './ask.repository';
import { DBModule } from 'src/db/db.module';
import { UserModule } from 'src/feature/user/user.module';
import { AskPublicService } from './ask.public.service';

@Module({
  imports: [DBModule, UserModule],
  providers: [AskService, AskRepository, AskPublicService],
  controllers: [AskController],
  exports: [AskPublicService],
})
export class AskModule {}
