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
    isDisabled?: boolean;
    onSelect: (day: string, hour: number) => void;
}

export function TimeSlot({
    day,
    hour,
    isSelected,
    isDisabled = false,
    onSelect
}: TimeSlotProps) {
    const [isHovered, setIsHovered] = useState(false);

    // 시간 형식화 (18시 이후는 그대로, 0~3시는 다음날)
    const formatHour = (hour: number) => {
        if (hour === 0) return "24:00";
        return `${hour.toString().padStart(2, "0")}:00`;
    };

    const getBgColor = () => {
        if (isDisabled && !isSelected) return "gray.100";
        if (isSelected) return isDisabled ? "blue.200" : "blue.100"; // readOnly일 때 더 진한 색
        if (isHovered && !isDisabled) return "gray.50";
        return "white";
    };

    const getBorderColor = () => {
        if (isSelected) return isDisabled ? "blue.400" : "blue.300"; // readOnly일 때 더 진한 테두리
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
                disabled={isDisabled}
                onClick={() => !isDisabled && onSelect(day, hour)}
                onMouseEnter={() => !isDisabled && setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                cursor={isDisabled ? (isSelected ? "default" : "not-allowed") : "pointer"}
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
                    opacity={isDisabled && !isSelected ? 0.5 : 1}
                >
                    <Text
                        fontSize="xs"
                        fontWeight={isSelected ? "semibold" : "normal"}
                        color={
                            isSelected
                                ? (isDisabled ? "blue.700" : "blue.600")
                                : "gray.600"
                        }
                        textAlign="center"
                    >
                        {formatHour(hour)}
                    </Text>
                </Flex>
            </Button>
        </GridItem>
    );
}
