"use client"

import { createListCollection, Select } from "@chakra-ui/react";

export default function LanguageSetup() {
    const languages = createListCollection({
        items: [
            { label: "한국어", value: "ko" },
            { label: "English", value: "en" },
        ],
    });

    return (
        <Select.Root
            defaultValue={["ko"]}
            collection={languages}
            size={"xs"}
            w={"100px"}
        >
            <Select.HiddenSelect />

            <Select.Control>
                <Select.Trigger>
                    <Select.ValueText />
                </Select.Trigger>
                <Select.IndicatorGroup>
                    <Select.Indicator />
                </Select.IndicatorGroup>
            </Select.Control>

            <Select.Positioner>
                <Select.Content>
                    {languages.items.map((item) => (
                        <Select.Item
                            item={item}
                            key={item.value}
                        >
                            {item.label}
                        </Select.Item>
                    ))}
                </Select.Content>
            </Select.Positioner>
        </Select.Root>
    );
}
