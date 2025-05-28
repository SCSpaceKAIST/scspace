import { Controller, Post, Body } from '@nestjs/common';
import { MailService } from './mail.service';
import { IMail } from "@scspace-depot/types/mail/index"
import { ISuccessResponse } from '@scspace-depot/types/common';

@Controller('mail')
export class MailController {
    constructor(private readonly mailService: MailService) { }

    @Post()
    async sendMail(
        @Body() mailData: IMail,
    ): Promise<ISuccessResponse> {
        return await this.mailService.sendMail(mailData);
    }
}
