"use client";

import { Table, useBreakpointValue } from "@chakra-ui/react";

export interface TableContent {
    id: number;
    row: [string, string, string, string];
}

interface SimpleTableProps {
    header: [string, string, string, string];
    content: TableContent[];
    onIdChange: (id: number) => any;
}

export default function SimpleTable({ onIdChange, header, content }: SimpleTableProps) {
    const isWide = useBreakpointValue({ base: false, md: true });

    return (
        <Table.Root
            stickyHeader
            interactive
            colorPalette="blue"
        >
            <Table.ColumnGroup>
                <Table.Column htmlWidth={isWide ? "25%" : "50%"} />
                <Table.Column htmlWidth={isWide ? "25%" : "50%"} />
                {isWide && (
                    <>
                        <Table.Column htmlWidth="25%" />
                        <Table.Column htmlWidth="25%" />
                    </>
                )}
            </Table.ColumnGroup>
            <Table.Header >
                <Table.Row bg="bg.muted">
                    <Table.ColumnHeader>
                        {header[0]}
                    </Table.ColumnHeader>
                    <Table.ColumnHeader>
                        {header[1]}
                    </Table.ColumnHeader>
                    {isWide && (
                        <>
                            <Table.ColumnHeader>
                                {header[2]}
                            </Table.ColumnHeader>
                            <Table.ColumnHeader>
                                {header[3]}
                            </Table.ColumnHeader>
                        </>
                    )}
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {content.map((c) => (
                    <Table.Row
                        key={c.id}
                        onClick={() => onIdChange(c.id)}
                        cursor="pointer"
                    >
                        <Table.Cell>
                            {c.row[0]}
                        </Table.Cell>
                        <Table.Cell>
                            {c.row[1]}
                        </Table.Cell>
                        {isWide && (
                            <>
                                <Table.Cell>
                                    {c.row[2]}
                                </Table.Cell>
                                <Table.Cell>
                                    {c.row[3]}
                                </Table.Cell>
                            </>
                        )}
                    </Table.Row>
                ))}
            </Table.Body>
        </Table.Root >
    );
}