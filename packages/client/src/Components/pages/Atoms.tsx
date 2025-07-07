"use client"

import { DataList } from "@chakra-ui/react";
import DeleteBtn from "@scspace-client/Components/molecules/buttons/DeleteBtn";
import LoginBtn from "@scspace-client/Components/molecules/buttons/LoginBtn";
import CheckComponent from "@scspace-client/Components/molecules/forms/Checkbox";
import DataListItem from "@scspace-client/Components/atoms/DataListItem";
import FieldComponent from "@scspace-client/Components/atoms/Field";
import Scroll from "@scspace-client/Components/templates/Scroll";
import InputComponent from "@scspace-client/Components/molecules/forms/Input";
import { useState } from "react";
import NumberInputComponent from "@scspace-client/Components/molecules/forms/NumberInput";
import BorderBox from "@scspace-client/Components/atoms/BorderBox";
import SelectComponent from "@scspace-client/Components/molecules/forms/Select";
import TextareaComponent from "@scspace-client/Components/molecules/forms/Textarea";

export default function Atoms() {
    const [inputValue, setInputValue] = useState<string>("");
    const [textareaValue, setTextareaValue] = useState<string>("");
    const [numberInputValue, setNumberInputValue] = useState<string>("");

    return (
        <Scroll>
            <DataList.Root orientation="horizontal">
                <DataListItem label="Border Box">
                    <BorderBox>
                        Border Box
                    </BorderBox>
                </DataListItem>
                <DataListItem label="DataList Item">
                    <BorderBox>
                        <DataList.Root>
                            <DataListItem label="DataList Label">
                                <BorderBox>
                                    DataList Value
                                </BorderBox>
                            </DataListItem>
                        </DataList.Root>
                    </BorderBox>
                </DataListItem>
                <DataListItem label="Field">
                    <BorderBox>
                        <FieldComponent
                            options={{
                                label: "Field Label"
                            }}
                        >
                            <BorderBox>
                                {"Field Children"}
                            </BorderBox>
                        </FieldComponent>
                    </BorderBox>
                </DataListItem>
            </DataList.Root>
        </Scroll>
    );
}