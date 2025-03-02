import { Injectable } from '@nestjs/common';
import { TeamRepository } from './team.repository';
import { ITeamResponse } from '@depot/types/reservation';
import { UserPublicService } from '../user/user.public.service';
import { SemesterRepository } from '../semester/semester.repository';
import { TeamMemberRepository } from './team.member.repository';

@Injectable()
@Injectable()
export class TeamService {
  constructor(
    private readonly teamRepository: TeamRepository,
    private readonly teamMemberRepository: TeamMemberRepository,
    private readonly userPublicService: UserPublicService,
    private readonly semesterRepository: SemesterRepository,
  ) {}

  async getTeamsByUserId(userId: number): Promise<ITeamResponse[]> {
    const teams = await this.teamRepository.fetchAll(userId);
    const teamIds = [...new Set(teams.map((e) => e.id))];

    const teamMembers = await this.teamMemberRepository.fetchUnionAll(teamIds);
    const users = await this.userPublicService.fetchAll(
      teamMembers.map((e) => e.userId),
    );
    const semesters = await this.semesterRepository.fetchAll(
      teams.map((e) => e.semesterId),
    );

    return teams.map((team) => {
      const teamMemberForTeam = teamMembers.filter((e) => e.teamId === team.id);

      return {
        ...team,
        delegator: users.find((user) => user.id === team.delegatorId),
        semester: semesters.find((semester) => semester.id === team.semesterId),
        members: teamMemberForTeam.map((teamMember) => ({
          ...teamMember,
          user: users.find((user) => user.id === teamMember.userId),
        })),
      } as ITeamResponse;
    });
  }
}
