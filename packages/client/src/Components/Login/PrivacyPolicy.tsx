"use client";

import { CloseButton, Dialog, SegmentGroup } from "@chakra-ui/react";
import { useState } from "react";

export default function PrivacyPolicy() {
    const [lng, setLng] = useState<string>("Eng");

    // const 

    return (
        <Dialog.Content>
            <Dialog.Header gap={4}>
                <SegmentGroup.Root value={lng} onValueChange={(e) => setLng(e.value ?? "Eng")} size="sm">
                    <SegmentGroup.Indicator />
                    <SegmentGroup.Items items={["Eng", "Kor"]} />
                </SegmentGroup.Root>
                <Dialog.Title>
                    {(lng === "Eng") ? (
                        "Personal Information Handling Policy"
                    ) : (
                        "개인 정보 처리 방침"
                    )}
                </Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
                Body
            </Dialog.Body>
            <Dialog.CloseTrigger>
                <CloseButton />
            </Dialog.CloseTrigger>
        </Dialog.Content>
    );
}