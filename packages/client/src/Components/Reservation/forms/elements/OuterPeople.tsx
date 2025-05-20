import { Dispatch, SetStateAction } from "react";
import NumberInputComponent from "../utils/NumberInput";

export function OuterPeopleForm({ count, setCount }: {
  count: number;
  setCount: Dispatch<SetStateAction<number>>;
}) {
  return (
    <NumberInputComponent
      label="Outer Participant Number"
      value={count.toString()}
      onChange={v => setCount(parseInt(v))}
    />
  );
}
