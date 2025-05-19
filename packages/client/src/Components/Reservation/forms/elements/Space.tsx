"use client"

import SelectComponent from "../utils/Select";

export function SpaceForm() {
  const spaces = [
    { label: "Space 1", value: "1" },
    { label: "Space 2", value: "2" },
    { label: "Space 3", value: "3" },
  ]

  return (
    <SelectComponent
      label="Space Name"
      placeholder="Select Space"
      optionList={spaces}
      checkboxLabel={{
        1: "use Lobby",
        2: "use Busking Zone",
      }}
    />
  );
}
