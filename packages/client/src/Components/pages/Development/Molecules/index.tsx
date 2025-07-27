"use client"

import { DataList } from "@chakra-ui/react";
import DeleteBtn from "@scspace-client/Components/molecules/buttons/DeleteBtn";
import CheckComponent from "@scspace-client/Components/molecules/forms/Checkbox";
import DataListItem from "@scspace-client/Components/atoms/DataListItem";
import Scroll from "@scspace-client/Components/molecules/page/Scroll";
import InputComponent from "@scspace-client/Components/molecules/forms/Input";
import { useState } from "react";
import NumberInputComponent from "@scspace-client/Components/molecules/forms/NumberInput";
import BorderBox from "@scspace-client/Components/atoms/BorderBox";
import SelectComponent from "@scspace-client/Components/molecules/forms/Select";
import TextareaComponent from "@scspace-client/Components/molecules/forms/Textarea";
import { Registered, RegistrationRequested, Rejected, VerificationRequested, Verified } from "@scspace-client/Components/molecules/veritication/VerifiedMark";
import UpdateBtn from "@scspace-client/Components/molecules/buttons/UpdateBtn";

export default function Molecules() {
    const [inputValue, setInputValue] = useState<string>("");
    const [textareaValue, setTextareaValue] = useState<string>("");
    const [numberInputValue, setNumberInputValue] = useState<string>("");

    return (
        <Scroll>
            <DataList.Root orientation="horizontal">
                <DataListItem label="Buttons">
                    <DataList.Root>
                        <DataListItem label="Delete Button">
                            <DeleteBtn onDelete={() => alert("Delete")} />
                        </DataListItem>
                        <DataListItem label="Update Button">
                            <UpdateBtn
                                onUpdate={() => alert("Update")}
                                title="Update Item"
                                tooltipContent="I'm a tooltip for the update button"
                            >
                                Update Dialog
                            </UpdateBtn>
                        </DataListItem>
                    </DataList.Root>
                </DataListItem>
                <DataListItem label="Forms">
                    <DataList.Root>
                        <DataListItem label="Check Box">
                            <BorderBox>
                                <CheckComponent
                                    label="Check Box Label"
                                />
                            </BorderBox>
                        </DataListItem>
                        <DataListItem label="Input">
                            <BorderBox>
                                <InputComponent
                                    label="Input Label"
                                    value={inputValue}
                                    onChange={setInputValue}
                                    helpertext={inputValue && `value: ${inputValue}`}
                                />
                            </BorderBox>
                        </DataListItem>
                        <DataListItem label="Number Input">
                            <BorderBox>
                                <NumberInputComponent
                                    label="Number Input Label"
                                    value={numberInputValue}
                                    onChange={setNumberInputValue}
                                    helpertext={numberInputValue && `value: ${numberInputValue}`}
                                />
                            </BorderBox>
                        </DataListItem>
                        <DataListItem label="Select">
                            <BorderBox>
                                <SelectComponent
                                    label="Select Label"
                                    optionList={[
                                        { label: "option 1", value: "value 1" },
                                        { label: "option 2", value: "value 2", description: "description" }
                                    ]}
                                    onChange={(e) => alert(e.value)}
                                />
                            </BorderBox>
                        </DataListItem>
                        <DataListItem label="Textarea">
                            <BorderBox>
                                <TextareaComponent
                                    label="Textarea Label"
                                    value={textareaValue}
                                    onChange={(s) => setTextareaValue(s)}
                                />
                            </BorderBox>
                        </DataListItem>
                    </DataList.Root>
                </DataListItem>
                <DataListItem label="Verification">
                    <DataList.Root>
                        <DataListItem label="Verified">
                            <Verified />
                        </DataListItem>
                        <DataListItem label="Verification Under Review">
                            <VerificationRequested />
                        </DataListItem>
                        <DataListItem label="Registeded">
                            <Registered />
                        </DataListItem>
                        <DataListItem label="Registration Under Review">
                            <RegistrationRequested />
                        </DataListItem>
                        <DataListItem label="Rejected">
                            <Rejected />
                        </DataListItem>
                    </DataList.Root>
                </DataListItem>
            </DataList.Root>
        </Scroll>
    );
}