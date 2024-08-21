import { IsString } from 'class-validator';

export class LoginRequestDto {
  @IsString()
  user_id: string;
}
