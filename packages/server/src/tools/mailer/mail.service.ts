import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { IMail } from '@scspace-depot/types/mail';
import { ISuccessResponse } from '@scspace-depot/types/common';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) { }
    // 템플릿을 사용한 메일 보내기
    sendMail({ subject, template, to, cc, bcc, context }: IMail): Promise<ISuccessResponse> {
        if (!subject) throw new Error("Subject is missing");
        if (!template) throw new Error("Invalied Template Name");

        return this.mailerService.sendMail({
            to,
            cc: cc ?? [],
            bcc: bcc ?? [],
            subject,
            template, // 템플릿 파일명 (확장자 제외)
            context, // 템플릿에 전달할 데이터
            replyTo: "no-reply.scspace@kaist.ac.kr"
        }).then((res) => {
            return { success: true };
        }
        ).catch((error) => {
            console.error('템플릿 메일 전송 실패:', error);
            throw new Error('템플릿 메일 전송에 실패했습니다.');
        });
    }
}
