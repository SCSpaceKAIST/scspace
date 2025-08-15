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
    isOrgRequested: boolean;
}

export function DateSlot({
    drawnOrgName,
    day,
    hour,
    isSelected,
    onSelect,
    orgCount,
    isOrgRequested
}: TimeSlotProps) {
    const [isHovered, setIsHovered] = useState(false);

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
                    color={getColor()}
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
