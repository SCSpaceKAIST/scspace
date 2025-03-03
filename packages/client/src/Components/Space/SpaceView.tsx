import React, { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import {
  ISpaceIntroduction,
  ISpace,
  SpaceTypeNames,
  IIntroduction,
  ISpaceIntroductionResponse,
} from "@depot/types/space";
import SpaceIntro from "@Components/Space/SpaceIntro";

interface SpaceViewProps {
  spaceId: number;
}

const SpaceView: React.FC<SpaceViewProps> = ({ spaceId }) => {
  const [spaceInfo, setSpaceInfo] = useState<ISpaceIntroductionResponse>();
  const [menu, setMenu] = useState<0 | 1 | 2>(0);
  const [intro, setIntro] = useState<React.FC>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/api/space/info/${spaceId}`);
        setSpaceInfo(res.data);
        //alert(JSON.stringify(res.data));
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [spaceId]);

  const renderIntro = () => {
    if (!spaceInfo) return <div>Loading...</div>;

    switch (menu) {
      case 0:
        return <SpaceIntro data={spaceInfo.introduction} />;
      case 1:
        return <SpaceIntro data={spaceInfo.usage} />;
      case 2:
        return <SpaceIntro data={spaceInfo.caution} />;
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
            <h2>{SpaceTypeNames[spaceInfo.spaceType]}</h2>
            <p>{}</p>
          </div>
          <hr />
          <div className="container">
            <div className="row g-4 g-lg-5">
              <div className="col-lg-5">
                <div className="about-img">
                  <Image
                    src={`/img/spaces/${spaceInfo.spaceType}.jpg`}
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
