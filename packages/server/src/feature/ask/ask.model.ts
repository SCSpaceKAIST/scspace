import { IAsk } from '@scspace-depot/types/ask';
import { InferSelectModel } from 'drizzle-orm';
import { Ask } from '@schema';

type AskDBResult = InferSelectModel<typeof Ask>;

export class MAsk implements IAsk {
  id: IAsk['id'];
  userId: IAsk['userId'];
  timePost: IAsk['timePost'];
  timeEdit: IAsk['timeEdit'];
  title: IAsk['title'];
  content: IAsk['content'];
  views: IAsk['views'];
  state: IAsk['state'];
  comment: IAsk['comment'];
  commenterId: IAsk['commenterId'];

  constructor(private readonly ask: IAsk) {
    Object.assign(this, ask);
  }

  static fromDB(ask: AskDBResult): MAsk {
    return new MAsk({
      ...ask,
    });
  }
}
