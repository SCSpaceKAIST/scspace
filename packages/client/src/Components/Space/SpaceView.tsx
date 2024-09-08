import React, { useState, useEffect } from "react";
import Image from "next/image";

import axios from "axios";

import { useTranslation } from "react-i18next";
import {
  IntroductionType,
  ShortIntroType,
  SpaceIntroductionOutputType,
  SpaceIntroductionType,
  SpaceTypeNames,
} from "@depot/types/space";
import SpaceIntro from "@Components/Space/SpaceIntro";

interface SpaceViewProps {
  space_id: number;
}

const SpaceView: React.FC<SpaceViewProps> = ({ space_id }) => {
  const { t } = useTranslation();
  const [spaceInfo, setSpaceInfo] = useState<SpaceIntroductionOutputType>();
  const [menu, setMenu] = useState<0 | 1 | 2>(0);
  const [intro, setIntro] = useState<React.FC>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/space/info/${space_id}`);
        setSpaceInfo(res.data);
        //alert(JSON.stringify(res.data));
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [space_id]);

  const renderIntro = () => {
    if (!spaceInfo) return <div>Loading...</div>;

    switch (menu) {
      case 0:
        return <SpaceIntro data={spaceInfo.introduction as IntroductionType} />;
      case 1:
        return <SpaceIntro data={spaceInfo.usage as IntroductionType} />;
      case 2:
        return <SpaceIntro data={spaceInfo.caution as IntroductionType} />;
      default:
        return <div>Select a menu</div>;
    }
  };

  if (!spaceInfo) return <div>Loading...</div>;

  return (
    <div>
      {spaceInfo ? (
        <section>
          <div className="section-header">
            <h2>{SpaceTypeNames[spaceInfo.space_type]}</h2>
            <p>{}</p>
          </div>
          <hr />
          <div className="container">
            <div className="row g-4 g-lg-5">
              <div className="col-lg-5">
                <div className="about-img">
                  <Image
                    src={`/img/spaces/${spaceInfo.space_type}.jpg`}
                    alt=""
                    height={450}
                    width={400}
                  />
                </div>
              </div>
              <div className="col-lg-7">
                <h3 className="pt-0 pt-lg-5">
                  {spaceInfo.shortintro.shortintro}
                </h3>

                <nav>
                  <ul className="nav nav-pills mb-3">
                    <li>
                      <button
                        className="modal-button1"
                        onClick={() => {
                          setMenu(0);
                        }}
                      >
                        소개
                      </button>
                    </li>
                    <li>
                      {" "}
                      <button
                        className="modal-button1"
                        onClick={() => {
                          setMenu(1);
                        }}
                      >
                        사용법
                      </button>
                    </li>
                    <li>
                      {" "}
                      <button
                        className="modal-button1"
                        onClick={() => {
                          setMenu(2);
                        }}
                      >
                        주의사항
                      </button>
                    </li>
                  </ul>
                </nav>
                {/* Content rendering based on menu */}
                <div>{renderIntro()}</div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <div />
      )}
    </div>
  );
};

export default SpaceView;
