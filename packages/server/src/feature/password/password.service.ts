import { Injectable, Logger } from '@nestjs/common';
import { PasswordRepository } from './password.repository';
import { IPassword, IPasswordValidation } from '@depot/types/password';
import { SpacePublicService } from '../space/space.public.service';
import { MPassword } from './password.model';

@Injectable()
export class PasswordService {
  constructor(
    private readonly passwordRepository: PasswordRepository,
    private readonly spacePublicService: SpacePublicService,
  ) {}

  async validAll(): Promise<IPassword[]> {
    const passwords = await this.passwordRepository.validAll();
    return passwords.map((password) => MPassword.fromDB(password));
  }

  async validSpaces(userId: number): Promise<IPasswordValidation[]> {
    const spaces = await this.spaceRepository.getSpaceAll();
    if (!spaces) return false;
    const now = new Date();

    // 각 공간에 대해 비밀번호 유효성 검사를 병렬로 처리
    const validations = await Promise.all(
      spaces.map(async (space) => {
        const valid = await this.passwordRepository.validSpaceCheck(
          userId,
          space.spaceId,
          now,
        );
        return {
          spaceId: space.spaceId,
          valid: valid,
        } as IPasswordValidation;
      }),
    );

    Logger.log('Password Validations: ' + JSON.stringify(validations));
    return validations;
  }
}
