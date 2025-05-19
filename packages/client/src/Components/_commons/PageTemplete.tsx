import React, { Fragment } from "react";
import {
    Stack,
    Separator,
    Grid,
    Heading,
    Breadcrumb
} from "@chakra-ui/react";

function Title({ t }: { t: string; }) {
    return (
        <Breadcrumb.Item>
            <Heading
                color="black"
                textStyle="3xl"
                fontWeight="semibold"
                margin={0}
            >
                {t}
            </Heading>
        </Breadcrumb.Item>
    );
}


function Subtitle({ t }: { t: string; }) {
    return (
        <Breadcrumb.Item>
            <Heading
                textStyle="lg"
                margin={0}
            >
                {t}
            </Heading>
        </Breadcrumb.Item>
    );
}

export default function PageTemplete({
    title,
    subtitle,
    children
}: {
    title: string | string[];
    subtitle: string | string[];
    children: React.ReactNode;
}) {
    return (
        <Grid
            gap={2}
            height="100%"
            templateRows="auto 1fr"
        >
            <Stack
                height="100%"
            >
                <Stack
                    align="flex-start"
                    gap={0}
                >
                    <Breadcrumb.Root
                        size="lg"
                    >
                        <Breadcrumb.List
                            margin={0}
                            padding={0}
                        >
                            {(typeof title === "string") ? (
                                <Title t={title} />
                            ) : (title.map((t, i) => (
                                <Fragment key={i + t}>
                                    {(i > 0) && <Breadcrumb.Separator />}
                                    <Title t={t} />
                                </Fragment>
                            )))}
                        </Breadcrumb.List>
                    </Breadcrumb.Root>
                    <Breadcrumb.Root>
                        <Breadcrumb.List
                            margin={0}
                            padding={0}
                        >
                            {(typeof subtitle === "string") ? (
                                <Subtitle t={subtitle} />
                            ) : (subtitle.map((t, i) => (
                                <Fragment key={t + i}>
                                    {(i > 0) && <Breadcrumb.Separator />}
                                    <Subtitle t={t} />
                                </Fragment>
                            )))}
                        </Breadcrumb.List>
                    </Breadcrumb.Root>
                </Stack>
                <Separator />
            </Stack>
            {children}
        </Grid>
    );
}