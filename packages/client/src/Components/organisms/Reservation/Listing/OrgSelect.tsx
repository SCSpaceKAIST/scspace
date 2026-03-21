"use client";

import { createListCollection, Portal, Select } from "@chakra-ui/react";
import TooltipComponent from "@scspace-client/Components/atoms/Tooptip";
import { IOrganizationDelegator } from "@scspace-depot/types/organization";
import { useMemo } from "react";

const INIT_OPTIONS = [
    { label: "All", value: "0" },
    { label: "Individual", value: "1" }
];

export default function OrgSelect({ organization, setOid, oid }: {
    organization: IOrganizationDelegator[];
    setOid: (n: number) => void;
    oid: number;
}) {
    const options = useMemo(() => {
        if (!organization) {
            return INIT_OPTIONS;
        }

        return [
            ...INIT_OPTIONS,
            ...organization.map((o) => ({
                label: o.name,
                value: o.id.toString()
            }))
        ];
    }, [organization]);

    const optionList = useMemo(() => createListCollection({ items: options }), [options]);

    return (
        <Select.Root
            collection={optionList}
            value={[oid.toString()]}
            onValueChange={(e) => {
                const nextValue = e.value[0];
                if (!nextValue) return;

                const nextOid = parseInt(nextValue, 10);
                if (!Number.isNaN(nextOid) && nextOid !== oid) {
                    setOid(nextOid);
                }
            }}
            width="180px"
        >
            <Select.HiddenSelect />
            <TooltipComponent content="Organization">
                <Select.Control>
                    <Select.Trigger>
                        <Select.ValueText />
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                        <Select.Indicator />
                    </Select.IndicatorGroup>
                </Select.Control>
            </TooltipComponent>
            <Portal>
                <Select.Positioner>
                    <Select.Content minW="fit-content">
                        {optionList.items.map((option) => (
                            <Select.Item
                                item={option}
                                key={option.value}
                            >
                                {option.label}
                                <Select.ItemIndicator />
                            </Select.Item>
                        ))}
                    </Select.Content>
                </Select.Positioner>
            </Portal>
        </Select.Root>
    );
}
