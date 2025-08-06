"use client"

import React, { useState } from "react";
import { useAuth } from "@scspace-client/Hooks/auth";
import {
    Stack,
    Button,
    Text,
    Card,
    Input,
    Fieldset,
    Field,
    Alert,
    Dialog,
    HStack,
    Table,
    IconButton,
    Box
} from "@chakra-ui/react";
import { HiPencilSquare, HiPlus } from "react-icons/hi2";
import { useLotteryInfo, useLotteryAPI } from "@scspace-client/Hooks/lottery";
import { ILotteryInfo, ILotteryInfoCreate, ILotteryInfoUpdate } from "@scspace-depot/types/lottery/lottery.info.type";
import Scroll from "@scspace-client/Components/molecules/page/Scroll";
import LoadingComponent from "@scspace-client/Components/atoms/Loading";
import { useDate } from "@scspace-client/Hooks/utils";

interface LotteryInfoForm {
    timeLotteryStart: string;
    timeLotteryEnd: string;
    timeStart: string;
    timeEnd: string;
}

export default function LotteryManagement() {
    const { needAdmin } = useAuth();
    needAdmin();

    const { } = useDate();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedLottery, setSelectedLottery] = useState<ILotteryInfo | null>(null);
    const [formData, setFormData] = useState<LotteryInfoForm>({
        timeLotteryStart: "",
        timeLotteryEnd: "",
        timeStart: "",
        timeEnd: ""
    });

    const { lotteryInfos, isLoading, refetch } = useLotteryInfo();
    const { createLotteryInfo, updateLotteryInfo } = useLotteryAPI();

    const formatTimestamp = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleString('ko-KR');
    };

    const convertFormToTimestamp = (form: LotteryInfoForm): ILotteryInfoCreate => ({
        timeLotteryStart: Math.floor(new Date(form.timeLotteryStart).getTime() / 1000),
        timeLotteryEnd: Math.floor(new Date(form.timeLotteryEnd).getTime() / 1000),
        timeStart: Math.floor(new Date(form.timeStart).getTime() / 1000),
        timeEnd: Math.floor(new Date(form.timeEnd).getTime() / 1000),
    });

    const convertTimestampToForm = (lottery: ILotteryInfo): LotteryInfoForm => ({
        timeLotteryStart: new Date(lottery.timeLotteryStart * 1000).toISOString().slice(0, 16),
        timeLotteryEnd: new Date(lottery.timeLotteryEnd * 1000).toISOString().slice(0, 16),
        timeStart: new Date(lottery.timeStart * 1000).toISOString().slice(0, 16),
        timeEnd: new Date(lottery.timeEnd * 1000).toISOString().slice(0, 16),
    });

    const handleCreateSubmit = async () => {
        try {
            const lotteryData = convertFormToTimestamp(formData);
            await createLotteryInfo.mutateAsync({ lotteryInfo: lotteryData });
            setIsCreateModalOpen(false);
            setFormData({
                timeLotteryStart: "",
                timeLotteryEnd: "",
                timeStart: "",
                timeEnd: ""
            });
            refetch();
        } catch (error) {
            console.error("Failed to create lottery info:", error);
        }
    };

    const handleEditSubmit = async () => {
        if (!selectedLottery) return;

        try {
            const updateData = convertFormToTimestamp(formData);
            await updateLotteryInfo(selectedLottery.id, updateData);
            setIsEditModalOpen(false);
            setSelectedLottery(null);
            refetch();
        } catch (error) {
            console.error("Failed to update lottery info:", error);
        }
    };

    const openEditModal = (lottery: ILotteryInfo) => {
        setSelectedLottery(lottery);
        setFormData(convertTimestampToForm(lottery));
        setIsEditModalOpen(true);
    };

    const openCreateModal = () => {
        setFormData({
            timeLotteryStart: "",
            timeLotteryEnd: "",
            timeStart: "",
            timeEnd: ""
        });
        setIsCreateModalOpen(true);
    };

    return (
        <Scroll>
            {isLoading ? (<LoadingComponent />) : (
                <Stack gap={6}>
                    <HStack justify="space-between">
                        <Text fontSize="2xl" fontWeight="bold">세미나실 추첨 정보 관리</Text>
                        <Button
                            colorScheme="blue"
                            onClick={openCreateModal}
                        >
                            <HiPlus />
                            새 추첨 정보 추가
                        </Button>
                    </HStack>

                    <Card.Root>
                        <Card.Body>
                            {!lotteryInfos || lotteryInfos.length === 0 ? (
                                <Alert.Root status="info">
                                    <Alert.Indicator />
                                    <Alert.Title>등록된 추첨 정보가 없습니다.</Alert.Title>
                                </Alert.Root>
                            ) : (
                                <Box overflowX="auto">
                                    <Table.Root size="sm" variant="outline">
                                        <Table.Header>
                                            <Table.Row>
                                                <Table.ColumnHeader>ID</Table.ColumnHeader>
                                                <Table.ColumnHeader>추첨 시작 시간</Table.ColumnHeader>
                                                <Table.ColumnHeader>추첨 종료 시간</Table.ColumnHeader>
                                                <Table.ColumnHeader>행사 시작 시간</Table.ColumnHeader>
                                                <Table.ColumnHeader>행사 종료 시간</Table.ColumnHeader>
                                                <Table.ColumnHeader>작업</Table.ColumnHeader>
                                            </Table.Row>
                                        </Table.Header>
                                        <Table.Body>
                                            {lotteryInfos.map((lottery) => (
                                                <Table.Row key={lottery.id}>
                                                    <Table.Cell>{lottery.id}</Table.Cell>
                                                    <Table.Cell>{formatTimestamp(lottery.timeLotteryStart)}</Table.Cell>
                                                    <Table.Cell>{formatTimestamp(lottery.timeLotteryEnd)}</Table.Cell>
                                                    <Table.Cell>{formatTimestamp(lottery.timeStart)}</Table.Cell>
                                                    <Table.Cell>{formatTimestamp(lottery.timeEnd)}</Table.Cell>
                                                    <Table.Cell>
                                                        <HStack gap={2}>
                                                            <IconButton
                                                                size="sm"
                                                                colorScheme="blue"
                                                                variant="outline"
                                                                onClick={() => openEditModal(lottery)}
                                                            >
                                                                <HiPencilSquare />
                                                            </IconButton>
                                                        </HStack>
                                                    </Table.Cell>
                                                </Table.Row>
                                            ))}
                                        </Table.Body>
                                    </Table.Root>
                                </Box>
                            )}
                        </Card.Body>
                    </Card.Root>

                    {/* Create Modal */}
                    <Dialog.Root open={isCreateModalOpen} onOpenChange={(e) => setIsCreateModalOpen(e.open)}>
                        <Dialog.Backdrop />
                        <Dialog.Positioner>
                            <Dialog.Content>
                                <Dialog.Header>
                                    <Dialog.Title>새 추첨 정보 추가</Dialog.Title>
                                </Dialog.Header>
                                <Dialog.Body>
                                    <Stack gap={4}>
                                        <Fieldset.Root>
                                            <Field.Root>
                                                <Field.Label>추첨 시작 시간</Field.Label>
                                                <Input
                                                    type="datetime-local"
                                                    value={formData.timeLotteryStart}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, timeLotteryStart: e.target.value }))}
                                                />
                                            </Field.Root>
                                        </Fieldset.Root>

                                        <Fieldset.Root>
                                            <Field.Root>
                                                <Field.Label>추첨 종료 시간</Field.Label>
                                                <Input
                                                    type="datetime-local"
                                                    value={formData.timeLotteryEnd}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, timeLotteryEnd: e.target.value }))}
                                                />
                                            </Field.Root>
                                        </Fieldset.Root>

                                        <Fieldset.Root>
                                            <Field.Root>
                                                <Field.Label>행사 시작 시간</Field.Label>
                                                <Input
                                                    type="datetime-local"
                                                    value={formData.timeStart}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, timeStart: e.target.value }))}
                                                />
                                            </Field.Root>
                                        </Fieldset.Root>

                                        <Fieldset.Root>
                                            <Field.Root>
                                                <Field.Label>행사 종료 시간</Field.Label>
                                                <Input
                                                    type="datetime-local"
                                                    value={formData.timeEnd}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, timeEnd: e.target.value }))}
                                                />
                                            </Field.Root>
                                        </Fieldset.Root>
                                    </Stack>
                                </Dialog.Body>
                                <Dialog.Footer>
                                    <Dialog.CloseTrigger asChild>
                                        <Button variant="outline">취소</Button>
                                    </Dialog.CloseTrigger>
                                    <Button
                                        colorScheme="blue"
                                        onClick={handleCreateSubmit}
                                        loading={createLotteryInfo.isPending}
                                    >
                                        추가
                                    </Button>
                                </Dialog.Footer>
                            </Dialog.Content>
                        </Dialog.Positioner>
                    </Dialog.Root>

                    {/* Edit Modal */}
                    <Dialog.Root open={isEditModalOpen} onOpenChange={(e) => setIsEditModalOpen(e.open)}>
                        <Dialog.Backdrop />
                        <Dialog.Positioner>
                            <Dialog.Content>
                                <Dialog.Header>
                                    <Dialog.Title>추첨 정보 수정</Dialog.Title>
                                </Dialog.Header>
                                <Dialog.Body>
                                    <Stack gap={4}>
                                        <Fieldset.Root>
                                            <Field.Root>
                                                <Field.Label>추첨 시작 시간</Field.Label>
                                                <Input
                                                    type="datetime-local"
                                                    value={formData.timeLotteryStart}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, timeLotteryStart: e.target.value }))}
                                                />
                                            </Field.Root>
                                        </Fieldset.Root>

                                        <Fieldset.Root>
                                            <Field.Root>
                                                <Field.Label>추첨 종료 시간</Field.Label>
                                                <Input
                                                    type="datetime-local"
                                                    value={formData.timeLotteryEnd}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, timeLotteryEnd: e.target.value }))}
                                                />
                                            </Field.Root>
                                        </Fieldset.Root>

                                        <Fieldset.Root>
                                            <Field.Root>
                                                <Field.Label>행사 시작 시간</Field.Label>
                                                <Input
                                                    type="datetime-local"
                                                    value={formData.timeStart}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, timeStart: e.target.value }))}
                                                />
                                            </Field.Root>
                                        </Fieldset.Root>

                                        <Fieldset.Root>
                                            <Field.Root>
                                                <Field.Label>행사 종료 시간</Field.Label>
                                                <Input
                                                    type="datetime-local"
                                                    value={formData.timeEnd}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, timeEnd: e.target.value }))}
                                                />
                                            </Field.Root>
                                        </Fieldset.Root>
                                    </Stack>
                                </Dialog.Body>
                                <Dialog.Footer>
                                    <Dialog.CloseTrigger asChild>
                                        <Button variant="outline">취소</Button>
                                    </Dialog.CloseTrigger>
                                    <Button
                                        colorScheme="blue"
                                        onClick={handleEditSubmit}
                                    >
                                        수정
                                    </Button>
                                </Dialog.Footer>
                            </Dialog.Content>
                        </Dialog.Positioner>
                    </Dialog.Root>
                </Stack>
            )}
        </Scroll>
    );
}
