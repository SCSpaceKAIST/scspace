export enum UserTypeEnum {
  USER = 1,
  WORKER = 2,
  MANAGER = 3,
  ADMIN = 4,
}

export enum UserAuthBinaryEnum {
  USER = 1 << 0,      // 1
  MANAGER = 1 << 1,   // 2
  ADMIN = 1 << 2,     // 4
  WORKER = 1 << 3,    // 8
  PASSPIN_MASTER = 1 << 4 // 16
}
