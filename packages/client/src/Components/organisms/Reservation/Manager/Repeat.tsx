import NumberInputComponent from "@scspace-client/Components/molecules/forms/NumberInput";
import { Dispatch, SetStateAction } from "react";

export function RepeatForm({ count, setCount }: {
    count: number;
    setCount: Dispatch<SetStateAction<number>>;
}) {
    return (
        <NumberInputComponent
            label="Repeat (몇 주 반복)"
            value={count.toString()}
            onChange={v => setCount(parseInt(v))}
            min={1}
        />
    );
}
