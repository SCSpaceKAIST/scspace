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

export function getNow() {
  const date = new Date();

  const year = date.getFullYear();
  const month = date.getMonth() + 12 * year;
  const day = date.getDate() + 32 * month;
  const hour = date.getHours() + day * 24;
  const minute = date.getMinutes() + hour * 60;

  return minute;
}

export function getTime(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 12 * year;
  const day = date.getDate() + 32 * month;
  const hour = date.getHours() + day * 24;
  const minute = date.getMinutes() + hour * 60;

  return minute;
}

export function getDateUnit(time: number) {
  const minute = time % 60;
  time = Math.floor(time / 60);
  const hour = time % 24;
  time = Math.floor(time / 24);
  const day = time % 32;
  time = Math.floor(time / 32);
  const month = time % 12;
  const year = Math.floor(time / 12);

  return { year, month, day, hour, minute };
}

export function getDate(time: number): Date {
  const { year, month, day, hour, minute } = getDateUnit(time);
  return new Date(year, month, day, hour, minute);
}

export function getDateDiff(timeBefore: number, timeAfter: number) {
  const dateBefore = getDate(timeBefore);
  const dateAfter = getDate(timeAfter);
  return getTime(new Date(dateAfter.getTime() - dateBefore.getTime()));
}