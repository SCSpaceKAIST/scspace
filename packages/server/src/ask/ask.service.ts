import { AskType } from '@depot/types/ask';
import { Injectable } from '@nestjs/common';
import { AskRepository } from './ask.repository';

@Injectable()
export class AskService {
  constructor(private readonly askRepository: AskRepository) {}

  async getAsk(Ask_id: number): Promise<AskType | false> {
    return await this.askRepository.getAskById(Ask_id);
  }

  async getAskAll(): Promise<AskType[] | false> {
    return await this.askRepository.getAskAll();
  }
}
