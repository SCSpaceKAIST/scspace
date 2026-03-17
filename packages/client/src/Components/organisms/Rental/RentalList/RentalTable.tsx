"use client"

import {
    Badge,
    Flex,
    Text,
    Grid,
    Stack,
    useBreakpointValue,
    Tabs
} from "@chakra-ui/react";
import { useEffect, useState, } from "react";

import { dateUtils } from "@scspace-client/Hooks/utils";
import SimpleTable from "@scspace-client/Components/atoms/SimpleTable";
import Scroll from "@scspace-client/Components/molecules/page/Scroll";
import { IRentalAll } from "@scspace-depot/types/rental";
import RefetchBtn from "@scspace-client/Components/molecules/buttons/RefetchBtn";
import RentalDialog from "./RentalDialog";
import { RentalStatusEnum } from "@scspace-depot/enums/rental.enum";
import { useUserInfo } from "@scspace-client/Hooks/user";

function RentalStatusBadge({ rental, now }: { rental: IRentalAll; now: number; }) {
    if (rental.status === RentalStatusEnum.RETURNED) {
        return <Badge colorPalette="green">반납 완료</Badge>;
    }
    if (rental.timeReturn !== 0) {
        return <Badge colorPalette="yellow">반납 요청</Badge>;
    }
    if (rental.timeDue < now) {
        return <Badge colorPalette="red">연체</Badge>;
    }
    return <Badge colorPalette="blue">대여 중</Badge>;
}

function ApproverSummary({ rental }: { rental: IRentalAll; }) {
    const { userInfo: rentalWorker } = useUserInfo({ uid: rental.rentalWorkerId });
    const { userInfo: returnWorker } = useUserInfo({ uid: rental.returnWorkerId || 0 });

    return (
        <Stack gap={0}>
            <Text>{rentalWorker ? rentalWorker.nameKr : `#${rental.rentalWorkerId}`}</Text>
            <Text fontSize="xs" color="fg.muted">
                {rental.returnWorkerId === 0
                    ? "반납 승인자 미정"
                    : `반납 승인: ${returnWorker ? returnWorker.nameKr : `#${rental.returnWorkerId}`}`}
            </Text>
        </Stack>
    );
}

export default function RentalTable({
    disabled,
    rentals,
    refetchAction,
    helperText,
    showTabs,
    mode = "default",
}: {
    helperText?: string;
    disabled?: boolean;
    rentals: IRentalAll[];
    refetchAction: () => void;
    showTabs?: boolean;
    mode?: "default" | "user";
}) {
    const [selected, setSelected] = useState<number | null>(null);

    const [open, setOpen] = useState<boolean>(false);

    const { getString } = dateUtils();

    const isWide = useBreakpointValue({ base: false, md: true });

    const RENTAL_STATE = {
        ALL: "all",
        ON_RENT: "on rent",
        OVERDUE: "overdue",
        RETURNED: "returned",
        CONFIRMED: "confirmed"
    };

    const [tab, setTab] = useState<string>(RENTAL_STATE.ALL);

    const { getTime } = dateUtils();
    const [now, setNow] = useState<number>(0);

    useEffect(() => {
        setNow(getTime(new Date()));
    }, []);

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
                                <Tabs.Trigger value={RENTAL_STATE.ALL}>
                                    All
                                </Tabs.Trigger>
                                <Tabs.Trigger value={RENTAL_STATE.ON_RENT}>
                                    On Rent
                                </Tabs.Trigger>
                                <Tabs.Trigger value={RENTAL_STATE.OVERDUE}>
                                    Overdue
                                </Tabs.Trigger>
                                <Tabs.Trigger value={RENTAL_STATE.RETURNED}>
                                    Returned
                                </Tabs.Trigger>
                                <Tabs.Trigger value={RENTAL_STATE.CONFIRMED}>
                                    Confirmed
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
                    <RefetchBtn refetch={refetchAction} />
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
                            mode === "user" ? "Goods / Organization" : "Goods Name",
                            mode === "user" ? "Status" : "Count",
                            "Borrowed At",
                            mode === "user" ? "Approver" : "Return Due"
                        ]}
                        content={rentals
                            .filter(rental => {
                                switch (tab) {
                                    case RENTAL_STATE.ALL:
                                        return true;
                                    case RENTAL_STATE.CONFIRMED:
                                        return rental.status === RentalStatusEnum.RETURNED;
                                    case RENTAL_STATE.RETURNED:
                                        return rental.timeReturn !== 0 && rental.status !== RentalStatusEnum.RETURNED;
                                    case RENTAL_STATE.OVERDUE:
                                        return rental.timeDue < now && rental.timeReturn === 0 && rental.status === RentalStatusEnum.RENTED;
                                    default:
                                        return rental.timeReturn === 0 && rental.status === RentalStatusEnum.RENTED;
                                }
                            })
                            .map((rental: IRentalAll) => ({
                                id: rental.id,
                                rowBg: (rental.timeDue < now && rental.timeReturn === 0 && rental.status === RentalStatusEnum.RENTED)
                                    ? "orange.50"
                                    : undefined,
                                row: [
                                    mode === "user" ? (
                                        <Stack gap={0}>
                                            <Text>{rental.goods.name}</Text>
                                            <Text fontSize="xs" color="fg.muted">{rental.organization.name}</Text>
                                        </Stack>
                                    ) : rental.goods.name,
                                    mode === "user" ? (
                                        <RentalStatusBadge rental={rental} now={now} />
                                    ) : rental.count,
                                    getString(rental.timeBorrow),
                                    mode === "user" ? (
                                        <ApproverSummary rental={rental} />
                                    ) : getString(rental.timeDue)
                                ]
                            }))
                        }
                    />
                </Scroll>
            </Grid>
            <RentalDialog
                open={open}
                setOpenAction={setOpen}
                rental={rentals.find(rental => rental.id === selected) ?? null}
                refetchListAction={refetchAction}
            />
        </>
    );
}
