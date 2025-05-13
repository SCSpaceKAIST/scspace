import { ITeamMember } from '@scspace-depot/types/reservation';
import { TeamMember } from '@schema';
import { InferSelectModel } from 'drizzle-orm';

type TeamMemberDBResult = InferSelectModel<typeof TeamMember>;

export class MTeamMember implements ITeamMember {
  id: ITeamMember['id'];
  teamId: ITeamMember['teamId'];
  userId: ITeamMember['userId'];
  joined: ITeamMember['joined'];

  constructor(private readonly teamMember: ITeamMember) {
    Object.assign(this, teamMember);
  }

  static fromDB(teamMember: TeamMemberDBResult): MTeamMember {
    return new MTeamMember({ ...teamMember });
  }
}
