import { Button, Card, DataList, Dialog, Stack } from "@chakra-ui/react";
import SimpleDialog from "@scspace-client/Components/atoms/SimpleDialog";
import { Dispatch, SetStateAction } from "react";
import DataListItem from "@scspace-client/Components/atoms/DataListItem";
import { useDate } from "@scspace-client/Hooks/utils";

export interface ISubmitLog {
    timeFrom: number;
    timeTo: number;
    success: boolean;
}

export default function SubmitLog({ submitLog, open, setOpen }: {
    submitLog: ISubmitLog[];
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}) {
    const { getString } = useDate();

    return (
        <SimpleDialog
            open={open}
            setOpen={setOpen}
        >
            <Dialog.Header>
                <Dialog.Title>
                    Submit Log
                </Dialog.Title>
                <Dialog.Description>
                    The log of the reservation submission.
                </Dialog.Description>
            </Dialog.Header>
            <Dialog.Body>
                <Stack>
                    {submitLog.map((log, index) => (
                        <Card.Root
                            key={index}
                            borderColor={log.success ? "green" : "red"}
                            borderWidth={2}
                            size="sm"
                        >
                            <Card.Header>
                                <Card.Title>
                                    {log.success ? "Success" : "Fail"}
                                </Card.Title>
                            </Card.Header>
                            <Card.Body>
                                <DataList.Root orientation={"horizontal"}>
                                    <DataListItem label="start time">
                                        {getString(log.timeFrom)}
                                    </DataListItem>
                                    <DataListItem label="end time">
                                        {getString(log.timeTo)}
                                    </DataListItem>
                                </DataList.Root>
                            </Card.Body>
                            {!log.success && (
                                <Card.Footer>
                                    <Card.Description>
                                        시간이 겹치는지 확인하세요.
                                    </Card.Description>
                                </Card.Footer>
                            )}
                        </Card.Root>
                    ))}
                </Stack>
            </Dialog.Body>
            <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                    <Button variant={"outline"}>
                        Close
                    </Button>
                </Dialog.ActionTrigger>
            </Dialog.Footer>
        </SimpleDialog>
    );
}