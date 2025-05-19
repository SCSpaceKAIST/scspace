import { IOrganization } from '@scspace-depot/types/organization';
import { Organization } from '@schema';
import { InferSelectModel } from 'drizzle-orm';

type OrganizationDBResult = InferSelectModel<typeof Organization>;

export class MOrganization implements IOrganization {
  id: IOrganization['id'];
  name: IOrganization['name'];
  delegatorId: IOrganization['delegatorId'];
  timeRegister: IOrganization['timeRegister'];
  timeUpdate: IOrganization['timeUpdate'];

  constructor(private readonly organization: IOrganization) {
    Object.assign(this, organization);
  }

  static fromDB(organization: OrganizationDBResult): MOrganization {
    return new MOrganization({
      id: organization.id,
      name: organization.name,
      delegatorId: organization.delegatorId,
      timeRegister: organization.timeRegister,
      timeUpdate: organization.timeUpdate,
    });
  }
} 
