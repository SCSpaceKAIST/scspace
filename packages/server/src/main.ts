import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import { config } from 'dotenv';

async function bootstrap() {
  config({ path: '../.env' }); // 상위 폴더에 있는 .env 파일을 참조

  const app = await NestFactory.create(AppModule);

  // CORS 설정
  const corsOptions = {
    origin: [
      'https://localhost',
      'https://iam2.kaist.ac.kr',
      'https://scspace.kaist.ac.kr',
    ],
    methods: ['GET', 'POST'],
    credentials: true,
  };

  app.enableCors();
  // 쿠키 파서 설정
  app.use(cookieParser());

  // URL-encoded 형식의 요청 본문을 파싱 (NestJS에서는 기본적으로 지원됨)
  //app.use(express.urlencoded({ extended: true })); // 추가적인 설정이 필요하면 사용

  await app.listen(3001);
}
bootstrap();
