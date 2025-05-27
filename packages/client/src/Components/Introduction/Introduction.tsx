"use client";

import React, { useState } from "react";
import Scspace from "./Scspace";
import Business from "./Business";
import Rule from "./Rule";
import Scroll from "../_commons/Scroll";
import { Tabs } from "@chakra-ui/react";

const Introduction: React.FC = () => {
  const [info, setInfo] = useState([
    { which: "소개", text: <Scspace />, clicked: true },
    { which: "사업소개", text: <Business />, clicked: false },
    { which: "회칙", text: <Rule />, clicked: false },
  ]);

  const onClickEvent = (idx: number) => {
    const copiedInfo = info.map((item, i) => ({
      ...item,
      clicked: i === idx,
    }));

    setInfo(copiedInfo);
  };

  const [tabs, setTabs] = useState<{ value: string; page: React.ReactNode }[]>([
    { value: "Introduction", page: <Scspace /> },
    { value: "Business", page: <Business /> },
    { value: "Rules", page: <Rule /> },
  ]);

  return (
    <Scroll>
      <Tabs.Root defaultValue={tabs[0].value}>
        <Tabs.List>
          {tabs.map((tab) => (
            <Tabs.Trigger value={tab.value} key={"trigger" + tab.value}>
              {tab.value}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        {tabs.map((tab) => (
          <Tabs.Content value={tab.value} key={"content" + tab.value}>
            {tab.page}
          </Tabs.Content>
        ))}
      </Tabs.Root>
    </Scroll>
  );
};

export default Introduction;
