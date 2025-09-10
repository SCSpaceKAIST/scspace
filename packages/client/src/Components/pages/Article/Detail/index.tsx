"use client"

import { Badge, Card, Flex, Grid, IconButton, Spacer, Textarea, useBreakpointValue } from "@chakra-ui/react";
import LoadingComponent from "@scspace-client/Components/atoms/Loading";
import RefetchBtn from "@scspace-client/Components/molecules/buttons/RefetchBtn";
import { useLinkPush } from "@scspace-client/Hooks/api";
import { useArticleAPI } from "@scspace-client/Hooks/article";
import { ArticleTypeString } from "@scspace-depot/consts/article.const";
import { HiHome } from "react-icons/hi";

export default function ArticleDetail({ id }: { id: number }) {
    const { data, refetch } = useArticleAPI({ id }).articleById;

    const { linkPush } = useLinkPush();

    return (
        <Grid
            templateRows={"auto 1fr"}
            gap={2}
        >
            <Flex gap={2}>
                <IconButton
                    onClick={() => linkPush("/article")}
                    variant={"outline"}
                >
                    <HiHome />
                </IconButton>
                <Spacer />
                <RefetchBtn refetch={refetch} />
            </Flex>

            <Card.Root>
                {data ? (<>
                    <Card.Header>
                        <Flex>
                            <Card.Title>
                                {data.title}
                            </Card.Title>
                            <Spacer />
                            <Badge colorPalette={"blue"}>
                                {ArticleTypeString[data.type as keyof typeof ArticleTypeString]}
                            </Badge>
                        </Flex>
                    </Card.Header>
                    <Card.Body>
                        <Textarea
                            readOnly
                            variant={"flushed"}
                            autoresize
                            cursor={"default"}
                            defaultValue={data.content ?? ""}
                        />
                    </Card.Body>
                </>) : (<LoadingComponent />)}
            </Card.Root>
        </Grid>
    );
}