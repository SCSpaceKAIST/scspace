import { asks } from './asks';
import { faqs } from './faqs';
import { notices } from './notices';
import { passwords } from './passwords';
import { reservations } from './reservations';
import { semesters } from './semesters';
import { space_introductions } from './space_introductions';
import { spaces } from './spaces';
import { team_members } from './team_members';
import { teams } from './teams';
import { users } from './users';

// 스키마에 정의된 모든 테이블을 모아 내보냅니다.
export const schema = {
  asks,
  faqs,
  notices,
  passwords,
  reservations,
  semesters,
  space_introductions,
  spaces,
  team_members,
  teams,
  users,
};
