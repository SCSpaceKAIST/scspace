"use clien"

import { Center, Heading, StackSeparator, VStack } from "@chakra-ui/react";
import { ISpace } from "@scspace-depot/types/space";

export default function SpaceIntro({ space }: { space: ISpace }) {

  return (
    <Center height="100%">
      <VStack separator={<StackSeparator />}>
        <VStack px={16}>
          <Heading>
            {space.nameKr}
          </Heading>
        </VStack>
        <VStack px={16}>
          <Heading>
            {space.nameEn}
          </Heading>
        </VStack>
      </VStack>
    </Center>
  );
}
