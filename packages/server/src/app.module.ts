import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { DBModule } from './db/db.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { FaqModule } from './faq/faq.module';
import { NoticeModule } from './notice/notice.module';
import { AskModule } from './ask/ask.module';
import { SpaceModule } from './space/space.module';
import { ReservationModule } from './reservation/reservation.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    DBModule,
    AuthModule,
    FaqModule,
    NoticeModule,
    AskModule,
    SpaceModule,
    ReservationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
