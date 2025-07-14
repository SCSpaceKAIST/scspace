"use client";

import { Button, Center, DataList, Dialog } from "@chakra-ui/react";
import DataListItem from "@scspace-client/Components/atoms/DataListItem";
import FieldComponent from "@scspace-client/Components/atoms/Field";
import Scroll from "@scspace-client/Components/pages/Layout/Scroll";
import BorderBox from "@scspace-client/Components/atoms/BorderBox";
import LoadingComponent, { SmallLoading } from "@scspace-client/Components/atoms/Loading";
import { useState } from "react";
import SimpleDialog from "@scspace-client/Components/atoms/SimpleDialog";
import { toaster } from "@scspace-client/Components/atoms/Toaster";
import TooltipComponent from "@scspace-client/Components/atoms/Tooptip";
import SimpleTable from "@scspace-client/Components/atoms/SimpleTable";

export default function Atoms() {
    const [dialogOpen, setDialogOpen] = useState(false);
    return (
        <>
            <SimpleDialog open={dialogOpen} setOpen={setDialogOpen}>
                <Dialog.Header>
                    <Center fontSize={"xl"}>
                        Dialog Header
                    </Center>
                </Dialog.Header>
                <Dialog.Body>
                    <Center h="100%" fontSize={"lg"}>
                        Dialog Body
                    </Center>
                </Dialog.Body>
                <Dialog.Footer>
                    <Center fontSize={"md"}>
                        Dialog Footer
                    </Center>
                    <Dialog.ActionTrigger>
                        <Button>
                            Close Dialog
                        </Button>
                    </Dialog.ActionTrigger>
                </Dialog.Footer>
            </SimpleDialog>
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
                    <DataListItem label="Loading">
                        <BorderBox>
                            <LoadingComponent />
                        </BorderBox>
                    </DataListItem>
                    <DataListItem label="Small Loading">
                        <BorderBox>
                            <SmallLoading />
                        </BorderBox>
                    </DataListItem>
                    <DataListItem label="Dialog">
                        <Button onClick={() => setDialogOpen(true)}>
                            Open Dialog
                        </Button>
                    </DataListItem>
                    <DataListItem label="Toaster">
                        <Button onClick={() => toaster.create({
                            title: "Toaster Title",
                            description: "This is a toaster message.",
                        })}>
                            Create Toaster
                        </Button>
                    </DataListItem>
                    <DataListItem label="Tooltip">
                        <TooltipComponent content="This is a tooltip example">
                            <BorderBox>
                                <Center>
                                    Hover over me for tooltip
                                </Center>
                            </BorderBox>
                        </TooltipComponent>
                    </DataListItem>
                    <DataListItem label="Table">
                        <SimpleTable
                            onIdChange={(id: number) => {
                                alert(`Selected ID: ${id}`);
                            }}
                            header={[
                                "Column 1",
                                "Column 2",
                                "Column 3",
                                "Column 4"
                            ]}
                            content={[
                                {
                                    id: 1,
                                    row: [
                                        "Row 1 Col 1",
                                        "Row 1 Col 2",
                                        "Row 1 Col 3",
                                        "Row 1 Col 4"
                                    ]
                                },
                                {
                                    id: 2,
                                    row: [
                                        "Row 2 Col 1",
                                        "Row 2 Col 2",
                                        "Row 2 Col 3",
                                        "Row 2 Col 4"
                                    ]
                                },
                                {
                                    id: 3,
                                    row: [
                                        "Row 3 Col 1",
                                        "Row 3 Col 2",
                                        "Row 3 Col 3",
                                        "Row 3 Col 4"
                                    ]
                                }
                            ]}
                        />
                    </DataListItem>
                </DataList.Root>
            </Scroll>
        </>
    );
}