import SelectComponent from "../utils/Select";

export function OrganizationForm() {
  const organizations = [
    { label: "Org 1", value: "1" },
    { label: "Org 2", value: "2" },
  ]

  return (
    <SelectComponent
      label="Organization Name"
      placeholder="Select Organization"
      optionList={organizations}
    />
  );
}
