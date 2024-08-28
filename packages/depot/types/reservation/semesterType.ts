type SemesterSeasonEnum = "봄" | "가을";

// Table: semesters
export interface SemestersType {
  semester_id: string; // char(3)
  date_from: Date;
  date_to: Date;
  year: number;
  season: SemesterSeasonEnum;
}
