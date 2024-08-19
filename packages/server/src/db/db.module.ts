import { Module } from '@nestjs/common';
import { DBProvider } from './db.provider';

@Module({
  providers: [DBProvider],
})
export class DBModule {}
