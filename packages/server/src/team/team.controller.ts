import { Controller, Get, Query } from '@nestjs/common';
import { TeamService } from './team.service';

@Controller('team')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get('/all')
  async getAll() {
    return this.teamService.getAll();
  }
  @Get('/byUserId')
  async getTeamsByUserId(@Query('user_id') userId: string) {
    return this.teamService.getTeamsByUserId(userId);
  }
}
