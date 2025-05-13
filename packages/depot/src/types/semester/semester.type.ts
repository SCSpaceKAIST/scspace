import { SemesterSeasonEnum } from "../../enums/semester.enum";
// Table: semesters
export interface ISemester {
  id: number; // int
  dateFrom: Date;
  dateTo: Date;
  year: number;
  season: SemesterSeasonEnum;
}

