"use client"

import SelectComponent, { ISelectOption } from "../utils/Select";
import { useAllSpace } from "@scspace-client/Hooks/space";
import { SmallLoading } from "@scspace-client/Components/Loading/Loading";
import { Dispatch, SetStateAction } from "react";

export function SpaceForm({ setSpaceId }: {
  setSpaceId: Dispatch<SetStateAction<number>>;
}) {
  const { spaces } = useAllSpace();

  function onChange(e: ISelectOption) {
    setSpaceId(parseInt(e.value));
  }

  return (spaces ? (
    <SelectComponent
      label="Space Name"
      optionList={spaces.map((s): ISelectOption => {
        return {
          label: s.nameKr,
          description: s.nameEn,
          value: s.id.toString()
        }
      })}
      checkboxLabel={{
        "조수미홀": "use Lobby",
        "버스킹 존": "use Busking Zone"
      }}
      onChange={onChange}
    />
  ) : (
    <SmallLoading />
  ));
}
