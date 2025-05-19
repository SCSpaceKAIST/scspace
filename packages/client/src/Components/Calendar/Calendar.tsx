"use client";

import {
  Box,
  Center,
  Flex,
  Grid,
  GridItem,
  Separator,
  Stack,
  Text
} from "@chakra-ui/react";
import Scroll from "../_commons/Scroll";
import SelectComponent from "../Reservation/forms/utils/Select";
import { DateForm } from "../Reservation/forms";
import { IRes, IReservationHookRes, useReservations } from "@scspace-client/Hooks/reservation";
import { useEffect, useState } from "react";
import { createHash } from "crypto";

function SpaceSelect() {
  const spaces = [
    { label: "Space 1", value: "1" },
    { label: "Space 2", value: "2" },
    { label: "Space 3", value: "3" },
  ]

  return (
    <SelectComponent
      label="Space Name"
      placeholder="Select Space"
      optionList={spaces}
    />
  );
}

function getSha256Prefix(input: string, length = 6): string {
  const hash = createHash("sha256").update(input).digest("hex");
  return hash.slice(0, length);
}

function Day({ RESs }: { RESs: IRes[] }) {
  console.log("RESs", RESs)
  if (RESs.length === 0) {
    const temp = [];
    for (let i = 0; i < 24; i += 1) temp.push(i);

    return (
      <Grid
        width="100%"
        templateRows="repeat(24, 1fr)"
        margin={0}
      >
        {temp.map((_, i) => {
          return (
            <GridItem
              key={i}
              width="100%"
            >
              <Separator />
              <Box
                width="100%"
                height="64px"
                padding={1}
                textAlign="end"
                alignContent="end"
              >
                <Text
                  padding={0}
                  margin={0}
                  color="gray.focusRing"
                >
                  {i.toString().padStart(2, '0')}:00
                </Text>
              </Box>
            </GridItem>
          );
        })}
      </Grid>
    );
  }

  const _RESs: (number | {
    data: IRes;
    color: string;
  })[] = [];
  let count = 0;
  for (let i = 0; i < 24; i += 1) {
    if (count == RESs.length || i < RESs[count].hourFrom) _RESs.push(i);
    else if (i === RESs[count].hourFrom) {
      _RESs.push({ data: RESs[count], color: "#" + getSha256Prefix(RESs[count].title) });
      i = RESs[count].hourTo;
      count += 1;
    }
  }

  return (
    <Grid
      width="100%"
      templateRows="repeat(24, 1fr)"
      margin={0}
    >
      {_RESs.map((r, j) => ((typeof r !== "number") ? (
        <GridItem
          rowSpan={r.data.hourTo + 1 - r.data.hourFrom}
          width="100%"
          key={r.data.title + " - " + j.toString()}
          bg={r.color}
        >
          <Separator />
          <Box
            width="100%"
            height="100%"
          >
            {r.data.title}
          </Box>
        </GridItem>
      ) : (
        <GridItem
          key={j}
          width="100%"
        >
          <Separator />
          <Box
            width="100%"
            height="64px"
            padding={1}
            textAlign="end"
            alignContent="end"
          >
            <Text
              padding={0}
              margin={0}
              color="gray.focusRing"
            >
              {r.toString().padStart(2, '0')}:00
            </Text>
          </Box>
        </GridItem>
      )))}
    </Grid>
  );
}

export default function Calendar() {
  const [res, setRes] = useState<IReservationHookRes>({});
  const [dateFrom, setDateFrom] = useState<Date>(() => new Date());
  const [dateTo, setDateTo] = useState<Date>(() => new Date());

  const { reservation } = useReservations({
    spaceId: 1,
    dateFrom: dateFrom,
    dateTo: dateTo,
  });

  useEffect(() => {
    setRes(reservation);
  }, [reservation]);

  return (
    <Scroll>
      <Grid
        height="100%"
        templateRows="auto 1fr"
        gap={2}
      >
        <Flex
          justify="space-between"
        >
          <Stack width="24vh">
            <SpaceSelect />
          </Stack>
          <Stack direction="row" width="48vh" gap={2}>
            <DateForm
              label="start date"
              date={dateFrom}
              setDate={setDateFrom}
              maxDate={dateTo}
            />
            <DateForm
              label="end date"
              date={dateTo}
              setDate={setDateTo}
              minDate={dateFrom}
            />
          </Stack>
        </Flex>
        <Box
          id="scroll"
          overflow="auto"
          scrollBehavior="smooth"
          minH={0}
          minW={0}
          maxH="100%"
          maxW="100%"
          rounded="sm"
          borderWidth="1px"
        >
          <Grid
            templateColumns={`repeat(${Object.keys(res).length}, 1fr)`}
            gap={0}
          >
            {Object.keys(res).map((k, i) => (
              <Stack
                direction="row"
                minW="32vh"
                key={i}
                gap={0}
              >
                {(i > 0) && <Separator orientation="vertical" height="100%" />}
                <Stack
                  width="100%"
                  gap={0}
                >
                  <Center>
                    <Text
                      margin={1}
                      padding={0}
                    >
                      {k}
                    </Text>
                  </Center>
                  <Day RESs={res[k]} />
                </Stack>
              </Stack>
            ))}
          </Grid>
        </Box>
      </Grid>
    </Scroll >
  );
};