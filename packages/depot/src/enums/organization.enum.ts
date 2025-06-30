export enum OrganizationVerificationStatus {
  WAITING = 1,
  REJECTED = 2, // 자동삭제 예정
  APPROVED = 3, // 팀플 같은거
  VERIFIED = 4, // 공집기 추첨에 쓰임
}