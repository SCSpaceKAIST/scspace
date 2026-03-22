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
      onChange={v => {
        const parsed = parseInt(v);
        if (!isNaN(parsed)) setCount(parsed);
        else if (v === "") setCount(0);
      }}
    />
  );
}
