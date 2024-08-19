import { defineConfig } from 'drizzle-kit';
import { config } from 'dotenv';
import path from 'path';
config();
const { DB_HOST, DB_PORT, DB_USER, DB_PWD, DB_NAME } = process.env;
const DB_URL = `mysql://${DB_USER}:${DB_PWD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

export default defineConfig({
  schema: path.resolve(__dirname, './schema'), // './schema'는 현재 파일에서 상대 경로
  out: path.resolve(__dirname, './migrations'), // 마이그레이션 파일이 생성될 경로

  dialect: 'mysql',

  dbCredentials: {
    url: DB_URL,
  },
});
