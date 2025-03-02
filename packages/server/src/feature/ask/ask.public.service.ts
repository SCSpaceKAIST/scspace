import { Injectable } from '@nestjs/common';
import { AskRepository } from './ask.repository';
import { takeOne } from 'src/common/util';

@Injectable()
export class AskPublicService {
  constructor(private readonly askRepository: AskRepository) {}

  async incrementViews(id: number) {
    const ask = await this.askRepository.find({ id }).then(takeOne);
    ask.views++;
    return await this.askRepository.update(ask);
  }
}
