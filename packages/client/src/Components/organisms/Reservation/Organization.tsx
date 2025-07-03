import { useOrganization } from "@scspace-client/Hooks/organization";
import SelectComponent, { ISelectOption } from "@scspace-client/Components/atoms/Select";
import { Dispatch, SetStateAction } from "react";

export function OrganizationForm({ id, setOrgId }: {
  id: number;
  setOrgId: Dispatch<SetStateAction<number>>;
}) {
  const { organization } = useOrganization({ uid: id });
  const organizations: ISelectOption[] = [
    {
      label: "개인 예약",
      value: "0",
      description: "use as individual"
    }
  ];

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
