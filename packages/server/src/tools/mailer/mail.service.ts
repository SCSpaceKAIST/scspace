import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { IMail } from '@scspace-depot/types/mail';
import { ISuccessResponse } from '@scspace-depot/types/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) { }
  // 템플릿을 사용한 메일 보내기
  async sendMail({ subject, template, to, cc, bcc, context, replyTo }: IMail): Promise<ISuccessResponse> {
    if (!subject) throw new Error("Subject is missing");
    if (!template) throw new Error("Invalied Template Name");

    return this.mailerService.sendMail({
      to,
      cc: cc ?? [],
      bcc: bcc ?? [],
      subject,
      template, // 템플릿 파일명 (확장자 제외)
      context, // 템플릿에 전달할 데이터
      replyTo: replyTo ? replyTo : "scspace@kaist.ac.kr" //그냥 scspace@kaist.ac.kr이나 scspacekaist@gmail.com으로 하면 되는거 아님? (진짜모름)
    }).then(() => {
      return { success: true };
    }
    ).catch((error) => {
      console.error('템플릿 메일 전송 실패:', error);
      this.reportError(error, "Error from sendMail()").then();
      const err = new Error("템플릿 메일 전송에 실패했습니다.");
      err.name = "MailSendError";
      throw err;
    });
  }

  async reportError(error: Error, additionalContext?: string): Promise<ISuccessResponse> {
    const errorMeta = {
      timestamp: new Date().toISOString(),
      errorName: error.name,
      errorMessage: error.message == '템플릿 메일 전송에 실패했습니다.' ? "템플릿 메일 전송에 실패했습니다. 추가 Error Report를 참고하십시오." : error.message,
      stackTrace: error.stack,
      additionalContext: additionalContext || 'No additional context provided'
    };

    return this.sendMail({
      to: ['jhlee012@kaist.ac.kr', "seoho7777.kim@gmail.com"],
      subject: `[SCSpace-DEV] Error Report - ${error.name}`,
      template: 'errorLog',
      context: {
        meta: errorMeta
      },
    });
  }
}


//test commit
