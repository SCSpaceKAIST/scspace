import { Center, Heading, Separator, StackSeparator, VStack } from "@chakra-ui/react";

export default function SpacePage() {
  return (
    <Center height="100%">
      <VStack separator={<StackSeparator />}>
        <VStack px={16}>
          <Heading>
            홈 화면은 개발중입니다.
          </Heading>
          <Heading>
            사이드 메뉴를 이용하시길 바랍니다.
          </Heading>
        </VStack>
        <VStack px={16}>
          <Heading>
            The home screen is under development.
          </Heading>
          <Heading>
            Please use the side menu.
          </Heading>
        </VStack>
      </VStack>
    </Center>
  );
};
