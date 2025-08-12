"use client"

import { Alert, Badge, Blockquote, Grid, GridItem, List, Separator, Stack, StackSeparator } from "@chakra-ui/react";
import LoadingComponent, { SmallLoading } from "@scspace-client/Components/atoms/Loading";
import SelectComponent from "@scspace-client/Components/molecules/forms/Select";
import Scroll from "@scspace-client/Components/molecules/page/Scroll";
import { TimeSelector } from "@scspace-client/Components/organisms/Lottery/Seminar/TimeSelector";
import { useAuth } from "@scspace-client/Hooks/auth";
import { useOrganizationAPI } from "@scspace-client/Hooks/organization";
import { useAllSpace } from "@scspace-client/Hooks/space";
import { OrganizationStatusEnum } from "@scspace-depot/enums/organization.enum";
import { SpaceTypeEnum } from "@scspace-depot/enums/space.enum";
import { ISpace } from "@scspace-depot/types/space";
import { useEffect, useState } from "react";

export default function SeminarLottery() {
    const { userInfo, needLogin } = useAuth();
    needLogin();

    const { spaces, isLoading: spaceLoading } = useAllSpace();
    const { data: verifiedOrganizations, isLoading: orgLoading } = useOrganizationAPI({
        uid: userInfo?.id
    }).verifiedOrganizations;

    const seminarRoom: ISpace[] = spaces?.filter(space =>
        space.spaceType === SpaceTypeEnum.SEMINAR
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
        if (seminarRoom.length > 0 && spaceId === 1) {
            setSpaceId(seminarRoom[0].id);
        }
    }, [seminarRoom]);

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
                            <Stack separator={<StackSeparator />}>
                                <Blockquote.Root variant={"solid"}>
                                    <Blockquote.Content>
                                        <List.Root listStyle={"none"}>
                                            <List.Item>
                                                You can select a time slot to apply for the seminar lottery.
                                            </List.Item>
                                            <List.Item>
                                                The number in each column represents the number of organizations that applied during that time.
                                            </List.Item>
                                            <List.Item>
                                                Organization names are represented by <Badge colorPalette={"blue"}>Org has Room</Badge> or <Badge colorPalette={"green"}>Org has no Room</Badge>, depending on whether the organization has a group room.
                                            </List.Item>
                                            <List.Item fontWeight={"semibold"} color={"blue"}>
                                                Organizations without group rooms have priority in the lottery.
                                            </List.Item>
                                            <List.Item>
                                                The lottery will be automatically conducted every day at 6 PM during the lottery period, and the results will be notified via email.
                                            </List.Item>
                                            <List.Item>
                                                The winning time slot displays the name of the winning organization, and you can select an organization to highlight only that organization's time slot.
                                            </List.Item>
                                            <List.Item fontWeight={"semibold"} color={"red"}>
                                                You can delete and reapply after winning the lottery, but you can't revert to winning status after deleting.
                                            </List.Item>
                                        </List.Root>
                                    </Blockquote.Content>
                                </Blockquote.Root>
                                <Blockquote.Root variant={"solid"}>
                                    <Blockquote.Content>
                                        <List.Root listStyle={"none"}>
                                            <List.Item>
                                                세미나 추첨을 신청할 시간대를 선택할 수 있습니다.
                                            </List.Item>
                                            <List.Item>
                                                각 열의 숫자는 해당 시간에 신청한 조직의 수를 나타냅니다.
                                            </List.Item>
                                            <List.Item>
                                                조직의 이름은 단체실 소유 여부에 따라 <Badge colorPalette={"blue"}>Org has room</Badge> 또는 <Badge colorPalette={"green"}>Org has no room</Badge>으로 표시됩니다.
                                            </List.Item>
                                            <List.Item fontWeight={"semibold"} color={"blue"}>
                                                단체실이 없는 조직이 추첨에서 우선권을 가집니다.
                                            </List.Item>
                                            <List.Item>
                                                추첨은 추첨 기간동안 매일 오후 6시에 자동으로 진행되며, 결과는 메일로 통보됩니다.
                                            </List.Item>
                                            <List.Item>
                                                추첨에 당첨된 시간대에는 당첨된 조직의 이름이 표시되며, 조직을 선택해 해당 조직의 시간대만 강조할 수 있습니다.
                                            </List.Item>
                                            <List.Item fontWeight={"semibold"} color={"red"}>
                                                추첨에 당첨된 후에도 삭제하고 다시 신청할 수 있지만, 삭제한 뒤엔 당첨된 상태로 되돌릴 수 없습니다.
                                            </List.Item>
                                        </List.Root>
                                    </Blockquote.Content>
                                </Blockquote.Root>
                            </Stack>
                        </GridItem>
                        <GridItem colSpan={{ base: 6, md: 3 }}>
                            <SelectComponent
                                label="Seminar Room"
                                optionList={seminarRoom.map(room => ({
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
                            <TimeSelector
                                orgId={orgId}
                                spaceId={spaceId}
                                editable={verifiedOrganizations?.find(v => v.id === orgId)?.delegatorId === userInfo?.id}
                            />
                        </GridItem>
                    </Grid>
                </Stack>
            )}
        </Scroll>
    );
}  