import { Injectable, Logger } from '@nestjs/common';
import { PasswordRepository } from './password.repository';
import { PasswordType, PasswordValidationType } from '@depot/types/password';
import { SpaceRepository } from 'src/space/space.repository';

@Injectable()
export class PasswordService {
  constructor(
    private readonly passwordRepository: PasswordRepository,
    private readonly spaceRepository: SpaceRepository,
  ) {}

  async validAll(): Promise<PasswordType[] | false> {
    return this.passwordRepository.validAll();
  }
  async validSpaces(
    user_id: string,
  ): Promise<PasswordValidationType[] | false> {
    const spaces = await this.spaceRepository.getSpaceAll();
    if (!spaces) return false;
    const now = new Date();

    // 각 공간에 대해 비밀번호 유효성 검사를 병렬로 처리
    const validations = await Promise.all(
      spaces.map(async (space) => {
        const valid = await this.passwordRepository.validSpaceCheck(
          user_id,
          space.space_id,
          now,
        );
        return {
          space_id: space.space_id,
          valid: valid,
        } as PasswordValidationType;
      }),
    );

    Logger.log('Password Validations: ' + JSON.stringify(validations));
    return validations;
  }
}
