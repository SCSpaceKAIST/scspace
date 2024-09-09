"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import {
  SpaceTypeEnum,
  SpaceTypeNames,
  SpaceTypesArray,
} from "@depot/types/space";
import { useSpaces } from "@/Hooks/useSpaces";

const Reservation: React.FC = () => {
  const { t } = useTranslation();
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
                      <p>
                        <b>아래 공간들의 예약을 진행하실 수 있습니다</b>
                      </p>
                      <hr />
                      {spaceArray?.map((space) => {
                        return (
                          <div>
                            <Link href={`/reservation/${space.space_id}`}>
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
