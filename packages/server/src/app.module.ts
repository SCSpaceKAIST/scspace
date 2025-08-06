import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './feature/user/user.module';
import { DBModule } from './db/db.module';
import { AuthModule } from './feature/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { SpaceModule } from './feature/space/space.module';
import { ReservationModule } from './feature/reservation/reservation.module';
import { OrganizationModule } from './feature/organization/organization.module';
import { join } from 'path';
import { MailModule } from './tools/mailer/mail.module';
import { LotterySeminarModule } from './feature/lottery/seminar/lottery.seminar.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [join(__dirname, '../../.env')],
    }),
    UserModule,
    DBModule,
    AuthModule,
    SpaceModule,
    ReservationModule,
    OrganizationModule,
    MailModule,
    LotterySeminarModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
