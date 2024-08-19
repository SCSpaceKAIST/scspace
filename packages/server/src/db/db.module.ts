import { Module } from '@nestjs/common';
import { DBAsyncProvider, DBProvider } from './db.provider';

@Module({
  providers: [...DBProvider],
  exports: [DBAsyncProvider],
})
export class DBModule {}
