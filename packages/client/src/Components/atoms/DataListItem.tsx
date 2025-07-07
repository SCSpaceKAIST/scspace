import { DataList } from "@chakra-ui/react";
import React from "react";

export default function DataListItem({ label, children }: {
    label: React.ReactNode | string;
    children: React.ReactNode | string;
}) {
    return (
        <DataList.Item alignItems="start">
            <DataList.ItemLabel>
                {label}
            </DataList.ItemLabel>
            <DataList.ItemValue width="100%">
                {children}
            </DataList.ItemValue>
        </DataList.Item>
    )
}