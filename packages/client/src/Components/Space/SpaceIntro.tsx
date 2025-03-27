import React, { useState, useEffect } from "react";

import { IIntroduction } from "@scspace-depot/types/space";

interface SpaceIntroductionProps {
  data: IIntroduction;
}

const SpaceIntro: React.FC<SpaceIntroductionProps> = ({ data }) => {
  return (
    <div className="space">
      <div className="fst-italic">{data.intro}</div>
      {data.content.map((content, idx) => (
        <div key={idx}>
          <h4>{content.title}</h4>
          {content.body.map((body, idxHead) => (
            <div key={idxHead}>
              <div>{body.head}</div>
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
