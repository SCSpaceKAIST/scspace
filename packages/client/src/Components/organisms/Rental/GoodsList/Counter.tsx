"use client"

import { HStack, IconButton, NumberInput } from "@chakra-ui/react";
import { LuMinus, LuPlus } from "react-icons/lu"

export default function Counter({ count, setCount, min, max }: {
    count: number;
    setCount: (value: number) => void;
    min?: number;
    max?: number;
}) {
    return (
        <NumberInput.Root
            value={count.toString()}
            onValueChange={(e) => setCount(parseInt(e.value))}
            unstyled
            spinOnPress={false}
            min={min ?? 1}
            max={max ?? 1}
        >
            <HStack gap="2">
                <NumberInput.DecrementTrigger asChild>
                    <IconButton variant="outline" size="sm">
                        <LuMinus />
                    </IconButton>
                </NumberInput.DecrementTrigger>
                <NumberInput.ValueText
                    textAlign="center"
                    fontSize="lg"
                    minW="3ch"
                    fontWeight={"semibold"}
                />
                <NumberInput.IncrementTrigger asChild>
                    <IconButton variant="outline" size="sm">
                        <LuPlus />
                    </IconButton>
                </NumberInput.IncrementTrigger>
            </HStack>
        </NumberInput.Root>
    );
}