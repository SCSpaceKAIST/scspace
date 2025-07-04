import NumberInputComponent from "@scspace-client/Components/atoms/NumberInput";
import { Dispatch, SetStateAction } from "react";

export function ChairForm({ count, setCount }: {
  count: number;
  setCount: Dispatch<SetStateAction<number>>;
}) {
  return (
    <NumberInputComponent
      label="Chair"
      value={count.toString()}
      onChange={v => setCount(parseInt(v))}
    />
  );
}
