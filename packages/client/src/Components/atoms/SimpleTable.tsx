"use client";

import { Table, useBreakpointValue } from "@chakra-ui/react";
import { ReactNode } from "react";

export interface TableContent {
    id: number;
    row: [ReactNode, ReactNode, ReactNode, ReactNode];
}

interface SimpleTableProps {
    header: [ReactNode, ReactNode, ReactNode, ReactNode];
    content: TableContent[];
    onIdChange?: (id: number) => any;
}

export default function SimpleTable({ onIdChange, header, content }: SimpleTableProps) {
    const isWide = useBreakpointValue({ base: false, md: true });

    return (
        <Table.ScrollArea w="100%" h="100%" maxW="100%" maxH="100%">
            <Table.Root
                stickyHeader
                interactive
                colorPalette="cyan"
                maxW="inherit"
                tableLayout="fixed" // 테이블 레이아웃을 고정으로 설정
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
                <Table.Header>
                    <Table.Row bg="bg.muted">
                        <Table.ColumnHeader truncate>
                            {header[0]}
                        </Table.ColumnHeader>
                        <Table.ColumnHeader truncate>
                            {header[1]}
                        </Table.ColumnHeader>
                        {isWide && (
                            <>
                                <Table.ColumnHeader truncate>
                                    {header[2]}
                                </Table.ColumnHeader>
                                <Table.ColumnHeader truncate>
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
                            onClick={onIdChange && (() => onIdChange(c.id))}
                            cursor="pointer"
                        >
                            <Table.Cell truncate>
                                {c.row[0]}
                            </Table.Cell>
                            <Table.Cell truncate>
                                {c.row[1]}
                            </Table.Cell>
                            {isWide && (
                                <>
                                    <Table.Cell truncate>
                                        {c.row[2]}
                                    </Table.Cell>
                                    <Table.Cell truncate>
                                        {c.row[3]}
                                    </Table.Cell>
                                </>
                            )}
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>
        </Table.ScrollArea>
    );
}
