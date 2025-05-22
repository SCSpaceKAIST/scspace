"use client";

import React, { useState } from "react";
import {
  Stack,
  Separator,
  Grid, GridItem,
  Button,
} from "@chakra-ui/react";
import {
  SpaceForm,
  OrganizationForm,
  TitleForm,
  DescriptionForm,
  InnerPeopleForm,
  OuterPeopleForm,
  FoodForm,
  DeskForm,
  ChairForm,
  WorkerForm,
  DateForm,
} from "./forms/index";
import Scroll from "../_commons/Scroll";
import { useAuth } from "@scspace-client/Hooks/auth";
import { SmallLoading } from "../Loading/Loading";
import { CalendarView } from "../Calendar/Calendar";
import { HourForm } from "./forms/elements/Hour";
import { useReservationAPI } from "@scspace-client/Hooks/reservation";
import { toaster } from "../_commons/Toaster";

function formatTime(date: Date, hour: number) {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}T${hour.toString().padStart(2, '0')}:00:00.000Z`;
}

export default function Reservation() {
  const [dateFrom, setDateFrom] = useState<Date>(() => new Date());
  const [hourFrom, setHourFrom] = useState<number>(0);
  const [dateTo, setDateTo] = useState<Date>(() => new Date());
  const [hourTo, setHourTo] = useState<number>(0);
  const [spaceId, setSpaceId] = useState<number>(1);
  const [orgId, setOrgId] = useState<number>(1);
  const [title, setTitle] = useState<string>("");
  const [dscrp, setDscrp] = useState<string>("");
  const [inner, setInner] = useState<number>(10);
  const [outer, setOuter] = useState<number>(0);
  const [food, setFood] = useState<string>("");
  const [desk, setDesk] = useState<number>(0);
  const [chair, setChair] = useState<number>(0);
  const [worker, setWorker] = useState<number>(0);
  const [check, setCheck] = useState<boolean>(false);

  const createReservation = useReservationAPI().createRes;
  const { userInfo } = useAuth();

  function submit() {
    if (!userInfo) return;

    toaster.promise(
      createReservation(
        {
          content: {
            description: dscrp,
            innerParticipantNumber: inner,
            outerParticipantNumber: outer,
            food: food,
            desk: desk,
            chair: chair,
            lobby: check && (spaceId === 11),
            busking: check && (spaceId === 13),
            workerNeed: worker
          },
          userId: userInfo.id,
          organizationId: orgId,
          spaceId: spaceId,
          title: title,
          timeFrom: formatTime(dateFrom, hourFrom),
          timeTo: formatTime(dateTo, hourTo),
        },
        {
          onSuccess: (res) => {
            setCount(c => c + 1);
            console.log("SUCCESS", res)
          },
          onError(error, variables, context) {
            console.log("ERROR", error, variables, context)
          },
        }
      ),
      {
        loading: {
          title: "Submitting...",
          description: "Please wait",
        },
        success: {
          title: "Submitted Successfully!",
          description: "Enjoy Your Reservation",
        },
        error: {
          title: "Reservate Failed",
          description: "ERROR MESSAGE"
        }
      }
    );


  }

  const [count, setCount] = useState<number>(0);

  return (
    <Scroll>
      <Stack>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            toaster.create({
              description: "File saved successfully",
              type: "info",
            })
          }
        >
          Show Toast
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            toaster.create({
              description: "1234",
              type: "error",
            })
          }
        >
          Show Toast
        </Button>
        <Grid
          templateColumns="repeat(6, 1fr)"
          gap={8}
          py={2}
        >
          <GridItem colSpan={{ base: 6, md: 3 }}>
            <SpaceForm
              setSpaceId={setSpaceId}
              setCheck={setCheck}
            />
          </GridItem>
          <GridItem colSpan={{ base: 6, md: 3 }}>
            {userInfo ? (
              <OrganizationForm
                id={userInfo.id}
                setOrgId={setOrgId}
              />
            ) : (
              <SmallLoading />
            )}
          </GridItem>
          <GridItem colSpan={{ base: 6, md: 3 }}>
            <DateForm
              label="start date"
              date={dateFrom}
              setDate={setDateFrom}
              maxDate={dateTo}
            />
          </GridItem>
          <GridItem colSpan={{ base: 6, md: 3 }}>
            <DateForm
              label="end date"
              date={dateTo}
              setDate={setDateTo}
              minDate={dateFrom}
            />
          </GridItem>
          <GridItem colSpan={{ base: 6, md: 3 }}>
            <HourForm
              label="start time"
              setHour={setHourFrom}
            />
          </GridItem>
          <GridItem colSpan={{ base: 6, md: 3 }}>
            <HourForm
              label="end time"
              setHour={setHourTo}
            />
          </GridItem>
          <GridItem colSpan={6} >
            <CalendarView
              dateFrom={new Date(dateFrom.getFullYear(), dateFrom.getMonth(), dateFrom.getDate() - 1)}
              dateTo={new Date(dateTo.getFullYear(), dateTo.getMonth(), dateTo.getDate() + 1)}
              spaceId={spaceId}
              refetchCounter={count}
            />
          </GridItem>
          <GridItem colSpan={6}>
            <TitleForm
              title={title}
              setTitle={setTitle}
            />
          </GridItem>
          <GridItem colSpan={6}>
            <DescriptionForm
              description={dscrp}
              setDescription={setDscrp}
            />
          </GridItem>
          <GridItem colSpan={{ base: 6, md: 3 }}>
            <InnerPeopleForm
              count={inner}
              setCount={setInner}
            />
          </GridItem>
          <GridItem colSpan={{ base: 6, md: 3 }}>
            <OuterPeopleForm
              count={outer}
              setCount={setOuter}
            />
          </GridItem>
          <GridItem colSpan={6}>
            <FoodForm
              food={food}
              setFood={setFood}
            />
          </GridItem>
          <GridItem colSpan={{ base: 6, md: 2 }}>
            <DeskForm
              count={desk}
              setCount={setDesk}
            />
          </GridItem>
          <GridItem colSpan={{ base: 6, md: 2 }}>
            <ChairForm
              count={chair}
              setCount={setChair}
            />
          </GridItem>
          <GridItem colSpan={{ base: 6, md: 2 }}>
            <WorkerForm
              count={worker}
              setCount={setWorker}
            />
          </GridItem>
        </Grid>
        <Separator />
        <Button rounded="sm" width="100%" onClick={submit}>
          Submit
        </Button>
      </Stack >
    </Scroll >
  );
};
