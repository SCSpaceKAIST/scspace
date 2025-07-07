import { Box } from "@chakra-ui/react";
import React from "react"

export default function BorderBox({ children, ...props }: {
    children: React.ReactNode | string;
}) {
    return (
        <Box py={1} px={2} rounded="sm" borderWidth={1} maxWidth="full" width="300px" {...props}>
            {children}
        </Box>
    )
}