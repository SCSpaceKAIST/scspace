import NumberInputComponent from "@scspace-client/Components/molecules/forms/NumberInput";
import { Dispatch, SetStateAction } from "react";

export function WorkerForm({ count, setCount }: {
  count: number;
  setCount: Dispatch<SetStateAction<number>>;
}) {
  return (
    <NumberInputComponent
      label="Worker"
      value={count.toString()}
      onChange={v => setCount(parseInt(v))}
    />
  );
}
