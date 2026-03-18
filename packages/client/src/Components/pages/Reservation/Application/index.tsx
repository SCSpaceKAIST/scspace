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
  HourForm
} from "@scspace-client/Components/organisms/Reservation/Forms/index";
import Scroll from "@scspace-client/Components/molecules/page/Scroll";
import { useAuth } from "@scspace-client/Hooks/auth";
import { SmallLoading } from "@scspace-client/Components/atoms/Loading";
import { CalendarView } from "@scspace-client/Components/organisms/Reservation/Calendar";
import { useReservationAPI } from "@scspace-client/Hooks/reservation";
import { toaster } from "@scspace-client/Components/atoms/Toaster";
import { dateUtils } from "@scspace-client/Hooks/utils";
import InputComponent from "@scspace-client/Components/molecules/forms/Input";
import { useMailAPI } from "@scspace-client/Hooks/mail";
import { IndividualOrganizationId } from "@scspace-depot/consts/organization.const";

export default function ReservationApplication() {
  const { userInfo, needLogin } = useAuth();
  needLogin();

  const _init = new Date();
  const [dateFrom, setDateFrom] = useState<Date>(() => new Date(_init.getFullYear(), _init.getMonth(), _init.getDate()));
  const [dateTo, setDateTo] = useState<Date>(() => new Date(_init.getFullYear(), _init.getMonth(), _init.getDate()));

  useEffect(() => {
    if (dateFrom > dateTo) setDateTo(dateFrom);
  }, [dateFrom, dateTo]);

  useEffect(() => {
    if (dateFrom > dateTo) setDateFrom(dateTo);
  }, [dateFrom, dateTo]);

  const [hourFrom, setHourFrom] = useState<number>(0);
  const [hourTo, setHourTo] = useState<number>(0);

  const [spaceId, setSpaceId] = useState<number>(1);
  const [orgId, setOrgId] = useState<number>(IndividualOrganizationId);
  const [title, setTitle] = useState<string>("");
  const [dscrp, setDscrp] = useState<string>("");
  const [inner, setInner] = useState<number>(10);
  const [outer, setOuter] = useState<number>(0);
  const [food, setFood] = useState<string>("");
  const [worker, setWorker] = useState<boolean>(false);
  const [check, setCheck] = useState<boolean>(false);
  const [workerNeedReason, setWorkerNeedReason] = useState<string>("");

  const createReservation = useReservationAPI().createRes;
  const sendMail = useMailAPI().sendMail;

  const [e, setE] = useState<string | null>(null);

  const { getTime } = dateUtils();

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
            busking: check && (spaceId === 13),
            workerNeed: (spaceId === 10 || spaceId === 11) ? worker : false
          },
          userId: userInfo.id,
          organizationId: orgId,
          spaceId: spaceId,
          title: title,
          timeFrom: getTime(dateFrom) + getTime({ hour: hourFrom }),
          timeTo: getTime(dateTo) + getTime({ hour: hourTo }),
        },
        {
          onSuccess: () => {
            setCount(c => c + 1);
            if (worker && (spaceId === 10 || spaceId === 11)) {
              sendMail({
                to: "scspace.kaist@gmail.com",
                subject: `근로 요청 이유: ${userInfo.nameKr}`,
                template: "workerNeedReason",
                context: {
                  meta: {
                    description: workerNeedReason
                  }
                }
              });
            }
          },
          onError: (error) => {
            setE(error.message);
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
            <DeskForm />
          </GridItem>
          <GridItem colSpan={{ base: 6, md: 2 }}>
            <ChairForm />
          </GridItem>
          {(spaceId === 10 || spaceId === 11) && (
            <GridItem colSpan={{ base: 6, md: 2 }}>
              <WorkerForm
                value={worker}
                setValue={setWorker}
              />
            </GridItem>
          )}
          {worker && (spaceId === 10 || spaceId === 11) && (
            <GridItem colSpan={6}>
              <Stack>
                <Text>
                  Please describe the reason for needing workers. This information will help us understand your requirements better.
                </Text>
                <InputComponent
                  label="Reason for Needing Workers"
                  placeholder="Input Reason"
                  value={workerNeedReason}
                  onChange={setWorkerNeedReason}
                />
              </Stack>
            </GridItem>
          )}
        </Grid>
        <Separator />
        <Button rounded="sm" width="100%" onClick={submit}>
          Submit
        </Button>
      </Stack >
    </Scroll >
  );
};
