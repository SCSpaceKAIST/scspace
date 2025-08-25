import NumberInputComponent from "@scspace-client/Components/molecules/forms/NumberInput";
import { Dispatch, SetStateAction } from "react";

export function GoodsCountForm({ count, setCount }: {
  count: number;
  setCount: Dispatch<SetStateAction<number>>;
}) {
  return (
    <NumberInputComponent
      label="Total Count"
      value={count.toString()}
      onChange={v => setCount(parseInt(v))}
    />
  );
}
