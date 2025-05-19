"use client"

import SelectComponent from "../utils/Select";

export function SpaceForm() {
  const spaces = [
    { label: "Space 1", value: "1" },
    { label: "Space 2", value: "2" },
  ]

  return (
    <SelectComponent
      label="Space Name"
      placeholder="Select Space"
      optionList={spaces}
      checkboxLabel="using Lobby"
    />
  );
}
