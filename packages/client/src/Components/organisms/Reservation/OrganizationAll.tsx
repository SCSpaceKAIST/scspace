"use client";

import { useAllOrganization } from "@scspace-client/Hooks/organization";
import SelectComponent, { ISelectOption } from "@scspace-client/Components/molecules/forms/Select";
import { Dispatch, SetStateAction } from "react";
import { useAuth } from "@scspace-client/Hooks/auth";

export function OrganizationForm({ setOrgId }: {
  setOrgId: Dispatch<SetStateAction<number>>;
}) {
  const { needManager } = useAuth();
  needManager();

  const { organization } = useAllOrganization();
  const organizations: ISelectOption[] = [];

  function onChange(e: ISelectOption) {
    setOrgId(parseInt(e.value));
  }

  return (
    <SelectComponent
      label="Organization Name"
      optionList={organization ? ([
        organizations[0],
        ...organization.map((o): ISelectOption => {
          return {
            label: o.name,
            value: o.id.toString(),
            description: "Delegator: " + o.delegator.nameKr
          }
        })
      ]) : (organizations)}
      onChange={onChange}
    />
  );
}
