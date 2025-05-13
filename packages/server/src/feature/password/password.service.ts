import { Injectable, Logger } from '@nestjs/common';
import { PasswordRepository } from './password.repository';
import { IPassword, IPasswordValidation } from '@scspace-depot/types/password';
import { SpacePublicService } from '../space/space.public.service';
import { ReservationPublicService } from '../reservation/reservation.public.service';

@Injectable()
export class PasswordService {
  constructor(
    private readonly passwordRepository: PasswordRepository,
    private readonly spacePublicService: SpacePublicService,
    private readonly reservationPublicService: ReservationPublicService,
  ) {}

  async validAll(): Promise<IPassword[]> {
    const passwords = await this.passwordRepository.find({ changed: true });
    return passwords;
  }

  async validSpaces(userId: number): Promise<IPasswordValidation[]> {
    const spaces = await this.spacePublicService.findAll();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayNextWeek = new Date();
    todayNextWeek.setDate(today.getDate() + 7);
    const spaceIds = spaces.map((space) => space.id);
    const reservations = await this.reservationPublicService.find({
      userId,
      timeRange: {
        timeFrom: today,
        timeTo: todayNextWeek,
      },
      spaceIds,
    });

    // 각 공간에 대해 비밀번호 유효성 검사를 병렬로 처리
    const validations = await Promise.all(
      spaces.map(async (space) => {
        return {
          spaceId: space.id,
          valid: reservations.some(
            (reservation) => reservation.spaceId === space.id,
          ),
        };
      }),
    );

    Logger.log('Password Validations: ' + JSON.stringify(validations));
    return validations;
  }
}
