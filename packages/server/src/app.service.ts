import { Injectable } from '@nestjs/common';
import { AskPublicService } from './feature/ask/ask.public.service';
@Injectable()
export class AppService {
  constructor(private readonly askPublicService: AskPublicService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async fillContent(): Promise<boolean> {
    const askCount = await this.askPublicService.getAskCount();

    if (askCount !== 0) {
      return false;
    }

    return true;
  }
}
