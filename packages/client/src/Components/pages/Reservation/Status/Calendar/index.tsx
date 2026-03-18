"use client";

import {
  Center,
  Dialog,
  Grid,
  Portal,
  Button,
  useBreakpointValue,
  CloseButton,
  IconButton,
} from "@chakra-ui/react";
import Scroll from "../../../../molecules/page/Scroll";
import { useEffect, useState } from "react";
import LoadingComponent from "../../../../atoms/Loading";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { CalendarView } from "../../../../organisms/Reservation/Calendar";
import RefetchBtn from "@scspace-client/Components/molecules/buttons/RefetchBtn";

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
  }, [date, spaceId]);

  const isWide = useBreakpointValue({ base: false, md: true });
  const [refetchCounter, setRefetchCounter] = useState(0);

  return (
    <Scroll>
      <Grid
        height="100%"
        templateRows="auto 1fr"
        gap={2}
      >
        <Dialog.Root size={isWide ? "xs" : "full"} open={open} onOpenChange={(e) => setOpen(e.open)}>
          <Grid templateColumns="auto 1fr auto auto" gap={2}>
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
            <RefetchBtn refetch={() => setRefetchCounter(c => c + 1)} />
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
            refetchCounter={refetchCounter}
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
