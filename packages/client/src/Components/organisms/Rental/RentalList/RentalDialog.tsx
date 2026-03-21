"use client"

import {
    Button,
    Dialog,
    Separator,
    IconButton,
    DataList,
    HStack,
    useBreakpointValue,
    Badge,
    Center,
    Input,
} from "@chakra-ui/react";
import LoadingComponent from "@scspace-client/Components/atoms/Loading";
import { HiOutlineRefresh } from "react-icons/hi";

import { useAuth } from "@scspace-client/Hooks/auth";
import { useUserInfo } from "@scspace-client/Hooks/user";
import { Dispatch, SetStateAction, } from "react";
import { useEffect, useMemo, useState } from "react";
import { dateUtils } from "@scspace-client/Hooks/utils";
import DataListItem from "@scspace-client/Components/atoms/DataListItem";
import SimpleDialog from "@scspace-client/Components/atoms/SimpleDialog";
import { IRentalAll } from "@scspace-depot/types/rental";
import ReturnBtn from "./ReturnBtn";
import ConfirmBtn from "./ConfirmBtn";
import Link from "next/link";
import { RentalStatusEnum } from "@scspace-depot/enums/rental.enum";
import { useGoodsAPI, useRentalAPI } from "@scspace-client/Hooks/rental";
import { getErrorMessage } from "@scspace-client/Hooks/error";
import { toaster } from "@scspace-client/Components/atoms/Toaster";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export default function RentalDialog({ open, setOpenAction, rental, refetchListAction }: {
    open: boolean;
    setOpenAction: Dispatch<SetStateAction<boolean>>;
    rental: IRentalAll | null;
    refetchListAction: () => any;
}) {
    const { isManager } = useAuth();
    const { getString, getDateString, getTime, timeUnit } = useMemo(() => dateUtils(), []);
    const { userInfo: rentalWorker } = useUserInfo({ uid: rental?.rentalWorkerId ?? undefined });
    const { userInfo: returnWorker } = useUserInfo({ uid: rental?.returnWorkerId ?? undefined });
    const { allGoods: { data: goodsList } } = useGoodsAPI();
    const updateRental = useRentalAPI({ id: rental?.id ?? -1 }).updateRental;

    const isWide = useBreakpointValue({ base: false, md: true });
    const [isEditMode, setIsEditMode] = useState(false);
    const [editGoodsId, setEditGoodsId] = useState<number>(rental?.goodsId ?? 0);
    const [editCount, setEditCount] = useState<number>(rental?.count ?? 1);
    const [editTimeDue, setEditTimeDue] = useState<string>("");

    useEffect(() => {
        setIsEditMode(false);
        setEditGoodsId(rental?.goodsId ?? 0);
        setEditCount(rental?.count ?? 1);
        setEditTimeDue(rental ? getDateString(rental.timeDue) : "");
    }, [rental, getDateString]);

    const selectedGoods = useMemo(
        () => goodsList?.find((goods) => goods.id === editGoodsId) ?? null,
        [editGoodsId, goodsList]
    );

    const handleSave = async () => {
        if (!rental) return;
        if (!editGoodsId || !editTimeDue || editCount <= 0) {
            toaster.error({ title: "수정 값을 다시 확인해주세요" });
            return;
        }

        const selectedAvailable = selectedGoods
            ? selectedGoods.countNow + (editGoodsId === rental.goodsId ? rental.count : 0)
            : 0;

        if (selectedAvailable < editCount) {
            toaster.error({ title: "재고가 부족합니다" });
            return;
        }

        const [year, month, day] = editTimeDue.split("-").map(Number);
        const nextDueDate = new Date(year, month - 1, day);
        const nextTimeDue = getTime(nextDueDate) + timeUnit.date - 1;

        try {
            await updateRental({
                goodsId: editGoodsId,
                count: editCount,
                timeDue: nextTimeDue,
            });
            refetchListAction();
            setIsEditMode(false);
            toaster.success({ title: "수정 완료", description: "대여 정보가 저장되었습니다" });
        } catch (error) {
            toaster.error({ title: "수정 실패", description: getErrorMessage(error) });
        }
    };

    const statusBadge = rental?.status === RentalStatusEnum.RETURNED ? (
        <Badge colorPalette="green">Returned</Badge>
    ) : (rental?.timeReturn !== 0 ? (
        <Badge colorPalette="yellow">Return Requested</Badge>
    ) : (
        <Badge colorPalette="blue">On Rent</Badge>
    ));

    return (
        <SimpleDialog
            open={open}
            setOpen={setOpenAction}
        >
            {rental ? (
                <>
                    <Dialog.Header>
                        <HStack>
                            <IconButton rounded="sm" variant="ghost" onClick={() => refetchListAction()} size="sm">
                                <HiOutlineRefresh color="gray" />
                            </IconButton>
                            <Dialog.Title>
                                {rental.goods.name} {"x"} {rental.count}
                            </Dialog.Title>
                            {isManager && (
                                <Button size="sm" variant="outline" onClick={() => setIsEditMode((current) => !current)}>
                                    {isEditMode ? "Cancel Edit" : "Edit"}
                                </Button>
                            )}
                        </HStack>
                    </Dialog.Header>
                    <Separator />
                    <Dialog.Body px={8} py={4}>
                        <DataList.Root orientation={isWide ? "horizontal" : "vertical"}>
                            <Center>
                                <HStack>
                                    <ReturnBtn
                                        refetch={refetchListAction}
                                        id={rental.id}
                                        disabled={rental.timeReturn !== 0}
                                    />
                                    {isManager && (rental.timeReturn !== 0) && (
                                        <ConfirmBtn
                                            refetchAction={refetchListAction}
                                            id={rental.id}
                                            disabled={rental.status === RentalStatusEnum.RETURNED}
                                        />
                                    )}
                                </HStack>
                            </Center>
                            <Separator />
                            <DataListItem label="Goods">
                                <DataList.Root
                                    orientation={isWide ? "horizontal" : "vertical"}
                                >
                                    <DataListItem label="Name">
                                        {isEditMode ? (
                                            <select
                                                value={editGoodsId.toString()}
                                                onChange={(event) => setEditGoodsId(parseInt(event.target.value, 10))}
                                                style={{
                                                    width: "100%",
                                                    border: "1px solid var(--chakra-colors-border)",
                                                    borderRadius: "0.375rem",
                                                    padding: "0.5rem 0.75rem",
                                                    background: "var(--chakra-colors-bg)",
                                                }}
                                            >
                                                {goodsList?.map((goods) => (
                                                    <option key={goods.id} value={goods.id.toString()}>
                                                        {goods.name}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            rental.goods.name
                                        )}
                                    </DataListItem>
                                    <DataListItem label="Description">
                                        {isEditMode ? (selectedGoods?.description ?? "-") : rental.goods.description}
                                    </DataListItem>
                                    <DataListItem label="# of rentals">
                                        {isEditMode ? (
                                            <Input type="number" min={1} value={editCount} onChange={(event) => setEditCount(parseInt(event.target.value, 10) || 1)} />
                                        ) : (
                                            rental.count
                                        )}
                                    </DataListItem>
                                </DataList.Root>
                            </DataListItem>
                            <Separator />
                            <DataListItem label="Info">
                                <DataList.Root
                                    orientation={isWide ? "horizontal" : "vertical"}
                                >
                                    <DataListItem label="Borrowed At">
                                        {getString(rental.timeBorrow)}
                                    </DataListItem>
                                    <DataListItem label="Return Due">
                                        {isEditMode ? (
                                            <Input type="date" value={editTimeDue} onChange={(event) => setEditTimeDue(event.target.value)} />
                                        ) : (
                                            getString(rental.timeDue)
                                        )}
                                    </DataListItem>
                                    <DataListItem label="Returned At">
                                        {rental.timeReturn === 0 ? (<Badge>Not Returned</Badge>) : getString(rental.timeReturn)}
                                    </DataListItem>
                                    <DataListItem label="Status">
                                        {statusBadge}
                                    </DataListItem>
                                    <DataListItem label="Usage Location">
                                        {rental.reasonLocation}
                                    </DataListItem>
                                    <DataListItem label="Usage Purpose">
                                        {rental.reasonPurpose}
                                    </DataListItem>
                                </DataList.Root>
                            </DataListItem>
                            <Separator />
                            <DataListItem label="User">
                                <DataList.Root
                                    orientation={isWide ? "horizontal" : "vertical"}
                                >
                                    <DataListItem label="Name">
                                        {rental.user.nameKr} ({rental.user.nameEn})
                                    </DataListItem>
                                    <DataListItem label="Student Number">
                                        {rental.user.studentNumber}
                                    </DataListItem>
                                    <DataListItem label="Email">
                                        {rental.user.email}
                                    </DataListItem>
                                    <DataListItem label="Phone Number">
                                        {rental.phoneNumber}
                                    </DataListItem>
                                </DataList.Root>
                            </DataListItem>
                            <Separator />
                            <DataListItem label="Contacts">
                                <DataList.Root
                                    orientation={isWide ? "horizontal" : "vertical"}
                                >
                                    <DataListItem label="President">
                                        {rental.emergencyContactPresident}
                                    </DataListItem>
                                    <DataListItem label="Vice President">
                                        {rental.emergencyContactVicePresident}
                                    </DataListItem>
                                </DataList.Root>
                            </DataListItem>
                            <Separator />
                            <DataListItem label="Organization">
                                <DataList.Root
                                    orientation={isWide ? "horizontal" : "vertical"}
                                >
                                    <DataListItem label="Name">
                                        {rental.organization.name}
                                    </DataListItem>
                                </DataList.Root>
                            </DataListItem>
                            <Separator />
                            <DataListItem label="SCSpace">
                                <DataList.Root
                                    orientation={isWide ? "horizontal" : "vertical"}
                                >
                                    <DataListItem label="Rental Approver">
                                        {rental.rentalWorkerId && rental.rentalWorkerId > 0
                                            ? (rentalWorker
                                                ? `${rentalWorker.nameKr}`
                                                : `승인자 정보 없음 (#${rental.rentalWorkerId})`)
                                            : "대여 승인자 미정"}
                                    </DataListItem>
                                    <DataListItem label="Return Approver">
                                        {!rental.returnWorkerId ? (
                                            <Badge>반납 승인자 미정</Badge>
                                        ) : (
                                            returnWorker
                                                ? `${returnWorker.nameKr}`
                                                : `승인자 정보 없음 (#${rental.returnWorkerId})`
                                        )}
                                    </DataListItem>
                                </DataList.Root>
                            </DataListItem>
                        </DataList.Root>
                    </Dialog.Body >
                    <Separator />
                    <Dialog.Footer>
                        <Link
                            href={`${baseUrl}/file/download?filename=${encodeURIComponent(rental?.certName)}&displayName=Rental_Confirmation_No${rental?.id}.pdf`}
                        >
                            <Button
                                variant={"outline"}
                                colorPalette={"blue"}
                                disabled={rental.status === RentalStatusEnum.RETURNED}
                                title={rental.status === RentalStatusEnum.RETURNED
                                    ? "Rental Certificaton was deleted upon rental completion"
                                    : undefined}
                            >
                                {rental.status === RentalStatusEnum.RETURNED ? "Certification Deleted" : "Download Certification"}
                            </Button>
                        </Link>
                        {isManager && isEditMode && (
                            <Button colorPalette="blue" onClick={handleSave}>
                                Save Changes
                            </Button>
                        )}
                        <Dialog.ActionTrigger asChild>
                            <Button variant="outline" rounded="sm">
                                Close
                            </Button>
                        </Dialog.ActionTrigger>
                    </Dialog.Footer>
                </>
            ) : (<LoadingComponent />)}
        </SimpleDialog >
    );
}
