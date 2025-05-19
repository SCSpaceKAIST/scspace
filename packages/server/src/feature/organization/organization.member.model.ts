import { IOrganizationMember } from '@scspace-depot/types/organization';
import { OrganizationMember } from '@schema';
import { InferSelectModel } from 'drizzle-orm';

type OrganizationMemberDBResult = InferSelectModel<typeof OrganizationMember>;

export class MOrganizationMember implements IOrganizationMember {
  id: IOrganizationMember['id'];
  organizationId: IOrganizationMember['organizationId'];
  userId: IOrganizationMember['userId'];
  timeRegister: IOrganizationMember['timeRegister'];

  constructor(private readonly organizationMember: IOrganizationMember) {
    Object.assign(this, organizationMember);
  }

  static fromDB(organizationMember: OrganizationMemberDBResult): MOrganizationMember {
    return new MOrganizationMember({
      id: organizationMember.id,
      organizationId: organizationMember.organizationId,
      userId: organizationMember.userId,
      timeRegister: organizationMember.timeRegister,
    });
  }
} 
