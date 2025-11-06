"use client"

import { Badge, Flex, HStack, Icon, Table, Text, useBreakpointValue } from "@chakra-ui/react";
import { useLinkPush } from "@scspace-client/Hooks/api";
import { useArticleAPI } from "@scspace-client/Hooks/article";
import { dateUtils } from "@scspace-client/Hooks/utils";
import { ArticleStateEnum } from "@scspace-depot/enums/article.enum";
import { IArticleQuery } from "@scspace-depot/types/article";
import { useEffect } from "react";
import { AiOutlineEyeInvisible } from "react-icons/ai";

export default function ArticleTable({ refetchTrigger, query }: {
    refetchTrigger: number;
    query: IArticleQuery
}) {
    const { data, refetch } = useArticleAPI({ query }).articles;
    const { getString } = dateUtils();

    useEffect(() => {
        refetch();
    }, [refetchTrigger]);

    const { linkPush } = useLinkPush();

    const isWide = useBreakpointValue({ base: false, md: true });

    return (
        <Table.ScrollArea
            w="100%" h="100%" maxW="100%" maxH="100%"
            scrollbar="hidden"
            scrollBehavior="smooth"
        >
            <Table.Root
                stickyHeader
                interactive
                colorPalette="cyan"
                maxW="inherit"
                tableLayout="fixed" // 테이블 레이아웃을 고정으로 설정
            >
                <Table.ColumnGroup>
                    <Table.Column htmlWidth={isWide ? "55%" : "70%"} />
                    <Table.Column htmlWidth={isWide ? "15%" : "30%"} />
                    {isWide && (
                        <Table.Column htmlWidth={"30%"} />
                    )}
                </Table.ColumnGroup>
                <Table.Header>
                    <Table.Row bg="bg.muted">
                        <Table.ColumnHeader truncate>
                            {"Title"}
                        </Table.ColumnHeader>
                        <Table.ColumnHeader truncate>
                            {"Author"}
                        </Table.ColumnHeader>
                        {isWide && (
                            <Table.ColumnHeader truncate>
                                {"Updated At"}
                            </Table.ColumnHeader>
                        )}
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {data?.articles?.map((c) => (
                        <Table.Row
                            key={c.id}
                            onClick={() => linkPush(`/article/${c.id}`)}
                            cursor="pointer"
                        >
                            <Table.Cell truncate>
                                <HStack>
                                    {c.state === ArticleStateEnum.HIDE && (
                                        <Icon color={"gray"}>
                                            <AiOutlineEyeInvisible />
                                        </Icon>
                                    )}
                                    {c.state === ArticleStateEnum.FOR_KAIST && (
                                        <Badge colorPalette="blue" variant={"subtle"}>
                                            {"KAIST"}
                                        </Badge>
                                    )}
                                    <Text truncate>
                                        {c.title}
                                    </Text>
                                </HStack>
                            </Table.Cell>
                            <Table.Cell truncate>
                                {c.user.nameKr}
                            </Table.Cell>
                            {isWide && (
                                <Table.Cell truncate>
                                    {getString(c.timeUpdate)}
                                </Table.Cell>
                            )}
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>
        </Table.ScrollArea>
    );
}