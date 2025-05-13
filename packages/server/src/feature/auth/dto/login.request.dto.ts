import { IsString } from 'class-validator';

export class LoginRequestDto {
  @IsString()
  userId: string;
}
