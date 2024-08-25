import { Module, forwardRef } from '@nestjs/common';
import { DBModule } from 'src/db/db.module';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from 'src/auth/auth.module';
import { UserRepository } from './user.repository';

@Module({
  imports: [DBModule, forwardRef(() => AuthModule)], //
  providers: [UserService, UserRepository],
  controllers: [UserController],
  exports: [UserRepository],
})
export class UserModule {}
