"use client";

import { createListCollection, Portal, Select } from "@chakra-ui/react";
import TooltipComponent from "@scspace-client/Components/atoms/Tooptip";
import { IOrganizationDelegator } from "@scspace-depot/types/organization";
import { useEffect, useState } from "react";

export default function OrgSelect({ organization, setOid, oid }: {
    organization: IOrganizationDelegator[];
    setOid: (n: number) => void;
    oid: number;
}) {
    const [_oid, _setOid] = useState<string[]>(["0"]);
    useEffect(() => {
        const _t = parseInt(_oid[0]);
        if (_t != oid) setOid(_t);
    }, [_oid]);

    const initOpt = [
        { label: "All", value: "0" },
        { label: "Individual", value: "1" }
    ];

    const [options, setOptions] = useState<{ label: string; value: string }[]>(initOpt);
    useEffect(() => {
        if (!organization) {
            setOptions(initOpt);
            return;
        }
        setOptions([
            ...initOpt,
            ...organization.map((o) => ({
                label: o.name,
                value: o.id.toString()
            }))
        ])
    }, [organization]);

    const optionList = createListCollection({ items: options });

    return (
        <Select.Root
            collection={optionList}
            value={_oid}
            onValueChange={(e) => _setOid(e.value)}
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