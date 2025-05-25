"use client";

import { CloseButton, Dialog, HStack, SegmentGroup, StackSeparator } from "@chakra-ui/react";
import { useState } from "react";
import { ENG } from "./Eng";

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
            </Dialog.Header>
            <Dialog.Body>
                {(lng === "Kor") ? (
                    "개인정보처리방침 / 영문 버젼 참고 바람"
                ) : (
                    <ENG />
                )}
            </Dialog.Body>
            <Dialog.Footer>
                <Dialog.Title>
                    {(lng === "Kor") ? (
                        "KAIST 학생문화공간위원회"
                    ) : (
                        "KAIST Student Culture & Space Committee"
                    )}
                </Dialog.Title>
            </Dialog.Footer>
            <Dialog.CloseTrigger>
                <CloseButton />
            </Dialog.CloseTrigger>
        </Dialog.Content>
    );
}