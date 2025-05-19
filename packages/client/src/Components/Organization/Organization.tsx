"use client"

import {
    Table,
    IconButton,
} from "@chakra-ui/react";
import { useState } from "react";
import Scroll from "../_commons/Scroll";
import { useLoginCheck } from "@scspace-client/APIs/auth/useLoginCheck";
import { IOrganization } from "@scspace-depot/types/organization";

export default function Organization() {
    const loginCheck = useLoginCheck();

    const [orgs, setOrgs] = useState<IOrganization[]>([
        {
            id: 0,
            name: "temp",
            delegatorId: 0,
            timeRegister: 'r time',
            timeUpdate: 'u time'
        }
    ])

    return (
        <Scroll>
            <Table.Root
                stickyHeader
                interactive
                colorPalette="blue"
            >
                <Table.Header >
                    <Table.Row bg="bg.muted">
                        <Table.ColumnHeader>
                            Name
                        </Table.ColumnHeader>
                        <Table.ColumnHeader>
                            Delegator
                        </Table.ColumnHeader>
                        <Table.ColumnHeader>
                            Create Time
                        </Table.ColumnHeader>
                        <Table.ColumnHeader>
                            Update Time
                        </Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="end">
                            Show Detail
                        </Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {orgs.map((org) => (
                        <Table.Row key={org.id}>
                            <Table.Cell>
                                {org.name}
                            </Table.Cell>
                            <Table.Cell>
                                {org.delegatorId}
                            </Table.Cell>
                            <Table.Cell>
                                {org.timeRegister}
                            </Table.Cell>
                            <Table.Cell>
                                {org.timeUpdate}
                            </Table.Cell>
                            <Table.Cell textAlign="end">
                                Button
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>
        </Scroll>
    );
}