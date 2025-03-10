import { IFaq } from '@scspace-depot/types/faq';
import { Faq } from '@schema';
import { InferSelectModel } from 'drizzle-orm';

type FaqDBResult = InferSelectModel<typeof Faq>;

export class MFaq implements IFaq {
  id: IFaq['id'];
  question: IFaq['question'];
  answer: IFaq['answer'];
  timePost: IFaq['timePost'];
  timeEdit: IFaq['timeEdit'];

  constructor(private readonly faq: IFaq) {
    Object.assign(this, faq);
  }

  static fromDB(faq: FaqDBResult): MFaq {
    return new MFaq({
      ...faq,
    });
  }

  static toDB(faq: IFaq): FaqDBResult {
    return {
      ...faq,
      timeEdit: faq.timeEdit ?? null,
    };
  }
}
