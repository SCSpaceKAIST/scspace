"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import {
  SpaceTypeEnum,
  SpaceTypeNames,
  SpaceTypesArray,
} from "@depot/types/space";

const Space: React.FC = () => {
  const { t } = useTranslation();

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
                      <h3>공간위 관리 공간</h3>
                      <hr />
                      <p>
                        <b>공간위에서는 아래의 공간들을 관리합니다!</b>
                      </p>
                      <p>
                        <b>
                          공간들의 유지보수, 예약, 근로 교육 등을 진행하고
                          있습니다.
                        </b>
                      </p>
                      <hr />
                      {SpaceTypesArray.map((spaceType, idx) => {
                        return (
                          <div>
                            <Link href={`/space/${idx}`}>
                              {SpaceTypeNames[spaceType as SpaceTypeEnum]}{" "}
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

export default Space;
