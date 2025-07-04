import NumberInputComponent from "@scspace-client/Components/atoms/NumberInput";
import { Dispatch, SetStateAction } from "react";

export function InnerPeopleForm({ count, setCount }: {
  count: number;
  setCount: Dispatch<SetStateAction<number>>;
}) {
  return (
    <NumberInputComponent
      label="Inner Participant Number"
      value={count.toString()}
      onChange={v => setCount(parseInt(v))}
    />
  );
}
