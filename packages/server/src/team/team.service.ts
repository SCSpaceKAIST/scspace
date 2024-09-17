import { Injectable } from '@nestjs/common';
import { TeamRepository } from './team.repository';
import { TeamType } from '@depot/types/reservation';

@Injectable()
export class TeamService {
  constructor(private readonly teamRepository: TeamRepository) {}

  async getAll(): Promise<TeamType[] | false> {
    return this.teamRepository.getAll();
  }
  async getTeamsByUserId(userId: string): Promise<TeamType[] | false> {
    return this.teamRepository.getTeamsByUserId(userId);
  }
}
