import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { MailService } from './mail.service';
import { IMail } from "@scspace-depot/types/mail"
import { ISuccessResponse } from '@scspace-depot/types/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('mail')
export class MailController {
    constructor(private readonly mailService: MailService) { }

    @UseGuards(AuthGuard("jwt"))
    @Post()
    async sendMail(
        @Body() mailData: IMail,
    ): Promise<ISuccessResponse> {
        return await this.mailService.sendMail(mailData);
    }
}
