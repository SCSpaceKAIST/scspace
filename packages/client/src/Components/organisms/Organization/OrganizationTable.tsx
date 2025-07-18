"use client"

import {
    Flex,
    Text,
    Grid,
    IconButton,
    HStack,
    useBreakpointValue
} from "@chakra-ui/react";
import { useState, } from "react";
import { IOrganizationDelegator, } from "@scspace-depot/types/organization";
import { HiOutlineRefresh } from "react-icons/hi";

import { useDate } from "@scspace-client/Hooks/utils";
import SimpleTable from "@scspace-client/Components/atoms/SimpleTable";
import Scroll from "@scspace-client/Components/pages/Layout/Scroll";
import TooltipComponent from "@scspace-client/Components/atoms/Tooptip";
import OrganizationDialog from "@scspace-client/Components/organisms/Organization/OrganizationDetail";
import OrganizationName from "./OrganizationName";
import NewOrganizationBtn from "./NewOrganizationBtn";

export default function OrganizationTable({ uid, disabled, organization, refetch, helperText }: {
    helperText?: string;
    disabled?: boolean;
    uid?: number;
    organization: IOrganizationDelegator[];
    refetch: () => void;
}) {
    const [selected, setSelected] = useState<number>(-1);

    const [open, setOpen] = useState<boolean>(false);

    const { getString } = useDate();

    const isWide = useBreakpointValue({ base: false, md: true });

    return (
        <>
            <Grid
                height="100%"
                templateRows="auto 1fr"
                gap={2}
            >
                <Flex
                    width="100%"
                    justify={isWide ? "space-between" : "end"}
                    alignItems="end"
                >
                    {isWide && (
                        <Text margin={0} color="gray.focusRing">
                            {helperText ? (
                                helperText
                            ) : (
                                "Click each row to see detail of organization"
                            )}
                        </Text>
                    )}
                    <HStack>
                        <TooltipComponent content="Refresh">
                            <IconButton
                                rounded="sm"
                                variant="ghost"
                                onClick={() => refetch()}
                            >
                                <HiOutlineRefresh color="gray" />
                            </IconButton>
                        </TooltipComponent>
                        {uid && (
                            <NewOrganizationBtn
                                uid={uid}
                                onSuccess={() => refetch()}
                            />
                        )}
                    </HStack>
                </Flex>
                <Scroll>
                    <SimpleTable
                        onIdChange={!disabled ? (
                            (id: number) => {
                                setSelected(id);
                                setOpen(true);
                            }
                        ) : (undefined)}
                        header={[
                            "Name",
                            "Delegator",
                            "Contact",
                            "Update Time"
                        ]}
                        content={organization.map((org: IOrganizationDelegator) => ({
                            id: org.id,
                            row: [
                                (
                                    <OrganizationName key={org.id} status={org.status}>
                                        {org.name}
                                    </OrganizationName>
                                ),
                                org.delegator.nameKr,
                                org.delegator.email,
                                getString(org.timeUpdate)
                            ]
                        }))}
                    />
                </Scroll>
            </Grid>
            <OrganizationDialog
                open={open}
                setOpen={setOpen}
                id={selected}
                onChange={() => refetch()}
            />
        </>
    );
}