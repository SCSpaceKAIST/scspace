"use client";

import { Button, CloseButton, Dialog, HStack, SegmentGroup, StackSeparator, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { ENG } from "./Eng";

export default function PrivacyPolicy({ onRead }: { onRead: () => void }) {
    const [lng, setLng] = useState<string>("Eng");

    return (
        <Dialog.Content>
            <Dialog.Header gap={4}>
                <SegmentGroup.Root value={lng} onValueChange={(e) => setLng(e.value ?? "Eng")} size="sm">
                    <SegmentGroup.Indicator />
                    <SegmentGroup.Items items={["Eng", "Kor"]} />
                </SegmentGroup.Root>
            </Dialog.Header>
            <Dialog.Body>
                <VStack>
                    {(lng === "Kor") ? (
                        "개인정보처리방침 / 영문 버젼 참고 바람"
                    ) : (
                        <ENG />
                    )}
                    <Dialog.ActionTrigger asChild>
                        <Button colorPalette="blue" onClick={onRead}>
                            Accept
                        </Button>
                    </Dialog.ActionTrigger>
                </VStack>
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