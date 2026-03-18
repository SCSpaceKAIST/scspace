"use client"

import { Button, Checkbox, Dialog, Portal, Stack, Text } from "@chakra-ui/react";
import { toaster } from "@scspace-client/Components/atoms/Toaster";
import { getErrorMessage } from "@scspace-client/Hooks/error";
import { useRentalAPI } from "@scspace-client/Hooks/rental";
import { useMemo, useState } from "react";

const checklistItems = [
    { key: "condition", label: "물품 상태를 확인했습니다." },
    { key: "clean", label: "물품이 깨끗하게 반납되었습니다." },
    { key: "complete", label: "구성품이 모두 반납되었습니다." },
    { key: "count", label: "수량이 신청 내역과 일치합니다." },
] as const;

type ChecklistKey = (typeof checklistItems)[number]["key"];

export default function ConfirmBtn({ disabled, id, refetchAction }: {
    disabled: boolean;
    id: number;
    refetchAction: () => void;
}) {
    const confirmReturn = useRentalAPI({ id }).confirmReturn;
    const [open, setOpen] = useState(false);
    const [checkedState, setCheckedState] = useState<Record<ChecklistKey, boolean>>({
        condition: false,
        clean: false,
        complete: false,
        count: false,
    });

    const allChecked = useMemo(
        () => Object.values(checkedState).every(Boolean),
        [checkedState]
    );

    const resetState = () => {
        setCheckedState({
            condition: false,
            clean: false,
            complete: false,
            count: false,
        });
    };

    const handleConfirm = async () => {
        if (!allChecked) {
            toaster.error({
                title: "체크리스트를 모두 확인해주세요",
                description: "모든 반납 점검 항목을 체크해야 반납 확인이 가능합니다.",
            });
            return;
        }

        try {
            await confirmReturn({});
            refetchAction();
            resetState();
            setOpen(false);
            toaster.success({
                title: "반납 확인 완료",
                description: "체크리스트 확인 후 반납이 정상 처리되었습니다.",
            });
        } catch (error) {
            toaster.error({
                title: "반납 확인 실패",
                description: getErrorMessage(error),
            });
        }
    };

    return (
        <Dialog.Root
            open={open}
            onOpenChange={(event) => {
                setOpen(event.open);
                if (!event.open) resetState();
            }}
            placement="center"
        >
            <Dialog.Trigger asChild>
                <Button
                    colorPalette="green"
                    variant="outline"
                    disabled={disabled}
                >
                    {disabled ? "Already Confirmed" : "Confirm Return"}
                </Button>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop zIndex={1500} />
                <Dialog.Positioner zIndex={1600}>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>반납 체크리스트 확인</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            <Stack gap={4}>
                                <Text>
                                    실제 물품을 확인한 뒤 모든 항목을 체크하고 반납을 확정해주세요.
                                </Text>
                                <Stack gap={3}>
                                    {checklistItems.map((item) => (
                                        <Checkbox.Root
                                            key={item.key}
                                            checked={checkedState[item.key]}
                                            onCheckedChange={(event) => {
                                                setCheckedState((current) => ({
                                                    ...current,
                                                    [item.key]: event.checked === true,
                                                }));
                                            }}
                                        >
                                            <Checkbox.HiddenInput />
                                            <Checkbox.Control />
                                            <Checkbox.Label>{item.label}</Checkbox.Label>
                                        </Checkbox.Root>
                                    ))}
                                </Stack>
                            </Stack>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Dialog.ActionTrigger asChild>
                                <Button variant="outline" rounded="sm">
                                    취소
                                </Button>
                            </Dialog.ActionTrigger>
                            <Button
                                colorPalette="green"
                                rounded="sm"
                                onClick={handleConfirm}
                                disabled={!allChecked}
                            >
                                반납 확인
                            </Button>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}
