import { Center, Heading, Separator, StackSeparator, VStack } from "@chakra-ui/react";

export default function SpacePage() {
  return (
    <Center height="100%">
      <VStack separator={<StackSeparator />}>
        <VStack px={16}>
          <Heading>
            학생문화공간위원회
          </Heading>
        </VStack>
        <VStack px={16}>
          <Heading>
            SCSpace
          </Heading>
        </VStack>
      </VStack>
    </Center>
  );
};
