"use client";

import { Breadcrumb, Button } from "@chakra-ui/react";
import { usePathname } from "next/navigation";
import { Fragment } from "react";
import { Link, } from "@chakra-ui/react"

export default function BreadcrumbComponent() {
    const pathname = usePathname();

    const paths = pathname.split('/');
    let temp = "";
    const pathnames = paths.filter((p) => p).map((path, idx) => {
        temp += "/" + path;
        return {
            href: temp,
            value: path,
            isFinal: (paths.length === idx + 2),
        };
    });

    return (
        <Breadcrumb.Root
            variant="plain"
            display={{ base: "none", md: "block" }}
        >
            <Breadcrumb.List margin={0} padding={0}>
                <Breadcrumb.Item>
                    <Breadcrumb.Link
                        as={Link}
                        href="/"
                        textDecoration="none"
                    >
                        <Button
                            variant="outline"
                            rounded="sm"
                        >
                            Home
                        </Button>
                    </Breadcrumb.Link>
                </Breadcrumb.Item>
                {pathnames.map((pn) => (
                    <Fragment key={pn.href}>
                        <Breadcrumb.Separator />
                        <Breadcrumb.Item>
                            <Breadcrumb.Link
                                as={Link}
                                href={pn.href}
                                textDecoration="none"
                            >
                                <Button
                                    variant={pn.isFinal ? "solid" : "outline"}
                                    rounded="sm"
                                >
                                    {pn.value}
                                </Button>
                            </Breadcrumb.Link>
                        </Breadcrumb.Item>
                    </Fragment>
                ))}
            </Breadcrumb.List>
        </Breadcrumb.Root>
    );
}