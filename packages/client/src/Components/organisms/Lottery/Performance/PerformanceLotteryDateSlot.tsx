"use client"

import { AbsoluteCenter, Box, Button, Center, DataList, Grid, GridItem, Separator, Stack, StackSeparator, Text } from "@chakra-ui/react";
import DataListItem from "@scspace-client/Components/atoms/DataListItem";
import { useDate } from "@scspace-client/Hooks/utils";
import { useEffect, useState } from "react";

interface DateSlotProps {
    startTime: number;
    date: number;
    isSelected: boolean;
    onSelect: () => void;
    orgCount: [number, number, number];
    drawnOrgName: string | null;
    isOrgRequested: boolean;
}

export function DateSlot({
    startTime,
    date,
    isSelected,
    onSelect,
    orgCount,
    drawnOrgName,
    isOrgRequested
}: DateSlotProps) {
    const { getDateString, getTime, getDate } = useDate();
    const [isHovered, setIsHovered] = useState(false);

    const [slotDate, setSlotDate] = useState<Date>(getDate(startTime));
    useEffect(() => {
        setSlotDate(s => {
            s.setDate(s.getDate() + date);
            return s;
        });
    }, [date]);

    const getBgColor = () => {
        if (isSelected) return "blue.100"; // readOnly일 때 더 진한 색
        if (isOrgRequested) return "cyan.100"; // 이미 추첨된 조직이 선택된 경우
        if (drawnOrgName !== null) return "green.100";
        if (isHovered) return "gray.50";
        return "white";
    };

    const getBorderColor = () => {
        if (isSelected) return "blue.300"; // readOnly일 때 더 진한 테두리
        if (isOrgRequested) return "cyan.300"; // 이미 추첨된 조직이 선택된 경우
        if (drawnOrgName !== null) return "green.300";
        return "gray.200";
    };

    const getColor = () => {
        if (isSelected) return "blue.600"; // readOnly일 때 더 진한 색
        if (isOrgRequested) return "cyan.600"; // 이미 추첨된 조직이 선택된 경우
        if (drawnOrgName !== null) return "green.600";
        return "gray.600";
    };

    return (
        <GridItem
            borderRightWidth="1px"
            borderBottomWidth="1px"
            borderColor={getBorderColor()}
            height="152px"
            minW={"190px"}
            bg={getBgColor()}
            transition="all 0.2s"
        >
            <Button
                variant="ghost"
                width="100%"
                maxW={"100%"}
                height="100%"
                minW={0}
                padding={1}
                rounded="none"
                onClick={onSelect}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                cursor={drawnOrgName !== null ? "default" : "pointer"}
                _hover={{
                    bg: "transparent"
                }}
                _active={{
                    bg: "transparent"
                }}
            >
                <Grid
                    p={1}
                    gap={1}
                    width={"100%"}
                    maxW={"100%"}
                    templateRows={"auto auto 1fr"}
                    h={"100%"}
                >
                    <Text fontSize="sm" margin={0} padding={0}>
                        {getDateString(getTime(slotDate))}
                    </Text>
                    <Separator borderColor={getBorderColor()} width={"100%"} />
                    <Center maxW="100%" overflow="hidden">
                        {drawnOrgName ? (
                            <Text
                                maxW="100%"
                                truncate
                                overflow="hidden"
                                color={getColor()}
                            >
                                {drawnOrgName}
                            </Text>
                        ) : (
                            <DataList.Root orientation={"horizontal"}>
                                <DataListItem label="Priority 1">
                                    {orgCount[0]}
                                </DataListItem>
                                <DataListItem label="Priority 2">
                                    {orgCount[1]}
                                </DataListItem>
                                <DataListItem label="Priority 3">
                                    {orgCount[2]}
                                </DataListItem>
                            </DataList.Root>
                        )}
                    </Center>
                </Grid>
            </Button>
        </GridItem>
    );
}