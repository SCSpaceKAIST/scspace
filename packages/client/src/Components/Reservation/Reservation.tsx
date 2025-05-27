"use client";

import React, { useEffect, useState } from "react";
import {
  Stack,
  Separator,
  Grid, GridItem,
  Button,
  Text,
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
import { useDate } from "@scspace-client/Hooks/utils";

export default function Reservation() {
  const { userInfo, needLogin } = useAuth();
  needLogin();

  const _init = new Date();
  const [dateFrom, setDateFrom] = useState<Date>(() => new Date(_init.getFullYear(), _init.getMonth(), _init.getDate()));
  const [dateTo, setDateTo] = useState<Date>(() => new Date(_init.getFullYear(), _init.getMonth(), _init.getDate()));

  const [hourFrom, setHourFrom] = useState<number>(0);
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

  const [e, setE] = useState<string>();

  const { getTime } = useDate();

  function submit() {
    if (title === "") {
      toaster.warning({
        title: "Reservate Failed",
        description: "Please enter title"
      });
      return;
    }

    if (dscrp === "") {
      toaster.warning({
        title: "Reservate Failed",
        description: "Please enter description"
      });
      return;
    }

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
            busking: check && (spaceId === 13),
            workerNeed: worker
          },
          userId: userInfo.id,
          organizationId: orgId,
          spaceId: spaceId,
          title: title,
          timeFrom: getTime(dateFrom) + getTime({ hour: hourFrom }),
          timeTo: getTime(dateTo) + getTime({ hour: hourTo }),
        },
        {
          onSuccess: (res) => {
            setCount(c => c + 1);
            console.log("SUCCESS", res)
          },
          onError: (error) => {
            setE(error.message);
            console.log("ERROR\n", error.message);
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
          description: e ?? "Please resubmit"
        }
      }
    );
  }

  const [count, setCount] = useState<number>(0);

  return (
    <Scroll>
      <Stack>
        <Text color="fg.subtle">
          {'Before making a reservation, please register your organization under "My Page > Organization."'}
        </Text>
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
            />
          </GridItem>
          <GridItem colSpan={{ base: 6, md: 3 }}>
            <DateForm
              label="end date"
              date={dateTo}
              setDate={setDateTo}
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
              // dateFrom={new Date(dateFrom.getFullYear(), dateFrom.getMonth(), dateFrom.getDate() - 1)}
              // dateTo={new Date(dateTo.getFullYear(), dateTo.getMonth(), dateTo.getDate() + 1)}
              dateFrom={dateFrom}
              dateTo={dateTo}
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
