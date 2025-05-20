"use client";

import {
  Box,
  Center,
  Dialog,
  Flex,
  Grid,
  GridItem,
  IconButton,
  Portal,
  Separator,
  Stack,
  Text,
  Alert,
  CloseButton,
  Float,
  Circle
} from "@chakra-ui/react";
import Scroll from "../_commons/Scroll";
import SelectComponent from "../Reservation/forms/utils/Select";
import { DateForm } from "../Reservation/forms";
import { IRes, IReservationHookRes, useReservations } from "@scspace-client/Hooks/reservation";
import { useEffect, useState } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { useAllSpace } from "@scspace-client/Hooks/space";

function SpaceSelect() {
  const { spaces } = useAllSpace();

  return (
    <SelectComponent
      label="Space Name"
      placeholder="Select Space"
      optionList={spaces}
    />
  );
}

function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash |= 0;
  }

  const hue = Math.abs(hash) % 360;
  const saturation = 30 + (Math.abs(hash) % 20);
  const lightness = 70 + (Math.abs(hash) % 10);

  const s = saturation / 100;
  const l = lightness / 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((hue / 60) % 2 - 1));
  const m = l - c / 2;

  let r = 0, g = 0, b = 0;
  if (hue < 60) { r = c; g = x; b = 0; }
  else if (hue < 120) { r = x; g = c; b = 0; }
  else if (hue < 180) { r = 0; g = c; b = x; }
  else if (hue < 240) { r = 0; g = x; b = c; }
  else if (hue < 300) { r = x; g = 0; b = c; }
  else { r = c; g = 0; b = x; }

  const toHex = (v: number) => Math.round((v + m) * 255).toString(16).padStart(2, '0');

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
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
                  {(i + 1).toString().padStart(2, '0')}:00
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
    if (RESs[count] && (i === RESs[count].hourFrom)) {
      _RESs.push({ data: RESs[count], color: stringToColor(RESs[count].title) });
      i = RESs[count].hourTo;
      count += 1;
    } else _RESs.push(i);
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
          <Center
            width="100%"
            height="100%"
          >
            {
              r.data.title
            }
          </Center>
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
              {(r + 1).toString().padStart(2, '0')}:00
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
  const [searchDate, setSearchDate] = useState<{ dateFrom: Date, dateTo: Date }>({
    dateFrom: dateFrom,
    dateTo: dateTo
  });
  const [alertOpen, setAlertOpen] = useState<boolean>(false);

  const { reservation } = useReservations({
    spaceId: 1,
    dateFrom: searchDate.dateFrom,
    dateTo: searchDate.dateTo,
  });

  useEffect(() => {
    setRes(reservation);
  }, [reservation]);

  function search() {
    if ((new Date(dateTo.valueOf() - dateFrom.valueOf())).getDate() > 14) {
      setAlertOpen(true);
    } else {
      setSearchDate({
        dateFrom: dateFrom,
        dateTo: dateTo
      });
    }
  }

  return (
    <>
      <Dialog.Root
        role="alertdialog"
        open={alertOpen}
        onOpenChange={(e) => setAlertOpen(e.open)}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner onClick={() => setAlertOpen(false)}>
            <Dialog.Content>
              <Alert.Root status="error">
                <Alert.Indicator />
                <Alert.Content>
                  <Alert.Title>
                    2주 초과의 기간은 검색할 수 없습니다.
                  </Alert.Title>
                  <Alert.Description>
                    You can't search for periods longer than two weeks.
                  </Alert.Description>
                </Alert.Content>
                <CloseButton pos="relative" top={-2} insetEnd={-2} />
              </Alert.Root>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
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
            <Stack direction="row" width="48vh" gap={2} alignItems="end">
              <IconButton
                variant="outline"
                rounded="sm"
                onClick={search}
              >
                <HiOutlineSearch />
                {(searchDate.dateFrom.toISOString() !== dateFrom.toISOString() || searchDate.dateTo.toISOString() !== dateTo.toISOString()) && (
                  <Float>
                    <Circle size="3" bg="red" />
                  </Float>
                )}
              </IconButton>
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
    </>
  );
};