"use client"

import { Card, Center, Heading, HStack, Separator, StackSeparator, VStack, Wrap } from "@chakra-ui/react";
import Scroll from "@scspace-client/Components/molecules/page/Scroll";
import { useLinkPush } from "@scspace-client/Hooks/api";
import { useAuth } from "@scspace-client/Hooks/auth";
import { IRedirect, useRedirectStore } from "@scspace-client/Store/redirect";
import { useRedirects } from "@scspace-client/Store/redirect/reset";

function RedirectCard({ links, width }: {
  links: IRedirect[],
  width?: string,
}) {
  const { linkPush } = useLinkPush();
  const visibleLinks = links.filter(link => !link.invisible && !link.disabled);

  return (
    <Wrap justify={"center"} minH={"100%"} width={"100%"}>
      {visibleLinks.map((link) => (
        <Card.Root
          height={"full"}
          width={width ?? "100%"}
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
          {link.subdomains && link.subdomains.length > 0 && (
            <Card.Body>
              <RedirectCard links={link.subdomains} />
            </Card.Body>
          )}
          <Card.Footer justifyContent="flex-end">
            <Card.Description>
              {link.href}
            </Card.Description>
          </Card.Footer>
        </Card.Root>
      ))}
    </Wrap>
  )
}

export default function SpacePage() {
  const { isLogined } = useAuth();
  const { links } = useRedirectStore();

  useRedirects();

  return (
    <Scroll>
      <VStack>
        <Heading size={"2xl"}>
          안녕하세요, 학생문화공간위원회 입니다.
        </Heading>
        <Heading size={"2xl"}>
          Hello, this is the SCSpace.
        </Heading>
        <Separator width={"180px"} />
        <Heading size={"lg"}>
          아래 버튼을 클릭하여 서비스로 이동할 수 있습니다.
        </Heading>
        <Heading size={"lg"}>
          You can click the button below to navigate to the services.
        </Heading>
        <Separator width={"180px"} />
        <RedirectCard
          links={links} width="32%"
        />
      </VStack>
    </Scroll>
  );
};
