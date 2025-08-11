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
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { TimeSlot } from "./TimeSlot";
import { toaster } from "@scspace-client/Components/atoms/Toaster";
import { useSeminarLotteryAPI, useSeminarLotteryInfoAPI } from "@scspace-client/Hooks/lottery";
import { useLinkPush } from "@scspace-client/Hooks/api";
import { useOrganizationAPI } from "@scspace-client/Hooks/organization";
import FieldComponent from "@scspace-client/Components/atoms/Field";

export function TimeSelector({ orgId, spaceId }: {
    orgId: number;
    spaceId: number;
}) {
    const [readOnly, setReadOnly] = useState<boolean>(false);
    const [appliedId, setAppliedId] = useState<number>(-1);
    const { linkPush } = useLinkPush();

    const {
        data: activeLotteryInfo
    } = useSeminarLotteryInfoAPI().activeLotteryInfo;

    if (activeLotteryInfo && activeLotteryInfo.length === 0) {
        alert("This is NOT a seminar room lottery period");
        linkPush("/");
    }

    const { data: verifiedOrganizations } = useOrganizationAPI().verifiedOrganizations;

    useEffect(() => {
        setReadOnly(orgId === -1 || !activeLotteryInfo || activeLotteryInfo.length === 0);
    }, [orgId, activeLotteryInfo]);

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
    useEffect(() => {
        setOpen(selectedTime !== -1);
    }, [selectedTime]);

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
        }
    } = useSeminarLotteryAPI({
        id: appliedId,
        organizationId: orgId,
        spaceId,
        infoId: (activeLotteryInfo && activeLotteryInfo.length > 0) ? activeLotteryInfo[0].id : -1,
        time: selectedTime,
    });

    useEffect(() => { if (selectedTime !== -1) refetchLotteryByTime() }, [selectedTime]);

    useEffect(() => {
        if (lotteryByTime) {
            setAppliedId(lotteryByTime.find(l => l.organizationId === orgId)?.id || -1);
        }
    }, [lotteryByTime]);

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

    // day key를 dayIndex로 변환
    const getDayIndex = (dayKey: string): number => {
        return weekDays.find(d => d.key === dayKey)?.index ?? 0;
    };

    // dayIndex를 day key로 변환
    const getDayKey = (dayIndex: number): string => {
        return weekDays.find(d => d.index === dayIndex)?.key ?? "monday";
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
                    title: "추첨 생성 성공",
                    description: "새로운 추첨이 생성되었습니다.",
                });
                refetchTimeSlotCounts();
                setSelectedTime(-1);
            },
            onError: (error) => {
                toaster.error({
                    title: "추첨 생성 실패",
                    description: error.message || "추첨 생성에 실패했습니다.",
                });
            }
        });
    }

    const deleteSeminarLotteryHandler = () => {
        if (!appliedId) return;

        deleteSeminarLottery({}, {
            onSuccess: () => {
                toaster.success({
                    title: "추첨 삭제 성공",
                    description: "선택한 추첨이 삭제되었습니다.",
                });
                refetchTimeSlotCounts();
                setAppliedId(-1);
            },
            onError: (error) => {
                toaster.error({
                    title: "추첨 삭제 실패",
                    description: error.message || "추첨 삭제에 실패했습니다.",
                });
            }
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
                                    {!readOnly && (appliedId === -1) && (
                                        <Button
                                            variant={"outline"}
                                            colorPalette={"blue"}
                                            onClick={createSeminarLotteryHandler}
                                        >
                                            Apply
                                        </Button>
                                    )}
                                    {(appliedId !== -1) && (
                                        <Button
                                            variant={"outline"}
                                            colorPalette={"red"}
                                            onClick={deleteSeminarLotteryHandler}
                                        >
                                            Delete
                                        </Button>
                                    )}
                                    <ActionBar.CloseTrigger asChild>
                                        <CloseButton onClick={() => setSelectedTime(-1)} />
                                    </ActionBar.CloseTrigger>
                                </HStack>
                            </VStack>
                        </ActionBar.Content>
                    </ActionBar.Positioner>
                </Portal>
            </ActionBar.Root>
            {/* 헤더 정보 */}
            <FieldComponent options={{ label: "Time Selector", }}>
                {/* 플래너 그리드 */}
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
                                        isSelected={selectedTime === encodeTimeSlot(day.index, hour)}
                                        isDisabled={false}
                                        onSelect={() => {
                                            if (selectedTime !== encodeTimeSlot(day.index, hour)) {
                                                setSelectedTime(encodeTimeSlot(day.index, hour));
                                            } else {
                                                setSelectedTime(-1);
                                            }
                                        }}
                                        orgCount={timeSlotCounts?.find(s => s.time === encodeTimeSlot(day.index, hour))?.count || 0}
                                    />
                                ))}
                            </>
                        ))}
                    </Grid>
                </Box>
            </FieldComponent>
        </>
    );
}
