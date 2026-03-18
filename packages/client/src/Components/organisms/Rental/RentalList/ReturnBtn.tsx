"use client"

import { Button, Text } from "@chakra-ui/react";
import AlertBtn from "@scspace-client/Components/atoms/AlertBtn";
import { toaster } from "@scspace-client/Components/atoms/Toaster";
import { getErrorMessage } from "@scspace-client/Hooks/error";
import { useRentalAPI } from "@scspace-client/Hooks/rental";

export default function ReturnBtn({ disabled, id, refetch }: {
    disabled: boolean;
    id: number;
    refetch: () => void;
}) {
    const returnRental = useRentalAPI({ id }).returnRental;

    const handleReturn = async () => {
        try {
            await returnRental({});
            refetch();
            toaster.success({
                title: "Return successful",
                description: "The rental has been returned successfully.",
            });
        } catch (error) {
            toaster.error({
                title: "Return failed",
                description: getErrorMessage(error, "Please try again"),
            });
        }
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
            <Button
                colorPalette={"blue"}
                variant={"outline"}
                disabled={disabled}
            >
                {disabled ? "Already Returned" : "Request Return"}
            </Button>
        </AlertBtn>
    );
}
