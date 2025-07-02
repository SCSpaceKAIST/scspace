export enum OrganizationStatusEnum {
  REJECTED = -1, // 자동삭제 예정
  REGISTER_REQUEST = 0,
  REGISTERED = 1, // 팀플 같은거,
  VERIFY_REQUEST = 2,
  VERIFIED = 3, // 공집기 추첨에 쓰임
}