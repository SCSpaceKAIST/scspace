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
    Portal,
    StackSeparator,
    CloseButton,
    Stack,
    Flex,
    Alert,
    Wrap,
    Badge,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { toaster } from "@scspace-client/Components/atoms/Toaster";
import { useLinkPush } from "@scspace-client/Hooks/api";
import { useOrganizationAPI } from "@scspace-client/Hooks/organization";
import DeleteBtn from "@scspace-client/Components/molecules/buttons/DeleteBtn";
import { useDate } from "@scspace-client/Hooks/utils";
import RefetchBtn from "@scspace-client/Components/molecules/buttons/RefetchBtn";
import AlertBtn from "@scspace-client/Components/atoms/AlertBtn";
import { DateSlot } from "./PerformanceLotteryDateSlot";
import { usePerformanceLotteryAPI, usePerformanceLotteryInfoAPI, useSeminarLotteryInfoAPI } from "@scspace-client/Hooks/lottery";

export function DateSelector({ orgId, spaceId, editable, isAdmin }: {
    orgId: number;
    spaceId: number;
    editable: boolean;
    isAdmin?: boolean;
}) {
    const [readOnly, setReadOnly] = useState<boolean>(false);
    const [appliedId, setAppliedId] = useState<number>(-1);
    const { linkPush } = useLinkPush();
    const { getTime, getDate } = useDate();

    const {
        activeLotteryInfo: {
            data: activeLotteryInfo,
            refetch: refetchActiveLotteryInfo
        },
        drawPerformanceLottery,
        applyPerformanceLottery,
    } = usePerformanceLotteryInfoAPI();

    if (!isAdmin && activeLotteryInfo && (activeLotteryInfo.length === 0 || activeLotteryInfo[0].applied)) {
        alert("It is NOT a seminar room lottery period");
        linkPush("/");
    }
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [periodLength, setPeriodLength] = useState<number>(0);

    useEffect(() => {
        if (!activeLotteryInfo || activeLotteryInfo.length === 0) return;

        setStartDate(getDate(activeLotteryInfo[0].timeStart));
        setEndDate(getDate(activeLotteryInfo[0].timeEnd));
        setPeriodLength(
            Math.ceil((
                getDate(activeLotteryInfo[0].timeEnd).getTime() - getDate(activeLotteryInfo[0].timeStart).getTime()
            ) / (1000 * 60 * 60 * 24))
        );
    }, [activeLotteryInfo]);

    const { data: verifiedOrganizations } = useOrganizationAPI().verifiedOrganizations;

    useEffect(() => {
        setReadOnly(
            orgId === -1 ||
            !activeLotteryInfo ||
            activeLotteryInfo.length === 0 ||
            activeLotteryInfo[0].timeLotteryEnd < getTime(new Date()) ||
            !editable ||
            activeLotteryInfo[0].applied
        );
    }, [orgId, activeLotteryInfo, editable]);

    const [selectedDate, setSelectedDate] = useState<number>(-1);
    const [selectedDateString, setSelectedDateString] = useState<string>("");
    useEffect(() => {
        if (selectedDate !== -1) {
            const { dayIndex, hour } = decodeTimeSlot(selectedDate);
            const dayLabel = weekDays[dayIndex].label;
            setSelectedDateString(`${dayLabel} ${hour}:00 - ${hour + 1}:00`);
        }
    }, [selectedDate]);

    const [open, setOpen] = useState<boolean>(false);
    useEffect(() => { if (selectedDate !== -1) setOpen(true); }, [selectedDate]);

    const {
        createPerformanceLottery,
        deletePerformanceLottery,
        dateSlotCounts: {
            data: dateSlotCounts,
            refetch: refetchDateSlotCounts
        },
        lotteryByDate: {
            data: lotteryByDate,
            refetch: refetchLotteryByDate
        },
        drawnLottery: {
            data: drawnLottery,
            refetch: refetchDrawnLottery
        },
        lotteryByOrganization: {
            data: lotteryByOrganization,
            refetch: refetchLotteryByOrganization
        }
    } = usePerformanceLotteryAPI({
        id: appliedId,
        organizationId: orgId,
        spaceId,
        infoId: (activeLotteryInfo && activeLotteryInfo.length > 0) ? activeLotteryInfo[0].id : -1,
        date: selectedDate,
    });

    useEffect(() => { refetchDateSlotCounts() }, [spaceId]);
    useEffect(() => {
        if (selectedDate !== -1) { refetchLotteryByDate(); }
    }, [selectedDate, orgId, spaceId]);
    useEffect(() => { refetchDrawnLottery(); }, [orgId, spaceId]);
    useEffect(() => { refetchLotteryByOrganization(); }, [orgId, spaceId]);

    const [available, setAvailable] = useState<boolean>(true);

    useEffect(() => {
        if (!lotteryByDate) return;
        setAppliedId(lotteryByDate.find(l => l.organizationId === orgId)?.id || -1);
    }, [lotteryByDate, orgId]);

    useEffect(() => {
        if (!drawnLottery) return;
        if (selectedDate === -1) return;
        setAvailable(drawnLottery.find(l => l.date === selectedDate) === undefined);
    }, [drawnLottery, selectedDate]);

    // 요일 배열 (월 ~ 일) - 인덱스가 날짜 번호 (0~6)
    const weekDays = [
        { key: "sunday", label: "Sun", index: 0 },
        { key: "monday", label: "Mon", index: 1 },
        { key: "tuesday", label: "Tue", index: 2 },
        { key: "wednesday", label: "Wed", index: 3 },
        { key: "thursday", label: "Thu", index: 4 },
        { key: "friday", label: "Fri", index: 5 },
        { key: "saturday", label: "Sat", index: 6 },
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
        refetchDateSlotCounts();
        refetchLotteryByDate();
        refetchLotteryByOrganization();
        refetchDrawnLottery();
        refetchActiveLotteryInfo();
    };

    const createPerformanceLotteryHandler = (priority: number) => {
        if (!activeLotteryInfo || activeLotteryInfo?.length === 0 || activeLotteryInfo[0].applied) return;
        if (orgId === -1) return;
        if (selectedDate === -1) return;

        createPerformanceLottery({
            organizationId: orgId,
            spaceId,
            infoId: activeLotteryInfo[0].id,
            date: selectedDate,
            priority
        }, {
            onSuccess: () => {
                toaster.success({
                    title: "Successfully created",
                    description: "The performance lottery has been created successfully.",
                });
            },
            onError: (error) => {
                toaster.error({
                    title: "Failed to create performance lottery",
                    description: error.message || "Failed to create performance lottery.",
                });
            },
            onSettled: refetchAll
        });
    };

    const deletePerformanceLotteryHandler = () => {
        if (!activeLotteryInfo || activeLotteryInfo?.length === 0 || activeLotteryInfo[0].applied) return;
        if (!appliedId) return;

        deletePerformanceLottery({}, {
            onSuccess: () => {
                toaster.success({
                    title: "Successfully deleted performance lottery",
                    description: "The selected performance lottery has been deleted successfully.",
                });
                setAppliedId(-1);
            },
            onError: (error) => {
                toaster.error({
                    title: "Failed to delete performance lottery",
                    description: error.message || "Failed to delete performance lottery.",
                });
            },
            onSettled: refetchAll
        });
    }

    return (<>
        <ActionBar.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
            <Portal>
                <ActionBar.Positioner zIndex={100}>
                    <ActionBar.Content>
                        <VStack separator={<StackSeparator />}>
                            {lotteryByDate && lotteryByDate.length > 0 && (
                                <Wrap>
                                    {lotteryByDate.map(l => {
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
                                    {selectedDateString}
                                </ActionBar.SelectionTrigger>
                                {available && !readOnly && (appliedId === -1) && (
                                    <>
                                        {[1, 2, 3].forEach(priority => {
                                            <Button
                                                variant={"outline"}
                                                colorPalette={"blue"}
                                                onClick={() =>
                                                    createPerformanceLotteryHandler(priority)
                                                }
                                            >
                                                Apply (Priority {priority})
                                            </Button>
                                        })}
                                    </>
                                )}
                                {available && !readOnly && (appliedId !== -1) && (
                                    <Button
                                        variant={"outline"}
                                        colorPalette={"red"}
                                        onClick={deletePerformanceLotteryHandler}
                                    >
                                        Delete
                                    </Button>
                                )}
                                {!available && !readOnly && (appliedId !== -1) && (
                                    <DeleteBtn onDelete={deletePerformanceLotteryHandler} />
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
                <RefetchBtn refetch={
                    refetchAll
                    // () => alert("Refetch not implemented yet")
                } />
            </Flex>
            {(
                !activeLotteryInfo || activeLotteryInfo.length === 0
            ) ? (
                <Alert.Root>
                    <Alert.Indicator />
                    <Alert.Content>
                        <Alert.Title>
                            No Active Lottery
                        </Alert.Title>
                        <Alert.Description>
                            There is no active lottery information available.
                        </Alert.Description>
                    </Alert.Content>
                </Alert.Root>
            ) : (
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
                        templateColumns={`repeat(${weekDays.length}, 1fr)`}
                        templateRows={`40px repeat(${Math.ceil((startDate.getDate() + periodLength) / weekDays.length)}, 1fr)`}
                        gap={0}
                        minW="600px"
                        width="100%"
                    >
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

                        {startDate.getDay() !== 0 && (
                            <GridItem
                                colSpan={startDate.getDay()}
                                borderRightWidth="1px"
                                borderBottomWidth="1px"
                                borderColor="gray.200"
                            />
                        )}

                        {Array.from({ length: periodLength }).map((_, i) => (
                            <DateSlot
                                startTime={activeLotteryInfo[0].timeStart}
                                date={i}
                                key={`date-slot-${i}`}
                                isSelected={selectedDate === i && open}
                                onSelect={setSelectedDate}
                                orgCount={(dateSlotCounts && dateSlotCounts[i]) ? dateSlotCounts[i].count : [0, 0, 0]}
                                // drawnOrgName={"12332123132132132132123123123123123123123132"}
                                drawnOrgName={null}
                                isOrgRequested={false}
                            />
                        ))}
                    </Grid>
                </Box>
            )}
            {/* {isAdmin && activeLotteryInfo && activeLotteryInfo.length > 0 && (
                <Stack>
                    <Button width={"full"} colorPalette={"blue"} size={"xl"} disabled={activeLotteryInfo[0].applied} onClick={() => {
                        drawPerformanceLottery({}, {
                            onSuccess: () => {
                                toaster.success({
                                    title: "Successfully drawn seminar lottery",
                                    description: "The seminar lottery has been drawn successfully.",
                                });
                                refetchAll();
                            },
                            onError: (error) => {
                                toaster.error({
                                    title: "Failed to draw seminar lottery",
                                    description: error.message || "Failed to draw seminar lottery.",
                                });
                                refetchAll();
                            },
                        })
                    }}>
                        추첨 저장하기
                    </Button>
                    <AlertBtn
                        onClick={() => {
                            applyPerformanceLottery({}, {
                                onSuccess: () => {
                                    toaster.success({
                                        title: "세미나 추첨 반영 완료",
                                        description: "세미나 추첨 반영이 완료되었습니다.",
                                    });
                                },
                                onError: (error) => {
                                    toaster.error({
                                        title: "세미나 추첨 반영 실패",
                                        description: error.message || "세미나 추첨 반영에 실패했습니다.",
                                    });
                                },
                                onSettled: refetchAll
                            });
                        }}
                        dialogTitle="세미나실 정기예약 추첨 반영"
                        dialogBody={(<>
                            <Text>
                                세미나실 정기예약 추첨 정보를 반영하시겠습니까?
                            </Text>
                            <Text color={"red"} fontWeight="semibold">
                                이 작업은 되돌릴 수 없습니다.
                            </Text>
                        </>)}
                    >
                        <Button size={"xl"} colorPalette="red" disabled={activeLotteryInfo[0].applied}>
                            {activeLotteryInfo[0].applied ? "이미 반영되었습니다" : "세미나실 정기예약 추첨 반영하기"}
                        </Button>
                    </AlertBtn>
                </Stack>
            )} */}
        </Stack>
    </>);
}
