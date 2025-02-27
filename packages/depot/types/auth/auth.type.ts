export interface ILoginRequest {
  client_id: string;
  redirect_uri: string;
  state: string;
  nonce: string;
}
