"use client"

import { Button, DataList, Flex, Heading, Mark, Spacer, Table, Text, useBreakpointValue } from "@chakra-ui/react";
import AlertBtn from "@scspace-client/Components/atoms/AlertBtn";
import DataListItem from "@scspace-client/Components/atoms/DataListItem";
import LoadingComponent from "@scspace-client/Components/atoms/Loading";
import Scroll from "@scspace-client/Components/molecules/page/Scroll";
import { PasspinHooks } from "@scspace-client/Hooks/passpin";
import { useAllSpace } from "@scspace-client/Hooks/space";
import { dateUtils } from "@scspace-client/Hooks/utils";
import { ISpace } from "@scspace-depot/types/space";
import { useState } from "react";
import { BlueMark, RedMark } from "../../Rules/utils";

export default function PasspinView() {
    const [selectedSpace, setSelectedSpace] = useState<ISpace | null>(null);

    const { data: passpinData, refetch: refetchPasspin } = PasspinHooks.usePasspin();
    const { changePasspin, deletePasspin } = PasspinHooks.usePasspinAPI();
    const { data: passpinHistory, refetch: refetchPasspinHistory } = PasspinHooks.usePasspinHistory(selectedSpace?.id ?? -1);

    const getString = dateUtils().getString;

    const { spaces } = useAllSpace();

    const isWide = useBreakpointValue({ base: false, md: true });

    if (!spaces || spaces.length === 0) return <LoadingComponent />;

    return (
        <Scroll>
            <Flex
                height={"full"}
                width={"full"}
                justify={"start"}
                position={"relative"}
            >
                <Table.ScrollArea
                    w="100%" h="100%" maxW="100%" maxH="100%"
                    scrollbar="hidden"
                    scrollBehavior="smooth"
                    width={(selectedSpace) ? (isWide ? "calc(100% - 28rem)" : "0") : "full"}
                    transition={"all"}
                    transitionDuration={"moderate"}
                    overflow={"auto"}
                    zIndex={10}
                >
                    <Table.Root
                        stickyHeader
                        interactive
                        colorPalette="cyan"
                        maxW="inherit"
                        tableLayout="fixed" // 테이블 레이아웃을 고정으로 설정
                    >
                        <Table.ColumnGroup>
                            <Table.Column htmlWidth={"50%"} />
                            <Table.Column htmlWidth={"50%"} />
                        </Table.ColumnGroup>
                        <Table.Header>
                            <Table.Row bg="bg.muted">
                                <Table.ColumnHeader truncate>
                                    Space Name
                                </Table.ColumnHeader>
                                <Table.ColumnHeader truncate>
                                    Passpin
                                </Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {spaces.map((s) => (
                                <Table.Row
                                    key={s.id}
                                    onClick={() => setSelectedSpace(s)}
                                    cursor="pointer"
                                >
                                    <Table.Cell truncate>
                                        {s.nameKr}
                                    </Table.Cell>
                                    <Table.Cell truncate>
                                        {passpinData?.find(p => p.spaceId === s.id)?.pin ?? (<Mark color={"gray"}>N/A</Mark>)}
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Root>
                </Table.ScrollArea>
                <Flex
                    w={isWide ? "28rem" : "full"}
                    h="full"
                    border={(selectedSpace) ? "1px" : "none"}
                    position={"absolute"}
                    right={0}
                    pl={4}
                    direction={"column"}
                    overflowY={"auto"}
                    scrollbar="hidden"
                    scrollBehavior="smooth"
                >
                    <Flex gap={2}>
                        <Heading>
                            {selectedSpace?.nameKr ?? "Select a space"}
                        </Heading>
                        <Spacer />
                        <Button
                            size={"xs"}
                            onClick={() => setSelectedSpace(null)}
                            variant={"outline"}
                        >
                            Close
                        </Button>
                        <Button
                            size={"xs"}
                            onClick={() => {
                                refetchPasspin();
                                refetchPasspinHistory();
                            }}
                            variant={"outline"}
                        >
                            Refetch All
                        </Button>
                    </Flex>
                    <DataList.Root flexGrow={1}>
                        <DataListItem label="Current Passpin">
                            <Flex w={"full"} gap={2} align={"center"}>
                                <Heading>
                                    {passpinData?.find(p => p.spaceId === (selectedSpace?.id ?? -1))?.pin ?? (<Mark color={"gray"}>N/A</Mark>)}
                                </Heading>
                                <Spacer />
                                <AlertBtn
                                    onClick={() => {
                                        deletePasspin({ spaceId: selectedSpace?.id ?? -1 }, {
                                            onSettled: () => {
                                                refetchPasspin();
                                                refetchPasspinHistory();
                                            },
                                        });
                                    }}
                                    dialogTitle="비밀번호 삭제 확인"
                                    dialogBody={
                                        <>
                                            <Text>비밀번호를 삭제하시겠습니까?</Text>
                                            <br />
                                            <Text>본 작업은 <BlueMark>도어락 앞</BlueMark>에서만 실행하시길 바랍니다.</Text>
                                            <Text>또한 <RedMark>즉시 비밀번호를 삭제</RedMark> 바랍니다.</Text>
                                        </>
                                    }
                                >
                                    <Button
                                        size={"xs"}
                                        colorPalette={"red"}
                                        variant={"outline"}
                                    >
                                        Clear Pin
                                    </Button>
                                </AlertBtn>
                                <AlertBtn
                                    onClick={() => {
                                        changePasspin({ spaceId: selectedSpace?.id ?? -1 }, {
                                            onSettled: () => {
                                                refetchPasspin();
                                                refetchPasspinHistory();
                                            },
                                        });
                                    }}
                                    dialogTitle="비밀번호 변경 확인"
                                    dialogBody={
                                        <>
                                            <Text>새로운 비밀번호를 생성하시겠습니까?</Text>
                                            <br />
                                            <Text>본 작업은 <BlueMark>도어락 앞</BlueMark>에서만 실행하시길 바랍니다.</Text>
                                            <Text>또한 생성된 비밀번호로 <RedMark>즉시 교체</RedMark> 바랍니다.</Text>
                                        </>
                                    }
                                >
                                    <Button
                                        size={"xs"}
                                        colorPalette={"red"}
                                    >
                                        Change Pin
                                    </Button>
                                </AlertBtn>
                            </Flex>
                        </DataListItem>
                        <DataListItem label="Passpin History">
                            <Table.ScrollArea
                                w="full" h="full" maxW="full" maxH="full"
                                scrollbar="hidden"
                                scrollBehavior="smooth"
                                overflow={"auto"}
                            >
                                <Table.Root
                                    stickyHeader
                                    interactive
                                    colorPalette="cyan"
                                    maxW="inherit"
                                    tableLayout="fixed" // 테이블 레이아웃을 고정으로 설정
                                >
                                    <Table.ColumnGroup>
                                        <Table.Column htmlWidth={"50%"} />
                                        <Table.Column htmlWidth={"50%"} />
                                    </Table.ColumnGroup>
                                    <Table.Header>
                                        <Table.Row bg="bg.muted">
                                            <Table.ColumnHeader truncate>
                                                Passpin
                                            </Table.ColumnHeader>
                                            <Table.ColumnHeader truncate>
                                                Created At
                                            </Table.ColumnHeader>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        {passpinHistory?.map(p => (
                                            <Table.Row
                                                key={p.id}
                                                onClick={() => setSelectedSpace(null)}
                                                cursor="pointer"
                                            >
                                                <Table.Cell truncate>
                                                    {p.pin}
                                                </Table.Cell>
                                                <Table.Cell truncate>
                                                    {getString(p.timeCreated)}
                                                </Table.Cell>
                                            </Table.Row>
                                        )) ?? null}
                                    </Table.Body>
                                </Table.Root>
                            </Table.ScrollArea>
                        </DataListItem>
                    </DataList.Root>
                </Flex>
            </Flex>
        </Scroll>
        // <Box>
        //     {JSON.stringify(spaces, null, 2)}
        //     <Textarea
        //         autoresize
        //         value={JSON.stringify(passpinData, null, 2)}
        //         readOnly
        //     />
        //     <Textarea
        //         autoresize
        //         value={JSON.stringify(passpinHistory, null, 2)}
        //         readOnly
        //     />
        //     <Button onClick={() => {
        //         changePasspin({spaceId: 1 }, {
        //             onSettled: () => {
        //                 refetchPasspin();
        //                 refetchPasspinHistory();
        //             },
        //         });
        //     }}>Create & Refetch</Button>
        // </Box>
    );
};
