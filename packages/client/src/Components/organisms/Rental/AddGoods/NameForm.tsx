import InputComponent from "@scspace-client/Components/molecules/forms/Input";
import { Dispatch, SetStateAction } from "react";

export function GoodsNameForm({ name, setName }: {
    name: string;
    setName: Dispatch<SetStateAction<string>>;
}) {
    return (
        <InputComponent
            label="Name"
            placeholder="Enter Name"
            value={name}
            onChange={setName}
            required={true}
        />
    );
}
