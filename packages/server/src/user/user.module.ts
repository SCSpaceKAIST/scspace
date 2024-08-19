import { Module } from '@nestjs/common';
import { DBModule } from 'src/db/db.module';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [DBModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
