import { DataList } from "@chakra-ui/react";
import DataListItem from "@scspace-client/Components/atoms/DataListItem";
import FieldComponent from "@scspace-client/Components/atoms/Field";
import Scroll from "@scspace-client/Components/pages/Layout/Scroll";
import BorderBox from "@scspace-client/Components/atoms/BorderBox";

export default function Atoms() {
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