import {
  Reservation,
  ReservationContent,
} from './reservation';
import { Space } from './space';
import { Organization, OrganizationMember } from './organization';
import { User } from './user';
import { Goods, Rental } from './rental';

export {
  Reservation,
  ReservationContent,
} from './reservation';
export { Space } from './space';

export { Organization, OrganizationMember } from './organization';
export { User } from './user';

// 스키마에 정의된 모든 테이블을 모아 내보냅니다.
export const schema = {
  Reservation, ReservationContent,
  Space,
  User,
  Organization, OrganizationMember,
  Goods, Rental,
};
