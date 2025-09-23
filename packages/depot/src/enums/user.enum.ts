export enum UserAuthBinaryEnum {
  USER = 1 << 0,      // 1
  MANAGER = 1 << 1,   // 2
  ADMIN = 1 << 2,     // 4
  WORKER = 1 << 3,    // 8
  PASSPIN_MASTER = 1 << 4 // 16
}
