// enum의 모든 값을 배열로 변환하는 함수
export function enumToArray<T extends Record<string, unknown>>(enumObj: T): T[keyof T][] {
  return Object.values(enumObj) as T[keyof T][];
}