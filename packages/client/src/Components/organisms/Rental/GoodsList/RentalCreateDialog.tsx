"use client"

import { 
    Dialog, 
    Portal, 
    Button, 
    VStack, 
    Input, 
    Textarea, 
    PinInput, 
    useBreakpointValue,
    Field,
    Fieldset,
    Text,
    Stack,
    HStack,
    Center
} from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import SelectComponent, { ISelectOption } from "@scspace-client/Components/molecules/forms/Select";
import { useAuth } from "@scspace-client/Hooks/auth";
import { useStudent } from "@scspace-client/Hooks/user";
import { useOrganizationAPI } from "@scspace-client/Hooks/organization";
import { useRentalAPI } from "@scspace-client/Hooks/rental";
import { toaster } from "@scspace-client/Components/atoms/Toaster";
import { IRentalCreateClient } from "@scspace-depot/types/rental/rental.type";
import { IGoods } from "@scspace-depot/types/rental";
import { useState, useEffect } from "react";
import { OrganizationStatusEnum } from "@scspace-depot/enums/organization.enum";
import Counter from "./Counter";

export default function RentalCreateDialog({ 
    item, 
    refetchAction,
    countAvailable,
}: { 
    item: IGoods; 
    refetchAction: () => void; 
    countAvailable: number;
}) {
    const dialogSize = useBreakpointValue<"full" | "md">({ base: "full", md: "md" });
    const [open, setOpen] = useState(false);

    const [studentNumberValue, setStudentNumberValue] = useState<string[]>(["", "", "", "", "", "", "", ""]);
    const [studentNumberStr, setStudentNumberStr] = useState<string>("");
    const [borrowerId, setBorrowerId] = useState<number | null>(null);

    const [organizationId, setOrganizationId] = useState<number>(1);
    const [orgOptions, setOrgOptions] = useState<ISelectOption[]>([]);

    const [phoneNumber, setPhoneNumber] = useState<string>("");
    const [emergencyContactPresident, setEmergencyContactPresident] = useState<string>("");
    const [emergencyContactVP, setEmergencyContactVP] = useState<string>("");

    const [reasonLocation, setReasonLocation] = useState<string>("");
    const [reasonPurpose, setReasonPurpose] = useState<string>("");

    const [deadline, setDeadline] = useState<Date>(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));

    const [count, setCount] = useState<number>(1);
    const maxCount = countAvailable;

    const { userInfo } = useAuth();
    const { student } = useStudent({ studentNumber: studentNumberStr });
    const { data: userOrganizations } = useOrganizationAPI({ uid: userInfo?.id ?? -1 }).userOrganizations;
    const { createRental } = useRentalAPI();

    useEffect(() => {
        const allFilled = studentNumberValue.every(v => v !== "");
        if (allFilled) {
            setStudentNumberStr(studentNumberValue.join(""));
        }
    }, [studentNumberValue]);

    useEffect(() => {
        if (student) {
            setBorrowerId(student.id);
        } else {
            setBorrowerId(null);
        }
    }, [student]);

    useEffect(() => {
        const options: ISelectOption[] = [
            { label: "개인 (Individual)", value: "1", description: "개인 대여" }
        ];
        
        if (userOrganizations && userOrganizations.length > 0) {
            userOrganizations
                .filter((org) => (
                    org.status !== OrganizationStatusEnum.REJECTED &&
                    org.status !== OrganizationStatusEnum.REGISTER_REQUEST
                ))
                .forEach((org) => {
                options.push({
                    label: org.name,
                    value: org.id.toString(),
                    description: "Delegator: " + org.delegator.nameKr
                });
                });
        }

        setOrgOptions(options);
    }, [userOrganizations]);

    const resetForm = () => {
        setStudentNumberValue(["", "", "", "", "", "", "", ""]);
        setStudentNumberStr("");
        setBorrowerId(null);
        setOrganizationId(1);
        setPhoneNumber("");
        setEmergencyContactPresident("");
        setEmergencyContactVP("");
        setReasonLocation("");
        setReasonPurpose("");
        setDeadline(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
        setCount(1);
    };

    const handleSubmit = () => {
        if (!borrowerId) {
            toaster.error({ title: "대여자를 선택해주세요", description: "학번을 입력하여 대여자를 검색해주세요" });
            return;
        }
        if (!organizationId) {
            toaster.error({ title: "단체를 선택해주세요" });
            return;
        }
        if (!phoneNumber || phoneNumber.trim() === "") {
            toaster.error({ title: "전화번호를 입력해주세요" });
            return;
        }
        if (!emergencyContactPresident || emergencyContactPresident.trim() === "") {
            toaster.error({ title: "비상연락처(회장)를 입력해주세요" });
            return;
        }
        if (!emergencyContactVP || emergencyContactVP.trim() === "") {
            toaster.error({ title: "비상연락처(부회장)를 입력해주세요" });
            return;
        }
        if (!reasonLocation || reasonLocation.trim() === "") {
            toaster.error({ title: "사용 위치를 입력해주세요" });
            return;
        }
        if (!reasonPurpose || reasonPurpose.trim() === "") {
            toaster.error({ title: "사용 목적을 입력해주세요" });
            return;
        }
        if (!deadline) {
            toaster.error({ title: "반납 기한을 선택해주세요" });
            return;
        }
        if (count <= 0 || count > maxCount) {
            toaster.error({ title: "올바른 수량을 입력해주세요", description: `1부터 ${maxCount}까지 입력 가능합니다` });
            return;
        }

        const payload: IRentalCreateClient = {
            userId: borrowerId,
            organizationId,
            goodsId: item.id,
            count,
        };

        toaster.promise(
            createRental(payload, {
                onSuccess: () => {
                    resetForm();
                    setOpen(false);
                    refetchAction();
                },
                onError: (error) => {
                    console.error('Failed to create rental:', error);
                }
            }),
            {
                loading: {
                    title: "대여 신청 중...",
                    description: "잠시만 기다려주세요",
                },
                success: {
                    title: "대여 신청 완료!",
                    description: "대여가 성공적으로 신청되었습니다",
                },
                error: {
                    title: "대여 신청 실패",
                    description: "다시 시도해주세요"
                }
            }
        );
    };

    return (
        <Dialog.Root 
            open={open}
            onOpenChange={(e) => {
                setOpen(e.open);
                if (!e.open) resetForm();
            }}
            placement="center" 
            scrollBehavior="inside" 
            size={dialogSize}
        >
            <Dialog.Trigger asChild>
                <Button variant="outline" width="fit-content">
                    대여 신청
                </Button>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>대여 신청</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            <VStack gap={4} alignItems="stretch">
                                <Fieldset.Root>
                                    <Field.Root>
                                        <Field.Label>대여자 (학번으로 검색)</Field.Label>
                                        <VStack width="100%" py={2} borderWidth="1px" rounded="sm" gap={4}>
                                            <PinInput.Root
                                                size="lg" 
                                                placeholder="-"
                                                value={studentNumberValue} 
                                                onValueChange={(e) => setStudentNumberValue(e.value)}
                                            >
                                                <PinInput.HiddenInput />
                                                <PinInput.Control width="100%" justifyContent="space-between">
                                                    {Array.from({ length: 8 }).map((_, i) => (
                                                        <PinInput.Input
                                                            textStyle="xl"
                                                            fontWeight="semibold"
                                                            key={i}
                                                            index={i}
                                                            padding={0}
                                                        />
                                                    ))}
                                                </PinInput.Control>
                                            </PinInput.Root>
                                            {student && (
                                                <HStack
                                                    borderWidth="1px"
                                                    rounded="sm"
                                                    padding={2}
                                                    width="fit-content"
                                                >
                                                    <Stack gap={1}>
                                                        <Text fontSize="lg" fontWeight="semibold">
                                                            {student.nameKr}
                                                        </Text>
                                                        <Text color="fg.muted" fontSize="xs">
                                                            {student.studentNumber}
                                                        </Text>
                                                    </Stack>
                                                </HStack>
                                            )}
                                        </VStack>
                                        <Field.HelperText>
                                            8자리 학번을 입력하여 대여자를 검색해주세요
                                        </Field.HelperText>
                                    </Field.Root>
                                </Fieldset.Root>

                                <SelectComponent
                                    inDialog={true}
                                    label="단체"
                                    optionList={orgOptions}
                                    defaultValue="1"
                                    onChange={(option) => setOrganizationId(parseInt(option.value))}
                                />

                                <Field.Root>
                                    <Field.Label>전화번호</Field.Label>
                                    <Input
                                        type="tel"
                                        placeholder="010-1234-5678"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        rounded="sm"
                                        bg="white"
                                    />
                                </Field.Root>

                                <Field.Root>
                                    <Field.Label>비상연락처 (회장)</Field.Label>
                                    <Input
                                        type="tel"
                                        placeholder="010-1234-5678"
                                        value={emergencyContactPresident}
                                        onChange={(e) => setEmergencyContactPresident(e.target.value)}
                                        rounded="sm"
                                        bg="white"
                                    />
                                </Field.Root>

                                <Field.Root>
                                    <Field.Label>비상연락처 (부회장)</Field.Label>
                                    <Input
                                        type="tel"
                                        placeholder="010-1234-5678"
                                        value={emergencyContactVP}
                                        onChange={(e) => setEmergencyContactVP(e.target.value)}
                                        rounded="sm"
                                        bg="white"
                                    />
                                </Field.Root>

                                <Field.Root>
                                    <Field.Label>사용 위치</Field.Label>
                                    <Input
                                        placeholder="예: 학생회관 1층"
                                        value={reasonLocation}
                                        onChange={(e) => setReasonLocation(e.target.value)}
                                        rounded="sm"
                                        bg="white"
                                    />
                                </Field.Root>

                                <Field.Root>
                                    <Field.Label>사용 목적</Field.Label>
                                    <Textarea
                                        placeholder="물품을 사용하는 이유를 입력해주세요"
                                        value={reasonPurpose}
                                        onChange={(e) => setReasonPurpose(e.target.value)}
                                        rounded="sm"
                                        bg="white"
                                        rows={3}
                                    />
                                </Field.Root>

                                <Field.Root>
                                    <Field.Label>반납 기한</Field.Label>
                                    <Center borderWidth="1px" rounded="sm" py={2}>
                                        <DatePicker
                                            selected={deadline}
                                            onChange={(date) => {
                                                if (date) setDeadline(date);
                                            }}
                                            inline
                                            minDate={new Date()}
                                        />
                                    </Center>
                                </Field.Root>

                                <Field.Root>
                                    <Field.Label>대여 물품</Field.Label>
                                    <Input
                                        value={item.name}
                                        readOnly
                                        disabled
                                        rounded="sm"
                                        bg="gray.100"
                                    />
                                </Field.Root>

                                <Field.Root>
                                    <Field.Label>수량</Field.Label>
                                    <Counter count={count} setCount={setCount} min={1} max={maxCount} />
                                    <Field.HelperText>
                                        최대 {maxCount}개까지 대여 가능합니다
                                    </Field.HelperText>
                                </Field.Root>
                            </VStack>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Dialog.ActionTrigger asChild>
                                <Button variant="outline" rounded="sm">
                                    취소
                                </Button>
                            </Dialog.ActionTrigger>
                            <Button 
                                onClick={handleSubmit} 
                                rounded="sm"
                                colorPalette="blue"
                            >
                                신청
                            </Button>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}
