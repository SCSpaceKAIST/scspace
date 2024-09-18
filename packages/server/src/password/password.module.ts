import { Module } from '@nestjs/common';
import { PasswordService } from './password.service';
import { PasswordController } from './password.controller';
import { DBModule } from 'src/db/db.module';
import { PasswordRepository } from './password.repository';
import { SpaceModule } from 'src/space/space.module';

@Module({
  imports: [DBModule, SpaceModule],
  providers: [PasswordService, PasswordRepository],
  controllers: [PasswordController],
})
export class PasswordModule {}
