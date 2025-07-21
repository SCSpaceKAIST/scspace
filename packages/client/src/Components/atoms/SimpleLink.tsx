import { Link as ChakraLink } from "@chakra-ui/react";
import NextLink from "next/link";

export default function SimpleLink({ href, text }: {
    href: string;
    text: string;
}) {
    return (
        <ChakraLink asChild variant={"underline"} _hover={{ color: "teal" }}>
            <NextLink href={href}>
                {text}
            </NextLink>
        </ChakraLink>
    );
}