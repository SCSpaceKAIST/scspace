import { Controller, Get, Query } from '@nestjs/common';
import { TeamService } from './team.service';
import { ITeamResponse } from '@scspace-depot/types/reservation';

@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get('/byUserId')
  async getTeamsByUserId(
    @Query('userId') userId: string,
  ): Promise<ITeamResponse[]> {
    console.log('getTeamsByUserId', userId);
    const res = await this.teamService.getTeamsByUserId(parseInt(userId));
    console.log('getTeamsByUserId res', res);
    return res;
  }
}
