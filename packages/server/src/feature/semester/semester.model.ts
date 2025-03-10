import { ISemester } from '@scspace-depot/types/semester';
import { Semester } from '@schema';
import { InferSelectModel } from 'drizzle-orm';

type SemesterDBResult = InferSelectModel<typeof Semester>;

export class MSemester implements ISemester {
  id: ISemester['id'];
  dateFrom: ISemester['dateFrom'];
  dateTo: ISemester['dateTo'];
  year: ISemester['year'];
  season: ISemester['season'];

  constructor(private readonly semester: ISemester) {
    Object.assign(this, semester);
  }

  static fromDB(semester: SemesterDBResult): MSemester {
    return new MSemester(semester);
  }
}
