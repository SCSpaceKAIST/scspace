import { Business } from './business';
import { Notice } from './notice';
import { Organization, OrganizationMember } from './organization';
import { Passpin } from './passpin';
import { Qna } from './qna';
import { Goods, Rental } from './rental';
import { Reservation, ReservationContent, } from './reservation';
import { Rule } from './rule';
import { Space } from './space';
import { User } from './user';

// 스키마에 정의된 모든 테이블을 모아 내보냅니다.
const schema = {
  Business,
  Notice,
  Organization,
  OrganizationMember,
  Passpin,
  Qna,
  Goods,
  Rental,
  Reservation,
  ReservationContent,
  Rule,
  Space,
  User,
};

export {
  schema,

  Business,
  Notice,
  Organization,
  OrganizationMember,
  Passpin,
  Qna,
  Goods,
  Rental,
  Reservation,
  ReservationContent,
  Rule,
  Space,
  User,
};