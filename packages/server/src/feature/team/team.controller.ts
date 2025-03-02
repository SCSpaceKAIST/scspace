import { Controller, Get, Query } from '@nestjs/common';
import { TeamService } from './team.service';
import { ITeamResponse } from '@depot/types/reservation';

@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get('/byUserId')
  async getTeamsByUserId(
    @Query('userId') userId: string,
  ): Promise<ITeamResponse[]> {
    return this.teamService.getTeamsByUserId(parseInt(userId));
  }
}
