import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as handlebars from 'handlebars';

handlebars.registerHelper('eq', function(arg1, arg2):boolean   {
  return arg1 === arg2;
});


@Module({
    imports: [
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                transport: {
                    host: config.get<string>("MAIL_HOST"),
                    port: config.get<number>("MAIL_PORT"),
                    secure: false,
                    auth: {
                        user: config.get<string>("MAIL_USER"),
                        pass: config.get<string>("MAIL_PASS"),
                    },
                },
                defaults: {
                    from: `"학생문화공간위원회" <${config.get<string>("MAIL_HOST")}>`,
                },
                template: {
                    dir: join(__dirname, 'templates'),
                    adapter: new HandlebarsAdapter(),
                    options: {
                        strict: true,
                    },
                },
            })
        }),
    ],
    providers: [MailService],
    exports: [MailService],
    controllers: [MailController],
})
export class MailModule { }