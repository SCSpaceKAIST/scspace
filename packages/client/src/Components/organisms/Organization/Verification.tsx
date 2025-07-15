"use client"

import { Button, HStack, Text, VStack } from "@chakra-ui/react";
import { useOrganizationAPI } from "@scspace-client/Hooks/organization";

export default function Verification({ oid }: { oid: number }) {
    const { accpetVerification, rejectVerification } = useOrganizationAPI({ id: oid }).status;

    return (
        <VStack>
            <Text fontSize="md" color="fg.muted">
                This organization requested verification.
            </Text>
            <HStack>
                <Button colorPalette="blue" onClick={() => accpetVerification({
                    onSuccess: () => {
                        alert("Verification accepted successfully.");
                    }
                })}>
                    Accept
                </Button>
                <Button colorPalette="red" onClick={() => rejectVerification({
                    onSuccess: () => {
                        alert("Verification rejected successfully.");
                    }
                })}>
                    Reject
                </Button>
            </HStack>
        </VStack>
    );
}