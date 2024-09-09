import { ReservationType } from '@depot/types/reservation';
import { Injectable } from '@nestjs/common';
import { ReservationRepository } from './reservation.repository';

@Injectable()
export class ReservationService {
  constructor(private readonly reservationRepository: ReservationRepository) {}

  async getReservationAll(): Promise<ReservationType[] | false> {
    return await this.reservationRepository.getReservationAll();
  }

  async getReservationBySpaceID(
    space_id: number,
  ): Promise<ReservationType[] | false> {
    return await this.reservationRepository.getReservationBySpaceID(space_id);
  }
}
