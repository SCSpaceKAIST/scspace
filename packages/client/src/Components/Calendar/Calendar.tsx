"use client";

import {
  Box,
  Center,
  Dialog,
  Flex,
  Grid,
  GridItem,
  Portal,
  Text,
  Float,
  Spinner,
  Button,
  DataList,
  Separator,
  HStack,
  useBreakpointValue,
  CloseButton,
  IconButton,
} from "@chakra-ui/react";
import Scroll from "../_commons/Scroll";
import SelectComponent from "../Reservation/forms/utils/Select";
import { useDateReservations, useReservations } from "@scspace-client/Hooks/reservation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useAllSpace } from "@scspace-client/Hooks/space";
import LoadingComponent from "../Loading/Loading";
import { IReservationAll } from "@scspace-depot/types/reservation";
import DeleteBtn from "./DeleteBtn";
import { useAuth } from "@scspace-client/Hooks/auth";
import { useDate } from "@scspace-client/Hooks/utils";
import { UserTypeEnum } from "@scspace-depot/enums/user.enum";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";

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
    const filtered = reservations.find(r => (r.id === selected));
    console.log(reservations, filtered);
    if (!filtered) {
      setSelectedRes(null);
      return;
    }
    setSelectedRes(filtered);
  }, [selected]);

  function onDeleteSuccess() {
    refetch();
    setOpen(false);
  }

  const { userInfo } = useAuth();

  const { getString } = useDate();

  const isWide = useBreakpointValue({ base: false, md: true });

  return (
    <>
      <Dialog.Root
        open={open}
        onOpenChange={(e) => setOpen(e.open)}
        size={isWide ? "cover" : "full"}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content className={isWide ? "" : "full"}>
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
                            {getString(selectedRes.timePost)}
                          </DataList.ItemValue>
                        </DataList.Item>
                        <DataList.Item gap={0}>
                          <DataList.ItemLabel>
                            Update Time
                          </DataList.ItemLabel>
                          <DataList.ItemValue margin={0}>
                            {getString(selectedRes.timeUpdate)}
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
                          {getString(selectedRes.timeFrom)} - {getString(selectedRes.timeTo)}
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
                    {userInfo && ((userInfo.id === selectedRes.userId) || (userInfo.type === UserTypeEnum.MANAGER) || (userInfo.type === UserTypeEnum.ADMIN)) && (
                      <DeleteBtn rid={selectedRes.id} onSuccess={onDeleteSuccess} />
                    )}
                    <Dialog.ActionTrigger asChild>
                      <Button variant="outline" rounded="sm">
                        Close
                      </Button>
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
        bg="white"
      >
        <Grid
          templateColumns={`60px repeat(${Object.keys(dateReservation).length}, 1fr)`}
          templateRows="auto repeat(24, 1fr)"
          gap={0}
          minW="100%"
          width="fit-content"
          maxW="fit-content"
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
              minW={{ base: "120px", md: 0 }}
              width="100%"
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
              height="64px"
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
            times.map((hour) => {
              const _slot = dateReservation[date].map((d, i) => { return { slot: d, i } }).find(
                (r) => (r.slot.hourFrom <= hour && r.slot.hourTo > hour)
              );
              const slot = _slot?.slot ?? null;
              const i = _slot?.i ?? -1;
              if (slot) {
                if (slot.hourFrom === hour) {
                  // span multi-hour bookings
                  return (
                    <GridItem
                      key={`${date}-${hour}`}
                      rowStart={hour + 2}
                      colStart={ci + 2}
                      rowSpan={slot.hourTo - slot.hourFrom}
                      bg={stringToColor(slot.title)}
                      minW={0}
                      overflow="hidden"
                    >
                      <Button
                        asChild
                        rounded="0"
                        variant="ghost"
                        width="100%"
                        height="100%"
                        minW={0}
                        padding={1}
                        onClick={() => {
                          setSelected(slot.id);
                          setOpen(true)
                        }}
                      >
                        <Flex
                          flexDir="column"
                          width="100%"
                          height="100%"
                          margin={0}
                          padding={1}
                          gap={0}
                          justifyContent="center"
                          overflow="hidden"
                          minW={0}
                        >
                          <Text
                            margin={0}
                            padding={0}
                            fontWeight="semibold"
                            width="100%"
                            textOverflow="ellipsis"
                            whiteSpace="nowrap"
                            overflow="hidden"
                            textAlign="center"
                          >
                            {slot.title}
                          </Text>
                          <Text
                            margin={0}
                            padding={0}
                            fontSize="xs"
                            width="100%"
                            textOverflow="ellipsis"
                            whiteSpace="nowrap"
                            overflow="hidden"
                            textAlign="center"
                          >
                            {slot.name}
                          </Text>
                        </Flex>
                      </Button>
                    </GridItem>
                  );
                } else if (slot.hourFrom === 0 && slot.hourTo === 24 && i > 0) {
                  return (
                    <GridItem
                      key={`${date}-${hour}`}
                      rowStart={hour + 2}
                      colStart={ci + 2}
                      borderBottomWidth="1px"
                      borderRightWidth="1px"
                      height="64px"
                      minW={0}
                    />
                  );
                }
                // return null;
              } else if (!slot) {
                // we skip rendering rows that are covered by a span
                return (
                  <GridItem
                    key={`${date}-${hour}`}
                    rowStart={hour + 2}
                    colStart={ci + 2}
                    borderBottomWidth="1px"
                    borderRightWidth="1px"
                    height="64px"
                    minW={0}
                  />
                );
              } else if (dateReservation[date][i - 1] && dateReservation[date][i - 1].hourTo <= hour) {
                // we skip rendering rows that are covered by a span
                return (
                  <GridItem
                    key={`${date}-${hour}`}
                    rowStart={hour + 2}
                    colStart={ci + 2}
                    borderBottomWidth="1px"
                    borderRightWidth="1px"
                    height="64px"
                    minW={0}
                  />
                );
              }

              return null;
            })
          )}
        </Grid>
      </Box>
    </>
  );
}

export default function Calendar({ spaceId }: { spaceId: number }) {
  const [date, setDate] = useState<Date>(() => new Date());
  const [open, setOpen] = useState<boolean>(false);
  const [text, setText] = useState<string>("")

  const [searchData, setSearchData] = useState<{
    spaceId: number;
    dateFrom: Date,
    dateTo: Date
  } | null>(null);

  useEffect(() => {
    const dS = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const dE = new Date(dS);
    const d = date.getDay();

    dS.setDate(dS.getDate() - d);
    dE.setDate(dE.getDate() - d + 6);

    setText(dS.toLocaleDateString() + " - " + dE.toLocaleDateString());

    setSearchData({
      spaceId: spaceId,
      dateFrom: dS,
      dateTo: dE
    });
  }, [spaceId, date.getTime()]);

  const isWide = useBreakpointValue({ base: false, md: true });

  return (
    <Scroll>
      <Grid
        height="100%"
        templateRows="auto 1fr"
        gap={2}
      >
        <Dialog.Root size={isWide ? "xs" : "full"} open={open} onOpenChange={(e) => setOpen(e.open)}>
          <Grid templateColumns="auto 1fr auto" gap={2}>
            <IconButton variant="outline" bg={{ base: "bg", _hover: "bg.muted" }} onClick={() => setDate((d) => {
              const _d = new Date(d);
              _d.setDate(d.getDate() - 7);
              return _d;
            })}>
              <HiChevronLeft />
            </IconButton>
            <Dialog.Trigger asChild width="100%">
              <Button variant="outline" width="100%" bg="white">
                {text}
              </Button>
            </Dialog.Trigger>
            <IconButton variant="outline" bg={{ base: "bg", _hover: "bg.muted" }} onClick={() => setDate((d) => {
              const _d = new Date(d);
              _d.setDate(d.getDate() + 7);
              return _d;
            })}>
              <HiChevronRight />
            </IconButton>
          </Grid>
          <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content className={isWide ? "" : "full"}>
                <Dialog.Header>
                  <Dialog.Title>
                    Pick Week
                  </Dialog.Title>
                </Dialog.Header>
                <Dialog.Body>
                  <Center>
                    <DatePicker
                      wrapperClassName="datepicker"
                      showWeekPicker
                      selected={date}
                      onChange={(e) => {
                        if (e) setDate(e);
                        setOpen(false);
                      }}
                      inline
                    />
                  </Center>
                </Dialog.Body>
                <Dialog.CloseTrigger asChild>
                  <CloseButton />
                </Dialog.CloseTrigger>
              </Dialog.Content>
            </Dialog.Positioner>
          </Portal>
        </Dialog.Root>
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
}