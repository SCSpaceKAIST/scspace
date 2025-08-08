import {
    Box,
    Grid,
    GridItem,
    Text,
    Center,
    VStack,
    HStack,
    Button,
} from "@chakra-ui/react";
import { useState, useMemo } from "react";
import { TimeSlot } from "./TimeSlot";
import { toaster } from "@scspace-client/Components/atoms/Toaster";

interface TimeSelectorProps {
    selectedSlots?: number[];
    onSelectionChange?: (slots: number[]) => void;
    disabledSlots?: number[];
    maxSelections?: number;
}

export function TimeSelector({
    selectedSlots = [],
    onSelectionChange,
    disabledSlots = [],
    maxSelections = 10
}: TimeSelectorProps) {
    const [internalSelectedSlots, setInternalSelectedSlots] = useState<number[]>(selectedSlots);

    // 요일 배열 (월 ~ 일) - 인덱스가 날짜 번호 (0~6)
    const weekDays = [
        { key: "monday", label: "월", fullLabel: "월요일", index: 0 },
        { key: "tuesday", label: "화", fullLabel: "화요일", index: 1 },
        { key: "wednesday", label: "수", fullLabel: "수요일", index: 2 },
        { key: "thursday", label: "목", fullLabel: "목요일", index: 3 },
        { key: "friday", label: "금", fullLabel: "금요일", index: 4 },
        { key: "saturday", label: "토", fullLabel: "토요일", index: 5 },
        { key: "sunday", label: "일", fullLabel: "일요일", index: 6 },
    ];

    // 시간 배열 (18 ~ 3시: 18,19,20,21,22,23,0,1,2,3)
    const timeHours = [18, 19, 20, 21, 22, 23, 0, 1, 2, 3];

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

    // 선택된 슬롯인지 확인
    const isSlotSelected = (day: string, hour: number): boolean => {
        const dayIndex = getDayIndex(day);
        const encoded = encodeTimeSlot(dayIndex, hour);
        return internalSelectedSlots.includes(encoded);
    };

    // 비활성화된 슬롯인지 확인
    const isSlotDisabled = (day: string, hour: number): boolean => {
        const dayIndex = getDayIndex(day);
        const encoded = encodeTimeSlot(dayIndex, hour);
        return disabledSlots.includes(encoded);
    };

    // 슬롯 선택/해제 핸들러
    const handleSlotSelect = (day: string, hour: number) => {
        const dayIndex = getDayIndex(day);
        const encoded = encodeTimeSlot(dayIndex, hour);
        const isCurrentlySelected = isSlotSelected(day, hour);
        let newSelectedSlots: number[];

        if (isCurrentlySelected) {
            // 선택 해제
            newSelectedSlots = internalSelectedSlots.filter(slot => slot !== encoded);
        } else {
            // 새로 선택
            if (internalSelectedSlots.length >= maxSelections) {
                toaster.warning({
                    title: "선택 제한",
                    description: `최대 ${maxSelections}개까지만 선택할 수 있습니다.`,
                    duration: 3000,
                });
                return;
            }
            newSelectedSlots = [...internalSelectedSlots, encoded];
        }

        setInternalSelectedSlots(newSelectedSlots);
        onSelectionChange?.(newSelectedSlots);
    };

    // 모든 선택 해제
    const clearAllSelections = () => {
        setInternalSelectedSlots([]);
        onSelectionChange?.([]);
    };

    // 선택된 슬롯 수 표시
    const selectedCount = internalSelectedSlots.length;

    return (
        <VStack align="stretch">
            {/* 헤더 정보 */}
            <HStack justify="space-between" align="center">
                <VStack align="start">
                    <Text fontSize="lg" fontWeight="bold">
                        시간 선택
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                        원하는 시간대를 선택하세요 ({selectedCount}/{maxSelections})
                    </Text>
                </VStack>
                {selectedCount > 0 && (
                    <Button
                        size="sm"
                        variant="outline"
                        colorScheme="red"
                        onClick={clearAllSelections}
                    >
                        모두 해제
                    </Button>
                )}
            </HStack>

            {/* 플래너 그리드 */}
            <Box
                overflowX="auto"
                overflowY="auto"
                rounded="md"
                borderWidth="1px"
                borderColor="gray.200"
                bg="white"
            >
                <Grid
                    templateColumns={`80px repeat(${weekDays.length}, 1fr)`}
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
                                    title={day.fullLabel}
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
                                borderBottomWidth="1px"
                                borderColor="gray.200"
                                height="48px"
                            >
                                <Center height="100%">
                                    <Text
                                        fontSize="sm"
                                        fontWeight="medium"
                                        color="gray.700"
                                    >
                                        {hour === 0 ? "24:00" : `${hour.toString().padStart(2, "0")}:00`}
                                    </Text>
                                </Center>
                            </GridItem>

                            {/* 각 요일별 시간 슬롯 */}
                            {weekDays.map((day) => (
                                <TimeSlot
                                    key={`${day.key}-${hour}`}
                                    day={day.key}
                                    hour={hour}
                                    isSelected={isSlotSelected(day.key, hour)}
                                    isDisabled={isSlotDisabled(day.key, hour)}
                                    onSelect={handleSlotSelect}
                                />
                            ))}
                        </>
                    ))}
                </Grid>
            </Box>

            {/* 선택된 시간 요약 */}
            {selectedCount > 0 && (
                <Box
                    p={4}
                    bg="blue.50"
                    rounded="md"
                    borderWidth="1px"
                    borderColor="blue.200"
                >
                    <Text fontSize="sm" fontWeight="semibold" mb={2}>
                        선택된 시간:
                    </Text>
                    <Box>
                        {internalSelectedSlots.map((encodedSlot, index) => {
                            const { dayIndex, hour } = decodeTimeSlot(encodedSlot);
                            const dayData = weekDays.find(d => d.index === dayIndex);
                            const dayLabel = dayData?.fullLabel || "알 수 없음";
                            const timeLabel = hour === 0 ? "24:00" : `${hour.toString().padStart(2, "0")}:00`;
                            return (
                                <Text
                                    key={encodedSlot}
                                    fontSize="xs"
                                    color="blue.600"
                                    display="inline-block"
                                    mr={2}
                                    mb={1}
                                >
                                    {dayLabel} {timeLabel}
                                    {index < selectedCount - 1 ? "," : ""}
                                </Text>
                            );
                        })}
                    </Box>
                </Box>
            )}
        </VStack>
    );
}
