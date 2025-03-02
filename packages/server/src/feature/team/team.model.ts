import { ITeam } from '@depot/types/reservation';
import { Team } from '@schema';
import { InferSelectModel } from 'drizzle-orm';

type TeamDBResult = InferSelectModel<typeof Team>;

export class MTeam implements ITeam {
  id: ITeam['id'];
  name: ITeam['name'];
  delegatorId: ITeam['delegatorId'];
  timeRegister: ITeam['timeRegister'];
  semesterId: ITeam['semesterId'];

  constructor(private readonly team: ITeam) {
    Object.assign(this, team);
  }

  static fromDB(team: TeamDBResult): MTeam {
    return new MTeam({ ...team });
  }
}
