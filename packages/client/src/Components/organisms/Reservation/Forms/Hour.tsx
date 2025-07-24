"use client"

import SelectComponent, { ISelectOption } from "@scspace-client/Components/molecules/forms/Select";

export function HourForm({ label, setHour, hour, inDialog }: {
    inDialog?: boolean;
    label: string;
    hour?: number;
    setHour: (hour: number) => void;
}) {
    const options = Array.from({ length: 24 }).map((_, i): ISelectOption => {
        return {
            label: i.toString().padStart(2, '0') + ":00",
            value: i.toString()
        }
    })

    return (
        <SelectComponent
            inDialog={inDialog}
            label={label}
            optionList={options}
            defaultValue={hour?.toString() ?? "0"}
            onChange={(v) => setHour(parseInt(v.value))}
        />
    );
}
