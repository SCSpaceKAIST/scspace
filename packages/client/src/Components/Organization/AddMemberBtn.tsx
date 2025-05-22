import { Dialog, DialogBackdrop, Button, IconButton, Portal, Fieldset, Field, HStack, PinInput, Stack, Text, Flex, VStack, Wrap } from "@chakra-ui/react";
import { useStudent } from "@scspace-client/Hooks/user";
import { useEffect, useState } from "react";
import { HiPlus } from "react-icons/hi";
import { IUser } from "@scspace-depot/types/user";
import { HiMiniXMark } from "react-icons/hi2";
import { useOrganizationAPI } from "@scspace-client/Hooks/organization";

function NewMember({ user, unSelect }: {
    user: IUser;
    unSelect?: (id: number) => any
}) {
    return (
        <HStack
            borderWidth="1px"
            rounded="sm"
            padding={2}
            width="fit-content"
            textAlign="center"
        >
            <VStack gap={1}>
                <Text
                    margin={0}
                    padding={0}
                    fontSize="xl"
                    fontWeight="semibold"
                    width="fit-content"
                >
                    {user.nameKr}
                </Text>
                <Text margin={0} padding={0} color="fg.muted" fontSize="xs">
                    {user.studentNumber}
                </Text>
            </VStack>
            {unSelect && (
                <IconButton
                    variant="outline"
                    rounded="sm"
                    size="xs"
                    onClick={() => unSelect(user.studentNumber)}
                >
                    <HiMiniXMark />
                </IconButton>
            )}
        </HStack>
    );
}

export default function AddMemberBtn({ oid, refetch, disabled = false }: {
    disabled?: boolean;
    oid: number,
    refetch: () => any;
}) {
    const [value, setvalue] = useState<string[]>(["", "", "", "", "", "", "", "",]);
    const [sid, setSid] = useState<string>("");
    const [selected, setSelected] = useState<IUser[]>([]);
    const [isSelected, setIsSelected] = useState<{ [key: string]: boolean }>({});

    useEffect(() => apply(), [value]);

    function apply() {
        for (const v of value) if (!v) {
            setSid("");
            return;
        }
        setSid(value.join(""));
    }

    const { student } = useStudent({ studentNumber: sid });

    function unSelect(sn: number) {
        setSelected((s) => s.filter((_s) => _s.studentNumber !== sn));
        setIsSelected((s) => {
            const obj = { ...s };
            obj[sn.toString()] = false;
            return obj
        });
    }

    const addOrganizationMember = useOrganizationAPI({ id: oid }).addMember;

    function save() {
        for (const s of selected) {
            console.log(addOrganizationMember({ userId: s.id, }));
        }
    }

    return (
        <Dialog.Root size="xl"
            onOpenChange={() => {
                console.log(1)
                setvalue(["", "", "", "", "", "", "", "",]);
                setSid("");
                setSelected([]);
                setIsSelected({});
            }}
            onExitComplete={refetch}
        >
            <Dialog.Trigger asChild>
                <IconButton size="sm" variant="outline" rounded="sm"
                    disabled={disabled}
                >
                    <HiPlus color="gray" />
                </IconButton>
            </Dialog.Trigger>
            <Portal>
                <DialogBackdrop zIndex={1500} />
                <Dialog.Positioner zIndex={1600}
                    onKeyDown={(e) => {
                        if ((e.key === "Enter") && student && !isSelected[student.studentNumber.toString()]) {
                            setSelected((s) => [...s, student]);
                            console.log(selected, isSelected);
                            setIsSelected((s) => {
                                const obj = { ...s, };
                                obj[student.studentNumber.toString()] = true;
                                return obj
                            })
                        }
                    }}
                >
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>
                                Add Member
                            </Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            <Fieldset.Root>
                                <Field.Root>
                                    <Field.Label width="100%">
                                        <Flex margin={0} padding={0} width="100%" justifyContent="space-between">
                                            <Text margin={0} padding={0}>
                                                Search Student (by Student Number)
                                            </Text>
                                            <Text margin={0} padding={0}>
                                                {'Press "ENTER" to select student'}
                                            </Text>
                                        </Flex>
                                    </Field.Label>
                                    <VStack width="100%" py={2} borderWidth="1px" rounded="sm" gap={4}>
                                        <PinInput.Root
                                            size="lg" placeholder="-"
                                            value={value} onValueChange={(e) => setvalue(e.value)}
                                        >
                                            <PinInput.HiddenInput />
                                            <PinInput.Control width="100%" justifyContent="space-between">
                                                {Array.from({ length: 8 }).map((_, i) => (
                                                    <PinInput.Input
                                                        textStyle="xl"
                                                        fontWeight="semibold"
                                                        key={i}
                                                        index={i}
                                                    />
                                                ))}
                                            </PinInput.Control>
                                        </PinInput.Root>
                                        {(student) && (
                                            <NewMember
                                                user={student}
                                            />
                                        )}
                                    </VStack>
                                    <Field.HelperText>
                                        <Stack gap={0}>
                                            <Text margin={0} padding={0}>
                                                {"Please make sure you enter student number correctly."}
                                            </Text>
                                            <Text margin={0} padding={0}>
                                                {"If a student has never logged in to the site, they won't be found."}
                                            </Text>
                                        </Stack>
                                    </Field.HelperText>
                                </Field.Root>
                                <Field.Root>
                                    <Field.Label>
                                        Selected Sturents
                                    </Field.Label>
                                    <Wrap>
                                        {selected.map((m) => (
                                            <NewMember
                                                key={m.studentNumber}
                                                user={m}
                                                unSelect={unSelect}
                                            />
                                        ))}
                                    </Wrap>
                                </Field.Root>
                            </Fieldset.Root>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Dialog.ActionTrigger>
                                <Button
                                    rounded="sm"
                                    onClick={save}
                                >
                                    Add
                                </Button>
                            </Dialog.ActionTrigger>
                            <Dialog.ActionTrigger asChild>
                                <Button variant="outline" rounded="sm">
                                    Cancel
                                </Button>
                            </Dialog.ActionTrigger>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root >
    );
}