"use client"

import { Button, Text } from "@chakra-ui/react";
import AlertBtn from "@scspace-client/Components/atoms/AlertBtn";
import { toaster } from "@scspace-client/Components/atoms/Toaster";
import { useRentalAPI } from "@scspace-client/Hooks/rental";
import { useState } from "react";

export default function ReturnBtn({ id, refetch }: {
    id: number;
    refetch: () => void;
}) {
    const returnRental = useRentalAPI().returnRental;
    const [e, setE] = useState<string>('');

    const handleReturn = () => {
        toaster.promise(
            returnRental({ id }, {
                onError: (error) => {
                    setE(error.message);
                },
                onSuccess: () => {
                    refetch();
                }
            }),
            {
                loading: {
                    title: "Processing return...",
                    description: "Please wait",
                },
                success: {
                    title: "Return successful",
                    description: "The rental has been returned successfully.",
                },
                error: {
                    title: "Return failed",
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
            dialogTitle="Would you like to request a return?"
            dialogBody={
                <>
                    <Text>
                        Are you sure you want to return this rental?
                    </Text>
                    <Text fontWeight={"semibold"} color={"blue"}>
                        Please return the item to SCSpace and then press this button.
                    </Text>
                </>
            }
        >
            <Button colorPalette={"blue"} variant={"outline"}>
                Request Return
            </Button>
        </AlertBtn>
    );
}