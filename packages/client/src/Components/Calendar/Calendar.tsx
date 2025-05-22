"use client";

import {
  Box,
  Center,
  Dialog,
  Flex,
  Grid,
  GridItem,
  Portal,
  Stack,
  Text,
  Float,
  Spinner,
  VStack,
  Button,
  DataList,
  Separator,
  HStack,
} from "@chakra-ui/react";
import Scroll from "../_commons/Scroll";
import SelectComponent from "../Reservation/forms/utils/Select";
import { DateForm } from "../Reservation/forms";
import { useDateReservations, useReservations } from "@scspace-client/Hooks/reservation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useAllSpace } from "@scspace-client/Hooks/space";
import LoadingComponent from "../Loading/Loading";
import { IReservationAll } from "@scspace-depot/types/reservation";
import DeleteBtn from "./DeleteBtn";
import { useAuth } from "@scspace-client/Hooks/auth";

function SpaceSelect({ setSpaceId }: {
  setSpaceId: Dispatch<SetStateAction<number>>;
}) {
  const { spaces } = useAllSpace();

  return (spaces ? (
    <SelectComponent
      label="Space Name"
      optionList={spaces.map((s) => {
        return {
          label: s.nameKr,
          description: s.nameEn,
          value: s.id.toString()
        }
      })}
      onChange={(e) => setSpaceId(parseInt(e.value))}
    />
  ) : (
    <Center bg="bg.muted" rounded="sm" height="100%">
      <Spinner />
    </Center>
  ));
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

export function CalendarView({ refetchCounter = 0, spaceId, dateFrom, dateTo }: {
  refetchCounter?: number;
  spaceId: number;
  dateFrom: Date;
  dateTo: Date;
}) {
  const { dateReservation, refetch } = useDateReservations({ spaceId, dateFrom, dateTo, });
  const dates = Object.keys(dateReservation);
  const times = Array.from({ length: 24 }, (_, i) => i);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => { refetch() }, [refetchCounter]);

  const [selected, setSelected] = useState<number>(0);
  const { reservations, refetch: refetchDetail } = useReservations({ spaceId, dateFrom, dateTo });
  const [selectedRes, setSelectedRes] = useState<IReservationAll | null>(null);

  useEffect(() => {
    if (!reservations) {
      setSelectedRes(null);
      return;
    }
    const filtered = reservations.filter(r => (r.id === selected));
    if (filtered.length === 0) {
      setSelectedRes(null);
      return;
    }
    setSelectedRes(filtered[0]);
  }, [selected]);

  function onDeleteSuccess() {
    refetch();
    setOpen(false);
  }

  const { userInfo } = useAuth();

  return (
    <>
      <Dialog.Root
        open={open}
        onOpenChange={(e) => setOpen(e.open)}
        size="xl"
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              {selectedRes ? (
                <>
                  <Dialog.Header>
                    <HStack width="100%" justifyContent="space-between" alignItems="start">
                      <Dialog.Title whiteSpace="nowrap">
                        {selectedRes.title}
                      </Dialog.Title>
                      <DataList.Root orientation="horizontal" gap={1} color="fg.muted">
                        <DataList.Item gap={0}>
                          <DataList.ItemLabel>
                            Create Time
                          </DataList.ItemLabel>
                          <DataList.ItemValue margin={0}>
                            {selectedRes.timePost}
                          </DataList.ItemValue>
                        </DataList.Item>
                        <DataList.Item gap={0}>
                          <DataList.ItemLabel>
                            Update Time
                          </DataList.ItemLabel>
                          <DataList.ItemValue margin={0}>
                            {selectedRes.timeUpdate}
                          </DataList.ItemValue>
                        </DataList.Item>
                      </DataList.Root>
                    </HStack>
                  </Dialog.Header>
                  <Dialog.Body>
                    <DataList.Root orientation="horizontal" width="100%">
                      <DataList.Item gap={0}>
                        <DataList.ItemLabel>
                          Description
                        </DataList.ItemLabel>
                        <DataList.ItemValue margin={0}>
                          {selectedRes.content.description}
                        </DataList.ItemValue>
                      </DataList.Item>
                      <Separator />
                      <DataList.Item gap={0} alignItems="start">
                        <DataList.ItemLabel>
                          Content
                        </DataList.ItemLabel>
                        <DataList.ItemValue margin={0} >
                          <DataList.Root orientation="horizontal" margin={0} >
                            <DataList.Item gap={0}>
                              <DataList.ItemLabel>
                                # of Internal
                              </DataList.ItemLabel>
                              <DataList.ItemValue margin={0} >
                                {selectedRes.content.innerParticipantNumber}
                              </DataList.ItemValue>
                            </DataList.Item>
                            <DataList.Item gap={0}>
                              <DataList.ItemLabel>
                                # of External
                              </DataList.ItemLabel>
                              <DataList.ItemValue margin={0} >
                                {selectedRes.content.outerParticipantNumber}
                              </DataList.ItemValue>
                            </DataList.Item>
                            <DataList.Item gap={0}>
                              <DataList.ItemLabel>
                                Food Info
                              </DataList.ItemLabel>
                              <DataList.ItemValue margin={0}>
                                {(selectedRes.content.food === "") ? (
                                  <Text margin={0} padding={0} color="bg.emphasized">
                                    Did Not Entered
                                  </Text>
                                ) : (selectedRes.content.food)}
                              </DataList.ItemValue>
                            </DataList.Item>
                            <DataList.Item gap={0}>
                              <DataList.ItemLabel>
                                # of Desk
                              </DataList.ItemLabel>
                              <DataList.ItemValue margin={0} >
                                {selectedRes.content.desk}
                              </DataList.ItemValue>
                            </DataList.Item>
                            <DataList.Item gap={0}>
                              <DataList.ItemLabel>
                                # of Chair
                              </DataList.ItemLabel>
                              <DataList.ItemValue margin={0} >
                                {selectedRes.content.chair}
                              </DataList.ItemValue>
                            </DataList.Item>
                            <DataList.Item gap={0}>
                              <DataList.ItemLabel>
                                # of Worker
                              </DataList.ItemLabel>
                              <DataList.ItemValue margin={0} >
                                {selectedRes.content.workerNeed}
                              </DataList.ItemValue>
                            </DataList.Item>
                            {(selectedRes.spaceId === 11) && (
                              <DataList.Item gap={0}>
                                <DataList.ItemLabel>
                                  Lobby
                                </DataList.ItemLabel>
                                <DataList.ItemValue margin={0} >
                                  {selectedRes.content.lobby ? "Yes" : "No"}
                                </DataList.ItemValue>
                              </DataList.Item>
                            )}
                            {(selectedRes.spaceId === 13) && (
                              <DataList.Item gap={0}>
                                <DataList.ItemLabel>
                                  Busking Zone
                                </DataList.ItemLabel>
                                <DataList.ItemValue margin={0} >
                                  {selectedRes.content.busking ? "Yes" : "No"}
                                </DataList.ItemValue>
                              </DataList.Item>
                            )}
                          </DataList.Root>
                        </DataList.ItemValue>
                      </DataList.Item>
                      <Separator />
                      <DataList.Item gap={0}>
                        <DataList.ItemLabel>
                          Time
                        </DataList.ItemLabel>
                        <DataList.ItemValue margin={0} >
                          {selectedRes.timeFrom} - {selectedRes.timeTo}
                        </DataList.ItemValue>
                      </DataList.Item>
                      <DataList.Item gap={0}>
                        <DataList.ItemLabel>
                          Space
                        </DataList.ItemLabel>
                        <DataList.ItemValue margin={0} >
                          {selectedRes.space.nameKr} ({selectedRes.space.nameEn})
                        </DataList.ItemValue>
                      </DataList.Item>
                      <DataList.Item gap={0}>
                        <DataList.ItemLabel>
                          Booker
                        </DataList.ItemLabel>
                        <DataList.ItemValue margin={0} >
                          {(selectedRes.organizationId === 1) ? (
                            selectedRes.user.nameKr
                          ) : (
                            selectedRes.organization.name
                          )}
                        </DataList.ItemValue>
                      </DataList.Item>
                    </DataList.Root>
                  </Dialog.Body>
                  <Dialog.Footer>
                    <DeleteBtn rid={selectedRes.id} onSuccess={onDeleteSuccess} />
                    <Dialog.ActionTrigger asChild>
                      {(userInfo?.id === selectedRes.userId) && (
                        <Button variant="outline" rounded="sm">
                          Close
                        </Button>
                      )}
                    </Dialog.ActionTrigger>
                  </Dialog.Footer>
                </>
              ) : (
                <Center margin={8}>
                  <LoadingComponent />
                </Center>
              )}
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root >
      <Box
        id="scroll"
        position="relative"
        overflowX="auto"
        overflowY="auto"
        minH={0}
        minW={0}
        maxH="100%"
        maxW="100%"
        rounded="sm"
        borderLeftWidth="1px"
        borderTopWidth="1px"
      >
        <Grid
          templateColumns={`auto repeat(${Object.keys(dateReservation).length}, 1fr)`}
          templateRows="auto repeat(24, 1fr)"
          gap={0}
          minW="max-content"
        >
          <GridItem
            rowStart={1}
            colStart={1}
            bg="bg.muted"
            position="sticky"
            top={0}
            left={0}
            zIndex={3}
            borderBottomWidth="1px"
            borderRightWidth="1px"
          />

          {/* Date headers */}
          {dates.map((date, i) => (
            <GridItem
              key={date}
              rowStart={1}
              colStart={i + 2}      // shift right by 1
              bg="bg.muted"
              position="sticky"
              top={0}
              zIndex={1}
              borderBottomWidth="1px"
              borderRightWidth="1px"
              textAlign="center"
            >
              <Text fontWeight="semibold" mx={0} my={2} padding={0}>
                {date}
              </Text>
            </GridItem>
          ))}

          {/* Time labels in first column */}
          {times.map((hour) => (
            <GridItem
              key={hour}
              rowStart={hour + 2}   // shift down by 1
              colStart={1}
              bg="bg.muted"
              position="sticky"
              left={0}
              zIndex={1}
              borderRightWidth="1px"
              borderBottomWidth={(hour === 23) ? "1px" : "0"}
            >
              <Center height="100%" mx={3} color="bg.muted">
                <Text fontSize="sm" margin={0} padding={0} visibility="hidden">
                  00:00
                </Text>
                {(hour > 0) && (
                  <Float placement="top-center">
                    <Text fontSize="sm" margin={0} padding={0} color="black">
                      {hour.toString().padStart(2, "0")}:00
                    </Text>
                  </Float>
                )}
              </Center>
            </GridItem>
          ))}

          {/* Now the actual day slots */}
          {dates.map((date, ci) =>
            times.map((hour, ri) => {
              const slot = dateReservation[date].find(
                (r) => r.hourFrom <= hour && r.hourTo > hour
              );
              if (!slot) {
                return (
                  <GridItem
                    key={`${date}-${hour}`}
                    rowStart={hour + 2}
                    colStart={ci + 2}
                    borderBottomWidth="1px"
                    borderRightWidth="1px"
                    // minW="32vh"
                    height="64px"
                  />
                );
              } else if (slot.hourFrom === hour) {
                // span multi-hour bookings
                return (
                  <GridItem
                    key={`${date}-${hour}`}
                    rowStart={hour + 2}
                    colStart={ci + 2}
                    rowSpan={slot.hourTo - slot.hourFrom}
                    bg={stringToColor(slot.title)}
                    borderBottomWidth="1px"
                    borderRightWidth="1px"
                  >
                    <Button
                      asChild
                      rounded="0"
                      variant="ghost"
                      onClick={() => {
                        setSelected(slot.id);
                        setOpen(true)
                      }}
                    >
                      <VStack
                        height="100%"
                        width="100%"
                        margin={0}
                        padding={0}
                        gap={0}
                        justifyContent="center"
                      >
                        <Text margin={0} padding={0} fontSize="lg" fontWeight="semibold">
                          {slot.title}
                        </Text>
                        <Text margin={0} padding={0} fontSize="sm">
                          {slot.name}
                        </Text>
                      </VStack>
                    </Button>
                  </GridItem>
                );
              }
              // we skip rendering rows that are covered by a span
              return null;
            })
          )}
        </Grid>
      </Box>
    </>
  );
}

export default function Calendar() {
  const [date, setDate] = useState<Date>(() => new Date());
  const [spaceId, setSpaceId] = useState<number>(1);

  const [searchData, setSearchData] = useState<{
    spaceId: number;
    dateFrom: Date,
    dateTo: Date
  } | null>(null);

  useEffect(() => {
    const dS = new Date(date);
    const dE = new Date(date);
    const d = date.getDay();

    dS.setDate(dS.getDate() - d);
    dE.setDate(dS.getDate() + 6);

    setSearchData({
      spaceId: spaceId,
      dateFrom: dS,
      dateTo: dE
    });
  }, [spaceId, date.getTime()]);

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
          <Stack width="24vh" minW="fit-content">
            <SpaceSelect setSpaceId={setSpaceId} />
          </Stack>
          <Stack
            direction="row"
            width="24vh"
            minW="fit-content"
            gap={2}
            alignItems="end"
          >
            <DateForm
              label="select date"
              date={date}
              setDate={setDate}
            />
          </Stack>
        </Flex>
        {searchData ? (
          <CalendarView
            spaceId={searchData.spaceId}
            dateFrom={searchData.dateFrom}
            dateTo={searchData.dateTo}
          />
        ) : (
          <LoadingComponent />
        )}
      </Grid>
    </Scroll >
  );
};