"use client";

import { Badge, Button, HStack, Switch } from "@chakra-ui/react";
import { toaster } from "@scspace-client/Components/atoms/Toaster";
import { useOrganizationAPI } from "@scspace-client/Hooks/organization";
import { HiCheck, HiX } from "react-icons/hi";

export default function HasRoom({ hasRoom, refetch, oid, disabled }: {
    refetch: () => void;
    hasRoom: boolean;
    oid: number;
    disabled?: boolean;
}) {
    const { updateOrg } = useOrganizationAPI({ id: oid });

    return (
        <HStack>
            <Switch.Root colorPalette="blue" checked={hasRoom} disabled={disabled}
                onCheckedChange={(e) => {
                    updateOrg({
                        hasRoom: e.checked,
                    }, {
                        onSuccess: () => {
                            toaster.success({
                                title: "Organization Updated",
                                description: "Room status updated successfully.",
                            });
                            refetch();
                        },
                    });
                }}
            >
                <Switch.HiddenInput />
                <Switch.Control>
                    <Switch.Thumb>
                        <Switch.ThumbIndicator fallback={<HiX color="black" />}>
                            <HiCheck />
                        </Switch.ThumbIndicator>
                    </Switch.Thumb>
                </Switch.Control>
            </Switch.Root>
            <Badge colorPalette={hasRoom ? "blue" : "red"}>
                {hasRoom ? "Yes" : "No"}
            </Badge>
        </HStack>
    )
}