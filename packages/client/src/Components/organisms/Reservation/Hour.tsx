"use client"

import SelectComponent, { ISelectOption } from "@scspace-client/Components/molecules/forms/Select";
import { Dispatch, SetStateAction } from "react";

export function HourForm({ label, setHour }: {
    label: string;
    setHour: Dispatch<SetStateAction<number>>;
}) {
    const options = Array.from({ length: 24 }).map((_, i): ISelectOption => {
        return {
            label: i.toString().padStart(2, '0') + ":00",
            value: i.toString()
        }
    })

    return (
        <SelectComponent
            label={label}
            optionList={options}
            onChange={(v) => setHour(parseInt(v.value))}
        />
    );
}
