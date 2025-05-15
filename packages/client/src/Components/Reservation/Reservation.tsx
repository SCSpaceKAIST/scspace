"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSpaces } from "@scspace-client/Apis/space/useSpaces";

const Reservation: React.FC = () => {
  const { spaceArray } = useSpaces();

  return (
    <main id="main">
      <section>
        <div className="container">
          <div id="portfolio" className="portfolio">
            <div className="container-fluid">
              <ul className="portfolio-flters"></ul>
            </div>
          </div>

          <div>
            <section id="features" className="features scspace">
              <div className="container">
                <div className="tab-pane active show">
                  <div className="row gy-4">
                    <div>
                      <h3>공간위 예약</h3>
                      <hr />
                      <hr />
                      {spaceArray?.map(space => {
                        return (
                          <div key={`spaceReservationKey${space.id}`}>
                            <Link href={`/reservation/${space.id}`}>
                              {space.name}
                            </Link>
                            <br />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Reservation;
