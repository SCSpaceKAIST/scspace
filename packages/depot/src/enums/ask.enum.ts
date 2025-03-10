export enum AskStateEnum {
  WAIT = 1,
  RECEIVE = 2,
  SOLVE = 3,
}

export const askStateStringToEnum = (state: string): AskStateEnum => {
  return AskStateEnum[state as keyof typeof AskStateEnum];
};
