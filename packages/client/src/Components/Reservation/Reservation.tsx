"use client";

import React, { useState } from "react";
import { useSpaces } from "@scspace-client/APIs/space/useSpaces";
import {
  Stack,
  Separator,
  Grid, GridItem,
  Button,
  Box,
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

const Reservation: React.FC = () => {
  const { spaceArray } = useSpaces();

  return (
    <Scroll>
      <Stack>
        <Grid
          templateColumns="repeat(6, 1fr)"
          gap={8}
          py={2}
        >
          <GridItem colSpan={{ base: 6, md: 3 }}>
            <SpaceForm />
          </GridItem>
          <GridItem colSpan={{ base: 6, md: 3 }}>
            <OrganizationForm />
          </GridItem>
          <GridItem colSpan={{ base: 6, md: 3 }}>
            <DateForm label="start date & time" />
          </GridItem>
          <GridItem colSpan={{ base: 6, md: 3 }}>
            <DateForm label="end date & time" />
          </GridItem>
          <GridItem colSpan={6}>
            <TitleForm />
          </GridItem>
          <GridItem colSpan={6}>
            <DescriptionForm />
          </GridItem>
          <GridItem colSpan={{ base: 6, md: 3 }}>
            <InnerPeopleForm />
          </GridItem>
          <GridItem colSpan={{ base: 6, md: 3 }}>
            <OuterPeopleForm />
          </GridItem>
          <GridItem colSpan={6}>
            <FoodForm />
          </GridItem>
          <GridItem colSpan={{ base: 6, md: 2 }}>
            <DeskForm />
          </GridItem>
          <GridItem colSpan={{ base: 6, md: 2 }}>
            <ChairForm />
          </GridItem>
          <GridItem colSpan={{ base: 6, md: 2 }}>
            <WorkerForm />
          </GridItem>
        </Grid>
        <Separator />
        <Button
          rounded="sm"
          width="100%"
        >
          Submit
        </Button>
      </Stack >
    </Scroll >
  );
};

export default Reservation;
