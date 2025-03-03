import { Injectable } from '@nestjs/common';
import { AskService } from './feature/ask/ask.service';
@Injectable()
export class AppService {
  constructor(private readonly askService: AskService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async fillContent(): Promise<boolean> {
    const ask = await this.askService.findAll();

    if (ask.length !== 0) {
      return false;
    }

    return true;
  }
}
