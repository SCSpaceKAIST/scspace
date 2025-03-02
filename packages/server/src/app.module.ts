import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './feature/user/user.module';
import { DBModule } from './db/db.module';
import { AuthModule } from './feature/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { FaqModule } from './feature/faq/faq.module';
import { NoticeModule } from './feature/notice/notice.module';
import { AskModule } from './feature/ask/ask.module';
import { SpaceModule } from './feature/space/space.module';
import { ReservationModule } from './feature/reservation/reservation.module';
import { TeamModule } from './feature/team/team.module';
import { PasswordModule } from './feature/password/password.module';
import { SemesterModule } from './feature/semester/semester.module';

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
    TeamModule,
    PasswordModule,
    SemesterModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
