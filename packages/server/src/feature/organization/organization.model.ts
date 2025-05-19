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

  constructor(organization: IOrganization) {
    this.id = organization.id;
    this.name = organization.name;
    this.delegatorId = organization.delegatorId;
    this.timeRegister = organization.timeRegister;
    this.timeUpdate = organization.timeUpdate;
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
