import {
    Box,
    Grid,
    GridItem,
    Text,
    Center,
    VStack,
    HStack,
    Button,
    ActionBar,
    Float,
    Portal,
    StackSeparator,
    CloseButton,
    Wrap,
    Tag,
    Badge,
    Stack,
    Flex,
    IconButton,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { TimeSlot } from "./TimeSlot";
import { toaster } from "@scspace-client/Components/atoms/Toaster";
import { useSeminarLotteryAPI, useSeminarLotteryInfoAPI } from "@scspace-client/Hooks/lottery";
import { useLinkPush } from "@scspace-client/Hooks/api";
import { useOrganizationAPI } from "@scspace-client/Hooks/organization";
import FieldComponent from "@scspace-client/Components/atoms/Field";
import DeleteBtn from "@scspace-client/Components/molecules/buttons/DeleteBtn";
import { useDate } from "@scspace-client/Hooks/utils";
import RefetchBtn from "@scspace-client/Components/molecules/buttons/RefetchBtn";

export function TimeSelector({ orgId, spaceId, editable }: {
    orgId: number;
    spaceId: number;
    editable: boolean;
}) {
    const [readOnly, setReadOnly] = useState<boolean>(false);
    const [appliedId, setAppliedId] = useState<number>(-1);
    const { linkPush } = useLinkPush();
    const { getTime } = useDate();

    const {
        data: activeLotteryInfo
    } = useSeminarLotteryInfoAPI().activeLotteryInfo;

    if (activeLotteryInfo && activeLotteryInfo.length === 0) {
        alert("It is NOT a seminar room lottery period");
        linkPush("/");
    }

    const { data: verifiedOrganizations } = useOrganizationAPI().verifiedOrganizations;

    useEffect(() => {
        setReadOnly(
            orgId === -1 ||
            !activeLotteryInfo ||
            activeLotteryInfo.length === 0 ||
            activeLotteryInfo[0].timeLotteryEnd < getTime(new Date()) ||
            !editable
        );
    }, [orgId, activeLotteryInfo, editable]);

    const [selectedTime, setSelectedTime] = useState<number>(-1);
    const [selectedTimeString, setSelectedTimeString] = useState<string>("");
    useEffect(() => {
        if (selectedTime !== -1) {
            const { dayIndex, hour } = decodeTimeSlot(selectedTime);
            const dayLabel = weekDays[dayIndex].label;
            setSelectedTimeString(`${dayLabel} ${hour}:00 - ${hour + 1}:00`);
        }
    }, [selectedTime]);

    const [open, setOpen] = useState<boolean>(false);
    useEffect(() => { if (selectedTime !== -1) setOpen(true); }, [selectedTime]);

    const {
        createSeminarLottery,
        deleteSeminarLottery,
        timeSlotCounts: {
            data: timeSlotCounts,
            refetch: refetchTimeSlotCounts
        },
        lotteryByTime: {
            data: lotteryByTime,
            refetch: refetchLotteryByTime
        },
        drawnLottery: {
            data: drawnLottery,
            refetch: refetchDrawnLottery
        },
        lotteryByOrganization: {
            data: lotteryByOrganization,
            refetch: refetchLotteryByOrganization
        }
    } = useSeminarLotteryAPI({
        id: appliedId,
        organizationId: orgId,
        spaceId,
        infoId: (activeLotteryInfo && activeLotteryInfo.length > 0) ? activeLotteryInfo[0].id : -1,
        time: selectedTime,
    });

    useEffect(() => { refetchTimeSlotCounts() }, [spaceId]);
    useEffect(() => { if (selectedTime !== -1) { refetchLotteryByTime(); } }, [selectedTime, orgId, spaceId]);
    useEffect(() => { refetchDrawnLottery(); }, [orgId, spaceId]);
    useEffect(() => { refetchLotteryByOrganization(); }, [orgId, spaceId]);

    const [available, setAvailable] = useState<boolean>(true);

    useEffect(() => {
        if (!lotteryByTime) return;
        setAppliedId(lotteryByTime.find(l => l.organizationId === orgId)?.id || -1);
    }, [lotteryByTime, orgId]);

    useEffect(() => {
        if (!drawnLottery) return;
        if (selectedTime === -1) return;
        setAvailable(drawnLottery.find(l => l.time === selectedTime) === undefined);
    }, [drawnLottery, selectedTime]);

    // 요일 배열 (월 ~ 일) - 인덱스가 날짜 번호 (0~6)
    const weekDays = [
        { key: "monday", label: "Mon", index: 0 },
        { key: "tuesday", label: "Tue", index: 1 },
        { key: "wednesday", label: "Wed", index: 2 },
        { key: "thursday", label: "Thu", index: 3 },
        { key: "friday", label: "Fri", index: 4 },
        { key: "saturday", label: "Sat", index: 5 },
        { key: "sunday", label: "Sun", index: 6 },
    ];

    // 시간 배열 (18 ~ 3시: 18,19,20,21,22,23,0,1,2,3)
    const timeHours = Array.from({ length: 24 }, (_, i) => i);

    // 날짜와 시간을 number로 인코딩: (시간) + (날짜) * 24
    const encodeTimeSlot = (dayIndex: number, hour: number): number => {
        return hour + dayIndex * 24;
    };

    // number를 날짜와 시간으로 디코딩
    const decodeTimeSlot = (encoded: number): { dayIndex: number; hour: number } => {
        const dayIndex = Math.floor(encoded / 24);
        const hour = encoded % 24;
        return { dayIndex, hour };
    };

    const refetchAll = () => {
        refetchTimeSlotCounts();
        refetchLotteryByTime();
        refetchLotteryByOrganization();
        refetchDrawnLottery();
    };

    const createSeminarLotteryHandler = () => {
        if (!activeLotteryInfo || activeLotteryInfo?.length === 0) return;
        if (orgId === -1) return;
        if (selectedTime === -1) return;

        createSeminarLottery({
            organizationId: orgId,
            spaceId,
            infoId: activeLotteryInfo[0].id,
            time: selectedTime,
        }, {
            onSuccess: () => {
                toaster.success({
                    title: "Successfully created",
                    description: "The seminar lottery has been created successfully.",
                });
            },
            onError: (error) => {
                toaster.error({
                    title: "Failed to create seminar lottery",
                    description: error.message || "Failed to create seminar lottery.",
                });
            },
            onSettled: refetchAll
        });
    }

    const deleteSeminarLotteryHandler = () => {
        if (!appliedId) return;

        deleteSeminarLottery({}, {
            onSuccess: () => {
                toaster.success({
                    title: "Successfully deleted seminar lottery",
                    description: "The selected seminar lottery has been deleted successfully.",
                });
                setAppliedId(-1);
            },
            onError: (error) => {
                toaster.error({
                    title: "Failed to delete seminar lottery",
                    description: error.message || "Failed to delete seminar lottery.",
                });
            },
            onSettled: refetchAll
        });
    }

    return (
        <>
            <ActionBar.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
                <Portal>
                    <ActionBar.Positioner zIndex={100}>
                        <ActionBar.Content>
                            <VStack separator={<StackSeparator />}>
                                {lotteryByTime && lotteryByTime.length > 0 && (
                                    <Wrap>
                                        {lotteryByTime.map(l => {
                                            const org = verifiedOrganizations?.find(org => org.id === l.organizationId);
                                            if (!org) return null;
                                            return (
                                                <Badge colorPalette={org.hasRoom ? "blue" : "green"} key={l.id}>
                                                    {org.name}
                                                </Badge>
                                            );
                                        })}
                                    </Wrap>
                                )}
                                <HStack separator={<StackSeparator />}>
                                    <ActionBar.SelectionTrigger>
                                        {selectedTimeString}
                                    </ActionBar.SelectionTrigger>
                                    {available && !readOnly && (appliedId === -1) && (
                                        <Button
                                            variant={"outline"}
                                            colorPalette={"blue"}
                                            onClick={createSeminarLotteryHandler}
                                        >
                                            Apply
                                        </Button>
                                    )}
                                    {available && !readOnly && (appliedId !== -1) && (
                                        <Button
                                            variant={"outline"}
                                            colorPalette={"red"}
                                            onClick={deleteSeminarLotteryHandler}
                                        >
                                            Delete
                                        </Button>
                                    )}
                                    {!available && !readOnly && (appliedId !== -1) && (
                                        <DeleteBtn onDelete={deleteSeminarLotteryHandler} />
                                    )}
                                    <ActionBar.CloseTrigger asChild>
                                        <CloseButton />
                                    </ActionBar.CloseTrigger>
                                </HStack>
                            </VStack>
                        </ActionBar.Content>
                    </ActionBar.Positioner>
                </Portal>
            </ActionBar.Root>
            {/* 플래너 그리드 */}
            <Stack>
                <Flex direction={"row"} justify={"flex-end"}>
                    <RefetchBtn refetch={refetchAll} />
                </Flex>
                <Box
                    overflowX="auto"
                    overflowY="auto"
                    rounded="md"
                    borderWidth="1px"
                    borderColor="gray.200"
                    bg="white"
                    width={"full"}
                >
                    <Grid
                        templateColumns={`60px repeat(${weekDays.length}, 1fr)`}
                        templateRows={`40px repeat(${timeHours.length}, 1fr)`}
                        gap={0}
                        minW="600px"
                        width="100%"
                    >
                        {/* 좌상단 빈 칸 */}
                        <GridItem
                            bg="gray.50"
                            borderRightWidth="1px"
                            borderBottomWidth="1px"
                            borderColor="gray.200"
                            zIndex={1}
                            position={"sticky"}
                            left={0}
                        />

                        {/* 요일 헤더 */}
                        {weekDays.map((day) => (
                            <GridItem
                                key={day.key}
                                bg="gray.50"
                                borderRightWidth="1px"
                                borderBottomWidth="1px"
                                borderColor="gray.200"
                                height="40px"
                            >
                                <Center height="100%">
                                    <Text
                                        fontWeight="semibold"
                                        fontSize="sm"
                                    >
                                        {day.label}
                                    </Text>
                                </Center>
                            </GridItem>
                        ))}

                        {/* 시간 라벨 + 시간 슬롯들 */}
                        {timeHours.map((hour, hourIndex) => (
                            // 각 시간대별로 행을 만듦
                            <>
                                {/* 시간 라벨 (좌측) */}
                                <GridItem
                                    key={`time-${hour}`}
                                    bg="gray.50"
                                    borderRightWidth="1px"
                                    // borderBottomWidth="1px"
                                    borderColor="gray.200"
                                    height="48px"
                                    zIndex={1}
                                    position={"sticky"}
                                    left={0}
                                >
                                    <Center height="100%">
                                        <Text fontSize="sm" margin={0} padding={0}
                                            visibility="hidden"
                                        >
                                            00:00
                                        </Text>
                                        {(hour > 0) && (
                                            <Float placement="top-center">
                                                <Text fontSize="sm" margin={0} padding={0} color="black">
                                                    {hour.toString().padStart(2, "0")}:00
                                                </Text>
                                            </Float>
                                        )}
                                    </Center>
                                </GridItem>

                                {/* 각 요일별 시간 슬롯 */}
                                {weekDays.map((day) => (
                                    <TimeSlot
                                        key={`${day.key}-${hour}`}
                                        day={day.key}
                                        hour={hour}
                                        // isSelected={isSlotSelected(day.key, hour)}
                                        // isDisabled={isSlotDisabled(day.key, hour) || readOnly}
                                        isSelected={selectedTime === encodeTimeSlot(day.index, hour) && open}
                                        onSelect={() => {
                                            if (selectedTime !== encodeTimeSlot(day.index, hour)) {
                                                setSelectedTime(encodeTimeSlot(day.index, hour));
                                            } else if (!open) {
                                                setOpen(true);
                                            } else {
                                                setSelectedTime(-1);
                                            }
                                        }}
                                        orgCount={timeSlotCounts?.find(s => s.time === encodeTimeSlot(day.index, hour))?.count ?? 0}
                                        drawnOrgName={verifiedOrganizations?.find(o => o.id === drawnLottery?.find(l => l.time === encodeTimeSlot(day.index, hour))?.organizationId)?.name ?? null}
                                        isOrgRequested={lotteryByOrganization?.some(l => l.time === encodeTimeSlot(day.index, hour)) ?? false}
                                    />
                                ))}
                            </>
                        ))}
                    </Grid>
                </Box>
            </Stack>
        </>
    );
}
