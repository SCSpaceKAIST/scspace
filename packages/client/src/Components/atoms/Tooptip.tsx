import React from "react";
import { Tooltip, Portal } from "@chakra-ui/react";

export default function TooltipComponent({
    children,
    content,
}: {
    children: React.ReactNode;
    content: string | React.ReactNode;
}) {
    return (
        <Tooltip.Root>
            <Tooltip.Trigger asChild>
                {children}
            </Tooltip.Trigger>
            <Portal>
                <Tooltip.Positioner>
                    <Tooltip.Content>
                        {content}
                    </Tooltip.Content>
                </Tooltip.Positioner>
            </Portal>
        </Tooltip.Root>
    )
}