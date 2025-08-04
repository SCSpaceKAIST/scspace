"use client"

import { Card, Center, Heading, HStack, Separator, StackSeparator, useBreakpointValue, VStack, Wrap } from "@chakra-ui/react";
import Scroll from "@scspace-client/Components/molecules/page/Scroll";
import { useLinkPush } from "@scspace-client/Hooks/api";
import { IRedirect, useRedirectStore } from "@scspace-client/Store/redirect";
import { useRedirects } from "@scspace-client/Store/redirect/reset";

function RedirectCard({ links }: {
  links: IRedirect[],
}) {
  const { linkPush } = useLinkPush();
  const visibleLinks = links.filter(link => !link.invisible && !link.disabled);

  return (
    <VStack justify={"center"} minH={"100%"} width={"100%"} align={"center"}>
      {visibleLinks.map((link) => (
        <Card.Root
          height={"full"}
          width={"full"}
          variant={"outline"}
          colorPalette={"white"}
          key={link.href}
          _hover={{ borderColor: "blue" }}
          onClick={() => linkPush(link.href)}
          cursor="pointer"
        >
          <Card.Header>
            <HStack separator={<StackSeparator />} width="100%">
              <Card.Title>{link.label}</Card.Title>
              <Card.Title>{link.helperText}</Card.Title>
            </HStack>
          </Card.Header>
          <Card.Footer justifyContent="flex-end">
            <Card.Description>
              {link.href}
            </Card.Description>
          </Card.Footer>
        </Card.Root>
      ))}
    </VStack>
  )
}

export default function SpacePage() {
  const { links } = useRedirectStore();
  const isWide = useBreakpointValue({ base: false, md: true });

  useRedirects();

  return (
    <Scroll>
      <Center minH={"100%"}>
        <VStack width={isWide ? "50%" : "100%"} align="center" justify="center"
          separator={<StackSeparator />}
        >
          <HStack separator={<StackSeparator />}>
            <Heading>
              학생문화공간위원회
            </Heading>
            <Heading>
              SCSpace
            </Heading>
          </HStack>
          <RedirectCard links={links} />
        </VStack>
      </Center>
    </Scroll >
  );
};
