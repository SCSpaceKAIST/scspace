import { AskInputType, AskType } from '@depot/types/ask';
import { Injectable } from '@nestjs/common';
import { AskRepository } from './ask.repository';

@Injectable()
export class AskService {
  constructor(private readonly askRepository: AskRepository) {}

  async get(id: number): Promise<AskType | false> {
    await this.askRepository.incrementViewsById(id);
    return await this.askRepository.getById(id);
  }

  async getAll(): Promise<AskType[] | false> {
    return await this.askRepository.getAll();
  }
  async add(newObj: AskInputType): Promise<Boolean> {
    return await this.askRepository.add(newObj);
  }
  async addComment(content: AskType) {
    await this.askRepository.addComment(content);
  }
}
