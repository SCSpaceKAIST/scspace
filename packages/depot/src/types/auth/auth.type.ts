import { IUser } from '../user/user.type';

export interface ILoginRequest {
  client_id: string;
  redirect_uri: string;
  state: string;
  nonce: string;
}


export interface ILoginResponse {
  code: string;
  state: string;
}

export interface ILoginInfoRequest {
  client_id: string;
  redirect_uri: string;
  state: string;
  nonce: string;
}

export interface ILoginInfoSuccess {
  client_id: string;
  redirect_uri: string;
  state: string;
  nonce: string;
}

export interface ILoginInfoError {
  error: string;
  error_description: string;
}

export type ILoginInfoResponse = ILoginInfoSuccess | ILoginInfoError;

export interface IVerificationResponse {
  isLogined: boolean;
  userInfo: IUser | null;
}
