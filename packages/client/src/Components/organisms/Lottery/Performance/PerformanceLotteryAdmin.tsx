"use client"

import { Center, Grid, GridItem, Stack, Text } from "@chakra-ui/react";
import LoadingComponent, { SmallLoading } from "@scspace-client/Components/atoms/Loading";
import SelectComponent from "@scspace-client/Components/molecules/forms/Select";
import Scroll from "@scspace-client/Components/molecules/page/Scroll";
import PerformanceLotteryNotice from "@scspace-client/Components/organisms/Lottery/Performance/PerformanceLotteryNotice";
import { DateSelector } from "@scspace-client/Components/organisms/Lottery/Performance/PerformanceLotteryDateSelector";
import { useAuth } from "@scspace-client/Hooks/auth";
import { useOrganizationAPI } from "@scspace-client/Hooks/organization";
import { useAllSpace } from "@scspace-client/Hooks/space";
import { SpaceTypeEnum } from "@scspace-depot/enums/space.enum";
import { ISpace } from "@scspace-depot/types/space";
import { useEffect, useState } from "react";

export default function PerformanceLotteryAdmin() {
    const { needAdmin } = useAuth();
    needAdmin();

    const { spaces, isLoading: spaceLoading } = useAllSpace();
    const { data: verifiedOrganizations, isLoading: orgLoading } = useOrganizationAPI().verifiedOrganizations;

    const performanceRoom: ISpace[] = spaces?.filter(space =>
        space.spaceType === SpaceTypeEnum.MIRAE || space.spaceType === SpaceTypeEnum.SUMI
    ) ?? [];
    const [spaceId, setSpaceId] = useState<number>(1);
    const [orgId, setOrgId] = useState<number>(-1);

    useEffect(() => {
        if (!verifiedOrganizations) return;
        if (verifiedOrganizations.length > 0 && orgId === -1) {
            setOrgId(verifiedOrganizations[0].id);
        }
    }, [verifiedOrganizations]);
    useEffect(() => {
        if (performanceRoom.length > 0 && spaceId === 1) {
            setSpaceId(performanceRoom[0].id);
        }
    }, [performanceRoom]);

    return (
        <Scroll>
            {(spaceLoading || orgLoading) ? (
                <LoadingComponent />
            ) : (
                <Stack>
                    <Grid
                        templateColumns="repeat(6, 1fr)"
                        gap={8}
                        py={2}
                    >
                        <GridItem colSpan={6}>
                            <Center>
                                <Text fontSize="xl" fontWeight="semibold" color={"red"}>
                                    이 페이지의 기능을 악용하지 마시길 바랍니다.
                                </Text>
                            </Center>
                        </GridItem>
                        <GridItem colSpan={6}>
                            <PerformanceLotteryNotice />
                        </GridItem>
                        <GridItem colSpan={{ base: 6, md: 3 }}>
                            <SelectComponent
                                label="Mirae or Sumi Hall"
                                optionList={performanceRoom.map(room => ({
                                    value: room.id.toString(),
                                    label: room.nameKr,
                                    description: room.nameEn,
                                }))}
                                onChange={e => {
                                    setSpaceId(parseInt(e.value));
                                }}
                            />
                        </GridItem>
                        <GridItem colSpan={{ base: 6, md: 3 }}>
                            {verifiedOrganizations ? (
                                <SelectComponent
                                    label="Verified Organization"
                                    optionList={verifiedOrganizations.map(org => ({
                                        value: org.id.toString(),
                                        label: org.name,
                                    }))}
                                    onChange={e => {
                                        setOrgId(parseInt(e.value));
                                    }}
                                />
                            ) : (<SmallLoading />)}
                        </GridItem>

                        <GridItem colSpan={6}>
                            <DateSelector
                                orgId={orgId}
                                spaceId={spaceId}
                                editable
                                isAdmin
                            />
                        </GridItem>
                    </Grid>
                </Stack>
            )}
        </Scroll>
    );
}
