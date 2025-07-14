"use client"

import {
    Flex,
    Text,
    Grid,
    Dialog,
    Portal,
    IconButton,
    HStack,
    useBreakpointValue
} from "@chakra-ui/react";
import { useState, } from "react";
import Scroll from "../../Layout/Scroll";
import { useAuth } from "@scspace-client/Hooks/auth";
import { useOrganization, } from "@scspace-client/Hooks/organization";
import { IOrganizationDelegator, } from "@scspace-depot/types/organization";
import LoadingComponent from "../../../atoms/Loading";
import { HiOutlineRefresh } from "react-icons/hi";

import OrganizationDetail from "../../../organisms/Organization/OrganizationDetail";
import NewOrganizationBtn from "../../../organisms/Organization/NewOrganizationBtn";
import { useDate } from "@scspace-client/Hooks/utils";
import TooltipComponent from "../../../atoms/Tooptip";
import SimpleTable from "@scspace-client/Components/atoms/SimpleTable";

export default function Organization() {
    const { userInfo, needLogin } = useAuth();
    needLogin();

    const [selected, setSelected] = useState<number>(-1);

    const { organization, refetch } = useOrganization({ uid: userInfo?.id });

    const [open, setOpen] = useState<boolean>(false);

    const { getString } = useDate();

    const isWide = useBreakpointValue({ base: false, md: true });

    return (
        <Scroll>
            {organization ? (
                <Dialog.Root
                    open={open}
                    onOpenChange={(e) => setOpen(e.open)}
                    size={isWide ? "cover" : "full"}
                    scrollBehavior="inside"
                >
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
                                    Click each row to see detail of organization
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
                                <TooltipComponent content="Make New Organization">
                                    <NewOrganizationBtn
                                        uid={userInfo?.id ?? 0}
                                        onSuccess={refetch}
                                    />
                                </TooltipComponent>
                            </HStack>
                        </Flex>
                        <Scroll>
                            <SimpleTable
                                onIdChange={(id: number) => {
                                    setSelected(id);
                                    setOpen(true);
                                }}
                                header={[
                                    "Name",
                                    "Delegator",
                                    "Create Time",
                                    "Update Time"
                                ]}
                                content={organization.map((org: IOrganizationDelegator) => ({
                                    id: org.id,
                                    row: [
                                        org.name,
                                        org.delegator.nameKr,
                                        getString(org.timeRegister),
                                        getString(org.timeUpdate)
                                    ]
                                }))}
                            />
                        </Scroll>
                    </Grid>
                    <Portal>
                        <Dialog.Backdrop />
                        <Dialog.Positioner>
                            <Dialog.Content className={isWide ? "" : "full"}>
                                <OrganizationDetail
                                    id={selected}
                                    onDelete={() => {
                                        refetch();
                                        setOpen(false);
                                    }}
                                />
                            </Dialog.Content>
                        </Dialog.Positioner>
                    </Portal>
                </Dialog.Root>
            ) : (
                <LoadingComponent />
            )}
        </Scroll >
    );
}