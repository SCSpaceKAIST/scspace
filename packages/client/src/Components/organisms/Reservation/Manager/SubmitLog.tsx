"use client";

import { Button, Card, DataList, Dialog, DownloadTrigger, Stack } from "@chakra-ui/react";
import SimpleDialog from "@scspace-client/Components/atoms/SimpleDialog";
import { Dispatch, SetStateAction } from "react";
import DataListItem from "@scspace-client/Components/atoms/DataListItem";
import { useDate } from "@scspace-client/Hooks/utils";
import { IReservationMultipleCreateResurt } from "@scspace-depot/types/reservation";

export default function SubmitLog({ submitLog, open, setOpen }: {
    submitLog: IReservationMultipleCreateResurt;
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}) {
    const { getString } = useDate();

    const downloadData = {
        title: submitLog.title,
        result: submitLog.result.map(log => ({
            from: getString(log.timeFrom),
            to: getString(log.timeTo),
            success: log.success,
        })),
        post_time: getString(submitLog.timePost),
    }

    function logGenerator() {
        return "Title: " + submitLog.title + "\n" +
            "Post Time: " + getString(submitLog.timePost) + "\n" +
            "Results:\n" +
            submitLog.result.map(log => {
                return `- From: ${getString(log.timeFrom)}, To: ${getString(log.timeTo)}, Success: ${log.success}`;
            }).join("\n");
    }

    return (
        <SimpleDialog
            open={open}
            setOpen={setOpen}
        >
            <Dialog.Header>
                <Dialog.Title>
                    {`${submitLog.title} 예약 제출 로그 (${getString(submitLog.timePost)})`}
                </Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
                <Stack>
                    {submitLog.result.map((log, index) => (
                        <Card.Root
                            key={index}
                            borderColor={log.success ? "bg.emphasized" : "red"}
                            borderWidth={log.success ? 1 : 2}
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
                <DownloadTrigger
                    data={logGenerator()}
                    fileName={`reservation_log_${downloadData.title}_${downloadData.post_time}.txt`}
                    asChild
                    mimeType="text/plain"
                >
                    <Button variant={"outline"}>
                        Download Log
                    </Button>
                </DownloadTrigger>
                <Dialog.ActionTrigger asChild>
                    <Button variant={"outline"}>
                        Close
                    </Button>
                </Dialog.ActionTrigger>
            </Dialog.Footer>
        </SimpleDialog>
    );
}