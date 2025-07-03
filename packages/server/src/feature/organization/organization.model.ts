import { IOrganization } from '@scspace-depot/types/organization';
import { Organization } from '@schema';
import { InferSelectModel } from 'drizzle-orm';

type OrganizationDBResult = InferSelectModel<typeof Organization>;

export class MOrganization implements IOrganization {
  id: IOrganization['id'];
  name: IOrganization['name'];
  status: IOrganization['status'];
  hasRoom: IOrganization['hasRoom'];
  delegatorId: IOrganization['delegatorId'];
  timeRegister: IOrganization['timeRegister'];
  timeUpdate: IOrganization['timeUpdate'];

  constructor(organization: IOrganization) {
    this.id = organization.id;
    this.name = organization.name;
    this.status = organization.status;
    this.hasRoom = organization.hasRoom;
    this.delegatorId = organization.delegatorId;
    this.timeRegister = organization.timeRegister;
    this.timeUpdate = organization.timeUpdate;
  }

  static fromDB(organization: OrganizationDBResult): IOrganization {
    return {
      id: organization.id,
      name: organization.name,
      status: organization.status,
      hasRoom: organization.hasRoom,
      delegatorId: organization.delegatorId,
      timeRegister: organization.timeRegister,
      timeUpdate: organization.timeUpdate,
    };
  }
} 
