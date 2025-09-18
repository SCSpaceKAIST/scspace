"use client"

import { Box, Center, Grid, Heading, Mark, Stack, Text } from "@chakra-ui/react";
import { ISpace } from "@scspace-depot/types/space";
import Image from "next/image";
import { SpaceInfo, SpaceInfoMatcher } from "@scspace-depot/consts/space.const";
import { useEffect, useState } from "react";
import LoadingComponent from "@scspace-client/Components/atoms/Loading";

export default function SpaceIntro({ space }: { space: ISpace }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
  }, [space.id]);

  return (
    <Grid templateRows="auto auto 1fr" h={"full"} gap={4}>
      <Heading>
        {space.nameKr} <br />
        <Mark color={"gray"}>{space.nameEn}</Mark>
      </Heading>
      <Center aspectRatio={5 / 4}>
        <Box
          position="relative"
          h={"full"}
          w={"full"}
        >
          {!loaded && <LoadingComponent />}
          <Image
            src={`/img/spaces/${SpaceInfo[SpaceInfoMatcher[space.id]].img}.jpg`}
            alt="LOGO"
            fill
            objectFit="contain"
            onLoad={() => setLoaded(true)}
          />
        </Box>
      </Center>
      <Text>
        {SpaceInfo[SpaceInfoMatcher[space.id]].desc}
      </Text>
    </Grid>
  );
}
