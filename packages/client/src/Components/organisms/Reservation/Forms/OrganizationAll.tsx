"use client";

import { useAllOrganization } from "@scspace-client/Hooks/organization";
import SelectComponent, { ISelectOption } from "@scspace-client/Components/molecules/forms/Select";
import { Dispatch, SetStateAction } from "react";
import { useAuth } from "@scspace-client/Hooks/auth";
import { OrganizationStatusEnum } from "@scspace-depot/enums/organization.enum";

export function AllOrganizationForm({ setOrgId }: {
  setOrgId: Dispatch<SetStateAction<number>>;
}) {
  const { needManager } = useAuth();
  needManager();

  const { organization } = useAllOrganization();

  function onChange(e: ISelectOption) {
    setOrgId(parseInt(e.value));
  }

  return (
    <SelectComponent
      label="Organization Name"
      optionList={organization ? ([
        ...organization.filter(
          (o) => o.status !== OrganizationStatusEnum.REJECTED && o.status !== OrganizationStatusEnum.REGISTER_REQUEST
        ).map((o): ISelectOption => {
          return {
            label: o.name,
            value: o.id.toString(),
            description: "Delegator: " + o.delegator.nameKr
          }
        })
      ]) : []}
      onChange={onChange}
    />
  );
}
