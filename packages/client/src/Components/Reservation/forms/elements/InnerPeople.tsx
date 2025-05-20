import { Dispatch, SetStateAction } from "react";
import NumberInputComponent from "../utils/NumberInput";

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
