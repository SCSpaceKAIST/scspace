"use client"

import {
    Flex,
    Text,
    Grid,
    useBreakpointValue,
    Tabs
} from "@chakra-ui/react";
import { useState, } from "react";

import { useDate } from "@scspace-client/Hooks/utils";
import SimpleTable from "@scspace-client/Components/atoms/SimpleTable";
import Scroll from "@scspace-client/Components/molecules/page/Scroll";
import { IRentalAll } from "@scspace-depot/types/rental";
import RefetchBtn from "@scspace-client/Components/molecules/buttons/RefetchBtn";
import RentalDialog from "./RentalDialog";

export default function RentalTable({
    disabled,
    rentals,
    refetch,
    helperText,
    showTabs
}: {
    helperText?: string;
    disabled?: boolean;
    rentals: IRentalAll[];
    refetch: () => void;
    showTabs?: boolean;
}) {
    const [selected, setSelected] = useState<number | null>(null);

    const [open, setOpen] = useState<boolean>(false);

    const { getString } = useDate();

    const isWide = useBreakpointValue({ base: false, md: true });

    const [tab, setTab] = useState<string>("All");

    return (
        <>
            <Grid
                height="100%"
                templateRows="auto 1fr"
                gap={2}
            >
                <Flex
                    width="100%"
                    justify={isWide ? "space-between" : "end"}
                    alignItems="end"
                >
                    {isWide && (showTabs ? (
                        <Tabs.Root
                            value={tab}
                            onValueChange={(e) => setTab(e.value)}
                        >
                            <Tabs.List>
                                <Tabs.Trigger value={"all"}>
                                    All
                                </Tabs.Trigger>
                                <Tabs.Trigger value={"on rent"}>
                                    On Rent
                                </Tabs.Trigger>
                                <Tabs.Trigger value={"returned"}>
                                    Returned
                                </Tabs.Trigger>
                            </Tabs.List>
                        </Tabs.Root>
                    ) : (
                        <Text margin={0} color="gray.focusRing">
                            {helperText ? (
                                helperText
                            ) : (
                                "Click each row to see detail of rental history"
                            )}
                        </Text>
                    ))}
                    <RefetchBtn refetch={refetch} />
                </Flex>
                <Scroll>
                    <SimpleTable
                        onIdChange={!disabled ? (
                            (id: number) => {
                                setSelected(id);
                                setOpen(true);
                            }
                        ) : (undefined)}
                        header={[
                            "Goods Name",
                            "Count",
                            "Burrowed Time",
                            "Return Due"
                        ]}
                        content={rentals
                            .filter(rental => (
                                tab === "all" ? true :
                                    tab === "on rent" ?
                                        rental.timeReturn === 0 :
                                        rental.timeReturn !== 0
                            ))
                            .map((rental: IRentalAll) => ({
                                id: rental.id,
                                row: [
                                    rental.goods.name,
                                    rental.count,
                                    getString(rental.timeBorrow),
                                    getString(rental.timeDue)
                                ]
                            }))
                        }
                    />
                </Scroll>
            </Grid>
            <RentalDialog
                open={open}
                setOpen={setOpen}
                rental={rentals.find(rental => rental.id === selected) ?? null}
                refetchList={refetch}
            />
        </>
    );
}