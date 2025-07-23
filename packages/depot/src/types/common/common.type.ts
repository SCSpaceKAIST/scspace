export interface ISuccessResponse {
  success: boolean;
};

export interface IDataResponse<T> {
  data: T;
  count: number;
}