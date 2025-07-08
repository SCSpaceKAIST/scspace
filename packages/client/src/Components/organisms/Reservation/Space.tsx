"use client"

import SelectComponent, { ISelectOption } from "@scspace-client/Components/molecules/forms/Select";
import { useAllSpace } from "@scspace-client/Hooks/space";
import { SmallLoading } from "@scspace-client/Components/atoms/Loading";
import { Dispatch, SetStateAction } from "react";

export function SpaceForm({ setSpaceId, setCheck }: {
  setSpaceId: Dispatch<SetStateAction<number>>;
  setCheck: Dispatch<SetStateAction<boolean>>;
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
        "오픈스페이스": "use Busking Zone"
      }}
      onChange={onChange}
      setCheck={setCheck}
    />
  ) : (
    <SmallLoading />
  ));
}
