import { Module, forwardRef } from '@nestjs/common';
import { DBModule } from 'src/db/db.module';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [DBModule, AuthModule], //forwardRef(() => AuthModule)
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
