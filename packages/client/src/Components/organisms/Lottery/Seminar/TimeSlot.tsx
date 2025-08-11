import {
    GridItem,
    Button,
    Flex,
    Text,
} from "@chakra-ui/react";
import { useState } from "react";

interface TimeSlotProps {
    day: string;
    hour: number;
    isSelected: boolean;
    onSelect: (day: string, hour: number) => void;
    orgCount: number;
    drawnOrgName: string | null;
}

export function TimeSlot({
    drawnOrgName,
    day,
    hour,
    isSelected,
    onSelect,
    orgCount
}: TimeSlotProps) {
    const [isHovered, setIsHovered] = useState(false);

    // 시간 형식화 (18시 이후는 그대로, 0~3시는 다음날)
    const formatHour = (hour: number) => {
        if (hour === 0) return "24:00";
        return `${hour.toString().padStart(2, "0")}:00`;
    };

    const getBgColor = () => {
        if (drawnOrgName !== null) return "green.100";
        if (!isSelected) return "gray.100";
        if (isSelected) return "blue.100"; // readOnly일 때 더 진한 색
        if (isHovered) return "gray.50";
        return "white";
    };

    const getBorderColor = () => {
        if (drawnOrgName !== null) return "green.300";
        if (isSelected) return "blue.300"; // readOnly일 때 더 진한 테두리
        return "gray.200";
    };

    return (
        <GridItem
            borderRightWidth="1px"
            borderBottomWidth="1px"
            borderColor={getBorderColor()}
            height="48px"
            minW={0}
            bg={getBgColor()}
            transition="all 0.2s"
        >
            <Button
                variant="ghost"
                width="100%"
                height="100%"
                minW={0}
                padding={1}
                rounded="none"
                onClick={() => onSelect(day, hour)}
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
                <Flex
                    width="100%"
                    height="100%"
                    alignItems="center"
                    justifyContent="center"
                    fontSize="xs"
                    fontWeight={isSelected ? "semibold" : "normal"}
                    color={
                        (drawnOrgName !== null) ?
                            "green.600" :
                            (isSelected ? "blue.600" : "gray.600")
                    }
                    textAlign="center"
                >
                    {drawnOrgName ? <Text>{drawnOrgName}</Text> :
                        (orgCount > 0 ? (
                            <Text>
                                {orgCount}
                            </Text>
                        ) : null)
                    }
                </Flex>
            </Button>
        </GridItem>
    );
}
