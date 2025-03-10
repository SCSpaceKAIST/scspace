import { INotice } from '@scspace-depot/types/notice';
import { Notice } from '@schema';
import { InferSelectModel } from 'drizzle-orm';

type NoticeDBResult = InferSelectModel<typeof Notice>;

export class MNotice implements INotice {
  id: INotice['id'];
  timePost: INotice['timePost'];
  timeEdit: INotice['timeEdit'];
  title: INotice['title'];
  content: INotice['content'];
  views: INotice['views'];
  important: INotice['important'];
  userId: INotice['userId'];

  constructor(private readonly notice: INotice) {
    Object.assign(this, notice);
  }

  static fromDB(notice: NoticeDBResult): MNotice {
    return new MNotice({
      ...notice,
    });
  }

  static toDB(notice: INotice): NoticeDBResult {
    return {
      ...notice,
      timeEdit: notice.timeEdit ?? null,
    };
  }
}
