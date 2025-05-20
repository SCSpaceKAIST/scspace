import NumberInputComponent from "../utils/NumberInput";
import { Dispatch, SetStateAction } from "react";

export function DeskForm({ count, setCount }: {
  count: number;
  setCount: Dispatch<SetStateAction<number>>;
}) {
  return (
    <NumberInputComponent
      label="Desk"
      value={count.toString()}
      onChange={v => setCount(parseInt(v))}
    />
  );
}

