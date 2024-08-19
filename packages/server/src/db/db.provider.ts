import { schema } from './schema';
import { drizzle } from 'drizzle-orm/mysql2';
import * as mysql from 'mysql2/promise';
export const DBAsyncProvider = 'dbProvider';
import { config } from 'dotenv';

export const DBProvider = [
  {
    provide: DBAsyncProvider,
    useFactory: async () => {
      config();
      const { DB_HOST, DB_PORT, DB_USER, DB_PWD, DB_NAME } = process.env;
      //   const DB_URL = `mysql://${DB_USER}:${DB_PWD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
      //   console.log(DB_URL);
      //   console.log(mysql);
      const connection = await mysql.createConnection({
        host: DB_HOST,
        port: Number(DB_PORT), // 포트를 숫자로 변환
        user: DB_USER,
        password: DB_PWD,
        database: DB_NAME,
      });
      const db = drizzle(connection, { schema, mode: 'default' });
      return db;
    },
    exports: [DBAsyncProvider],
  },
];
