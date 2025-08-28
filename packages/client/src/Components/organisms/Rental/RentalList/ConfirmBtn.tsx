"use client"

import { Button, Text } from "@chakra-ui/react";
import AlertBtn from "@scspace-client/Components/atoms/AlertBtn";
import { toaster } from "@scspace-client/Components/atoms/Toaster";
import { useRentalAPI } from "@scspace-client/Hooks/rental";
import { useState } from "react";

export default function ConfirmBtn({ disabled, id, refetch }: {
    disabled: boolean;
    id: number;
    refetch: () => void;
}) {
    const confirmReturn = useRentalAPI({ id }).confirmReturn;
    const [e, setE] = useState<string>('');

    const handleReturn = () => {
        toaster.promise(
            confirmReturn({}, {
                onError: (error) => {
                    setE(error.message);
                },
                onSuccess: () => {
                    refetch();
                }
            }),
            {
                loading: {
                    title: "Processing confirm...",
                    description: "Please wait",
                },
                success: {
                    title: "Confirm successful",
                    description: "The rental has been confirmed successfully.",
                },
                error: {
                    title: "Confirm failed",
                    description: e || "Please try again",
                },
            }
        )
    }

    return (
        <AlertBtn
            onClick={handleReturn}
            colorPalette="blue"
            buttonText="Return"
            dialogTitle="반납 확인하시겠습니까?"
            dialogBody={
                <>
                    <Text>
                        실제 물품 반납을 확인한 뒤에 버튼을 누르시길 바랍니다.
                    </Text>
                    <Text fontWeight={"semibold"} color={"red"}>
                        이 작업은 되돌릴 수 없습니다.
                    </Text>
                </>
            }
        >
            <Button
                colorPalette={"green"}
                variant={"outline"}
                disabled={disabled}
            >
                {disabled ? "Already Confirmed" : "Confirm Return"}
            </Button>
        </AlertBtn>
    );
}