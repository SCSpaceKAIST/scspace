"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSpaces } from "@scspace-client/Apis/space/useSpaces";
import {
  Stack,
  Text,
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
} from "./forms";

const Reservation: React.FC = () => {
  const { spaceArray } = useSpaces();

  return (
    <Stack>
      <Text
        textStyle="3xl"
        fontWeight="semibold"
      >
        예약 | Reservation
      </Text>
      <Separator />
      <Grid
        templateColumns="repeat(6, 1fr)"
        gap={4}
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
  );

  // return (
  //   <main id="main">
  //     <section>
  //       <div className="container">
  //         <div id="portfolio" className="portfolio">
  //           <div className="container-fluid">
  //             <ul className="portfolio-flters"></ul>
  //           </div>
  //         </div>
  //
  //         <div>
  //           <section id="features" className="features scspace">
  //             <div className="container">
  //               <div className="tab-pane active show">
  //                 <div className="row gy-4">
  //                   <div>
  //                     <h3>공간위 예약</h3>
  //                     <hr />
  //                     <hr />
  //                     {spaceArray?.map(space => {
  //                       return (
  //                         <div key={`spaceReservationKey${space.id}`}>
  //                           <Link href={`/reservation/${space.id}`}>
  //                             {space.name}
  //                           </Link>
  //                           <br />
  //                         </div>
  //                       );
  //                     })}
  //                   </div>
  //                 </div>
  //               </div>
  //             </div>
  //           </section>
  //         </div>
  //       </div>
  //     </section>
  //   </main>
  // );
};

export default Reservation;
