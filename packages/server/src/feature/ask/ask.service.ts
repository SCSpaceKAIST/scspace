import {
  IAsk,
  IAskCreate,
  IAskResponse,
  IAskCommentCreate,
} from '@depot/types/ask';
import { Injectable } from '@nestjs/common';
import { AskRepository } from './ask.repository';
import { AskStateEnum } from '@depot/enums/ask.enum';
import { takeOne } from 'src/common/util';
import { AskPublicService } from './ask.public.service';
import { UserPublicService } from '../user/user.public.service';

@Injectable()
export class AskService {
  constructor(
    private readonly askRepository: AskRepository,
    private readonly askPublicService: AskPublicService,
    private readonly userPublicService: UserPublicService,
  ) {}

  async getAskAll(): Promise<IAsk[]> {
    return await this.askRepository.find({});
  }

  async getAskLatest(): Promise<IAsk[]> {
    return await this.askRepository.find({
      states: [AskStateEnum.WAIT, AskStateEnum.RECEIVE],
    });
  }

  async getAskWithID(id: number): Promise<IAskResponse> {
    await this.askPublicService.incrementViews(id);
    const ask = await this.askRepository.find({ id }).then(takeOne('ask'));

    const [user, commenter] = await Promise.all([
      this.userPublicService.fetchUser(ask.userId),
      ask.commenterId
        ? this.userPublicService.fetchUser(ask.commenterId)
        : null,
    ]);
    return {
      ...ask,
      user,
      commenter,
    };
  }

  async postAsk(newObj: IAskCreate): Promise<boolean> {
    return await this.askRepository.insert(newObj);
  }

  async putAskComment(content: IAskCommentCreate) {
    const ask = await this.askRepository
      .find({ id: content.id })
      .then(takeOne('ask'));

    return await this.askRepository.update({
      ...ask,
      ...content,
    });
  }
}
