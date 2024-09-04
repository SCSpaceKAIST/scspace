import React, { useState, useEffect } from "react";

import { IntroductionType } from "@depot/types/space";

interface SpaceIntroductionProps {
  data: IntroductionType;
}

const SpaceIntro: React.FC<SpaceIntroductionProps> = ({ data }) => {
  return (
    <div className="space">
      <p className="fst-italic">{data.intro}</p>
      {data.content.map((content, idx) => (
        <div key={idx}>
          <h4>{content.title}</h4>
          {content.body.map((body, idxHead) => (
            <div key={idxHead}>
              <p>{body.head}</p>
              <ul>
                {body.list.map((item, listIdx) => (
                  <li key={listIdx}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default SpaceIntro;
