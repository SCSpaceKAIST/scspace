import { Password } from './password';
import {
  Reservation,
  ReservationContent,
  ReservationContentArrayElement,
} from './reservation';
import { Semester } from './semester';
import { Space, SpaceIntroduction } from './space';
import { Team, TeamMember } from './team';
import { User } from './user';

export { Password } from './password';
export {
  Reservation,
  ReservationContent,
  ReservationContentArrayElement,
} from './reservation';
export { Semester } from './semester';
export { Space, SpaceIntroduction } from './space';

export { Team, TeamMember } from './team';
export { User } from './user';

// 스키마에 정의된 모든 테이블을 모아 내보냅니다.
export const schema = {
  Password,
  Reservation,
  ReservationContent,
  Semester,
  Space,
  SpaceIntroduction,
  Team,
  TeamMember,
  User,
  ReservationContentArrayElement,
};
