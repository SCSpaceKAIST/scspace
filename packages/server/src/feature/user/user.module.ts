import { Module } from '@nestjs/common';
import { DBModule } from 'src/db/db.module';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserPublicService } from './user.public.service';

@Module({
  imports: [DBModule],
  providers: [UserService, UserRepository, UserPublicService],
  controllers: [UserController],
  exports: [UserPublicService],
})
export class UserModule { }
