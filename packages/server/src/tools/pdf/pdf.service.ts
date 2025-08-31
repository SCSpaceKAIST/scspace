import { BadRequestException} from "@nestjs/common";
import { ICertificatePdf} from "@scspace-depot/types/pdf/pdf.type";
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as Handlebars from 'handlebars';
import * as puppeteer from 'puppeteer';
import { MailService } from "@scspace-server/tools/mailer/mail.service";
import { v4 as uuidv4 } from 'uuid'
import { PRIVATE_FOLDER } from "@scspace-depot/consts/file.const";

@Injectable()
export class PdfService {
    constructor(
        private readonly mailService: MailService,
    ) { }

    async createRentalConfirmPdf(data : ICertificatePdf): Promise<any> {

        if (!data.user) throw new BadRequestException('Invalid User');
        if (!data.goods) throw new BadRequestException('Invalid Goods');

        try {
            //template load
            const templatePath = path.resolve(__dirname, './templates/certificate.hbs');
            const source = fs.readFileSync(templatePath, 'utf8');
            const tpl = Handlebars.compile(source, { strict: true });

            const logoBase64 = fs.readFileSync(path.resolve(__dirname, "./templates/logo.png")).toString("base64");
            const meta = {
                ...data,
                logoBase64 : logoBase64,
            }
            const html = tpl(meta);

            const browser =  await puppeteer.launch(
                {
                    channel : 'chrome',
                    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security', '--allow-file-access-from-files'],
                }
            );
            const page = await browser.newPage();
            await page.setContent(html, {waitUntil: 'networkidle0'});

            const pdfU8 =  await page.pdf({
                format: 'A4',
                printBackground: true,
                margin: {
                    top: '20mm',
                    right: '20mm',
                    bottom: '20mm',
                    left: '20mm',
                },
            });

            await page.close();
            await browser.close();

            return pdfU8;
        } catch (error) {
            console.log("에러 인 첫번째")
            console.log(error)

            const err = error instanceof Error
                ? error
                : new Error(String(error))
            await this.mailService.reportError(err,
                "pdf.service.ts > createRentalConfirmPdf")
            throw err;
        }
    }

    async createAndStoreRentalCert(data : ICertificatePdf) : Promise <{ uuid : string, filename: string}> {
        const uuid = uuidv4()

        const pdfBuffer = await this.createRentalConfirmPdf(data)

        //for test
        // const dir_parent = path.resolve(PRIVATE_FOLDER)
        const dir = path.resolve(PRIVATE_FOLDER)
        // if (!fs.existsSync(dir_parent)) throw new BadRequestException('Invalid Private-Folder Directory');
        if (!fs.existsSync(dir)) throw new BadRequestException('Invalid Private-Folder Directory');

        const filename = `${uuid}.pdf`;
        const fullPath = path.resolve(dir, filename);

        fs.writeFileSync(fullPath, pdfBuffer);

        return {
            uuid : uuid,
            filename : filename,
        }
    }

}

