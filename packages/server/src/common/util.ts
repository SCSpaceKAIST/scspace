import { BadRequestException, NotFoundException } from '@nestjs/common';

export function timeRangeCheck(timeFrom: number, timeTo: number): boolean {
  return timeFrom < timeTo;
}

export function takeOne<T>(name?: string): (array: T[]) => T {
  return (array: T[]) => {
    // 배열의 요소가 하나만 나왔는 지를 검증하는 함수
    if (array.length === 0)
      throw new NotFoundException(`${name ?? 'array'} is empty`);
    if (array.length > 1)
      throw new BadRequestException(`${name ?? 'array'} is not only one`);
    return array[0];
  };
}

export function takeUnique<
  T extends string | number | boolean | symbol | null | undefined | bigint,
>(array: T[]): T[] {
  // 중복을 제외하고 배열을 반환하는 함수
  // JS 기본 자료형에 대해 잘 작동할듯??
  return [...new Set(array)];
}

export function checkContainAllId<T, K extends number>(
  ids: K[],
  array: T[],
  name?: string,
): asserts array is T[] & { [key in K]: T } {
  // 중복을 제외하고, 넣은 id가 모두 값이 잘 나왔는지를 체크해주는 함수
  const uniqueIds = takeUnique(ids);
  if (ids.some((id) => !uniqueIds.includes(id))) {
    throw new NotFoundException(
      `The length of ${name ?? 'array'} does not match | id length: ${uniqueIds.length} || array length: ${array.length}`,
    );
  }
}

export function takeAll<T extends { id: K }, K extends number>(
  ids: K[],
  name?: string,
): (array: T[]) => T[] {
  // 중복을 제외하고, 넣은 id가 모두 값이 잘 나왔는지를 체크해서 값을 얻는 함수
  return (array: T[]) => {
    checkContainAllId(ids, array, name);
    return array;
  };
}

export function takeExist<T>(name?: string): (array: T[]) => T[] {
  return (array: T[]) => {
    if (array.length === 0)
      throw new NotFoundException(`${name ?? 'array'} is empty`);
    return array;
  };
}
